import axios from "axios";
import { environment } from "./environment";
import AutSDKStorage from "@aut-protocol/sdk-storage";

export const sdkStorage = new AutSDKStorage({
  nftStorageKey: environment.nftStorageKey
});

export const isValidUrl = (uri: string) => {
  let url = null as any;
  try {
    url = new URL(uri);
  } catch (_) {
    return false;
  }
  return (
    url.protocol === "ipfs:" ||
    url.protocol === "http:" ||
    url.protocol === "https:"
  );
};

function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); // $& means the whole matched string
}

function replaceAll(str, find, replace) {
  return str.replace(new RegExp(escapeRegExp(find), "g"), replace);
}

export function ipfsCIDToHttpUrl(url: string, isJson = false) {
  if (!url) {
    return url;
  }
  if (!url.includes("https://"))
    return isJson
      ? `${environment.nftStorageUrl}/${replaceAll(
          url,
          "ipfs://",
          ""
        )}/metadata.json`
      : `${environment.nftStorageUrl}/${replaceAll(url, "ipfs://", "")}`;
  return url;
}

export function httpUrlToIpfsCID(url: string) {
  if (!url) {
    return url;
  }
  if (url.includes("https://")) {
    const notHttpsUrl = `${replaceAll(url, "https://", "")}`;
    const [_, __, cid, name] = notHttpsUrl.split("/");
    if (name) {
      return `ipfs://${cid}/${name}`;
    }
    return `ipfs://${cid}`;
  }
  return url;
}

export async function storeMetadata(
  json: any,
  convertImageBlobToFile: (blob: Blob) => File = null as any
) {
  if (convertImageBlobToFile && isValidUrl(json.image)) {
    const result = await axios.get(json.image, {
      responseType: "blob"
    });
    json.image = convertImageBlobToFile(result.data);
  }

  if (isValidUrl(json.image)) {
    return sdkStorage.storeAsBlob(json);
  }
  return sdkStorage.storeAsJson(json);
}
