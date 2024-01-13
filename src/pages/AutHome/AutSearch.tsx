/* eslint-disable no-constant-condition */
/* eslint-disable no-unused-expressions */
import {
  Autocomplete,
  Avatar,
  Box,
  debounce,
  InputAdornment,
  Paper,
  styled,
  SvgIcon,
  Toolbar,
  Typography,
  useMediaQuery,
  useTheme
} from "@mui/material";

import { ReactComponent as MyAutIDLogo } from "@assets/MyAutIdLogoPath.svg";
import { ReactComponent as AutOsLogo } from "@assets/autos/os-logo.svg";

import { ReactComponent as RedirectIcon } from "@assets/RedirectIcon2.svg";
import { ReactComponent as ConcentricImage } from "@assets/ConcentricImage.svg";
import { ReactComponent as SearchIcon } from "@assets/SearchIcon.svg";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Controller, useForm } from "react-hook-form";
import {
  NoSearchResults,
  SearchResult,
  SearchStatus
} from "@store/search/search.reducer";
import { ResultState } from "@store/result-status";
import { AutID } from "@api/aut.model";
import { useAppDispatch } from "@store/store.model";
import { Player } from "@lottiefiles/react-lottie-player";
import * as animationData from "../../assets/load-id.json";
import { AutIDProfileList } from "@components/AutIDProfileList";
import { useEffect, useRef, useState } from "react";
import { fetchHolder, fetchSearchResults } from "@api/holder.api";
import { AutTextField } from "@theme/field-text-styles";
import { DautPlaceholder } from "@api/ProviderFactory/components/web3-daut-connect";
import React from "react";
import MainBackground from "../../MainBackground";
import AutToolBar from "../AutHolder/AutLeft/AutToolBar";
import { FollowPopover } from "@components/FollowPopover";
interface UserProfile {
  name: string;
}

const UserRow = styled("div")(({ theme }) => ({
  display: "flex",
  flexDirection: "row",
  height: "50px",
  margin: 0,
  width: "100%",
  cursor: "pointer",
  backgroundColor: "rgba(235, 235, 242, 0.05)",
  "&:not(:last-of-type)": {
    borderBottom: "1px solid rgba(235, 235, 242, 0.3)",
    borderTop: "none"
  },
  "&:last-of-type": {
    borderBottomLeftRadius: "6px",
    borderBottomRightRadius: "6px"
  },

  "&:hover": {
    backgroundColor: "rgba(235, 235, 242, 0.15)"
  },

  [theme.breakpoints.down("md")]: {
    display: "flex",
    flexDirection: "row",
    height: "40px",
    width: "100%",
    cursor: "pointer"
  }
}));

const AutBox = styled(Box)(({ theme }) => ({
  "&.MuiBox-root": {
    // width: "100%",
    // overflow: "hidden"
  },
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  height: "100%",
  alignItems: "center",
  position: "absolute",
  transform: "translate(-50%, -50%)",
  left: "50%",
  top: "50%",
  // backgroundImage: `url(${backgroundImage})`,
  // backgroundBlendMode: "hard-light",
  // backgroundSize: "cover",
  // backgroundRepeat: "repeat-y",

  [theme.breakpoints.down("xl")]: {
    justifyContent: "center"
  },

  [theme.breakpoints.down("sm")]: {
    justifyContent: "center"
  }
}));
const ContentWrapper = styled(Box)(({ theme }) => ({
  "&.MuiBox-root": {
    width: "100%"
    // overflow: "hidden"
  },
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  height: "100%",
  alignItems: "center",
  position: "absolute",
  transform: "translate(-50%, -50%)",
  left: "50%",
  top: "50%",

  [theme.breakpoints.down("xl")]: {
    justifyContent: "center"
  },

  [theme.breakpoints.down("sm")]: {
    justifyContent: "center"
  }
}));

const FieldWrapper = styled("div")(({ theme }) => ({
  flexDirection: "row",
  marginBottom: "20px",
  display: "flex",
  width: "500px",
  justifyContent: "center",
  alignItems: "center",

  [theme.breakpoints.down("sm")]: {
    justifyContent: "center",
    alignItems: "center",
    width: "90%"
  }
}));

const FormWrapper = styled("form")(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  width: "100%",
  marginTop: "30px",

  [theme.breakpoints.down("md")]: {
    marginTop: "20px",
    width: "100%",
    paddingLeft: "0",
    paddingRight: "0",
    alignItems: "center",
    justifyContent: "center",
    alignContent: "center"
  }
}));

const autocompleteService = { current: null };

function CustomPaper({ children }) {
  return (
    <Paper
      sx={{
        background: "transparent",
        padding: 0,
        border: "none",
        boxShadow: "none",
        display: "flex",
        alignContent: "center",
        justifyContent: "center",
        ".MuiAutocomplete-noOptions": {
          display: "none"
        }
      }}
    >
      {children}
    </Paper>
  );
}

const AutSearch = () => {
  const dispatch = useAppDispatch();
  const status = useSelector(SearchStatus);
  const noResults = useSelector(NoSearchResults);
  const searchResult: AutID[] = useSelector(SearchResult);
  const theme = useTheme();
  const desktop = useMediaQuery(theme.breakpoints.up("md"));
  const xs = useMediaQuery(theme.breakpoints.down("sm"));
  const navigate = useNavigate();
  const location = useLocation();
  const abort = useRef<AbortController>();
  const [value, setValue] = React.useState<UserProfile | null>(null);
  const [inputValue, setInputValue] = React.useState("");
  const [options, setOptions] = React.useState<readonly UserProfile[]>([]);
  const loaded = React.useRef(false);
  const [popoverEl, setPopoverEl] = useState(null);

  const [dimensions, setDimensions] = React.useState({
    width: 0,
    height: 0
  });

  React.useEffect(() => {
    const handleResize = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    handleResize();

    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []); // Empty array ensures effect is only run on mount and unmount

  function selectProfile(profile: AutID) {
    const params = new URLSearchParams(location.search);
    navigate({
      pathname: `/${profile.name}`
    });
    dispatch(
      fetchHolder({
        autName: profile.name,
        network: "mumbai"
      })
    );
  }
  const { control, handleSubmit } = useForm({
    mode: "onChange",
    defaultValues: {
      username: ""
    }
  });

  const onSubmit = async (data) => {
    abort.current = new AbortController();
    dispatch(
      fetchSearchResults({
        ...data,
        signal: abort.current?.signal
      })
    );
  };

  useEffect(() => {
    return () => abort.current && abort.current.abort();
  }, []);

  const fetch = React.useMemo(
    () =>
      debounce(
        (
          request: { input: string },
          callback: (results?: readonly UserProfile[]) => void
        ) => {
          // Simulate network request
          setTimeout(() => {
            // Simulated results (mocked data)
            const results = [
              {
                name: "Tao",
                network: "mumbai"
              },
              {
                name: "Barbaros",
                network: "mumbai"
              },
              {
                name: "jabyl",
                network: "mumbai"
              },
              {
                name: "JL",
                network: "mumbai"
              },
              {
                name: "ProudLemon",
                network: "mumbai"
              },
              {
                name: "Eulalie",
                network: "mumbai"
              },
              {
                name: "Mihanix",
                network: "mumbai"
              },
              {
                name: "AntAnt",
                network: "mumbai"
              }
            ].filter((user) =>
              user.name.toLowerCase().includes(request.input.toLowerCase())
            );

            callback(results as unknown as UserProfile[]);
          }, 400);
        },
        400 // debounce delay
      ),
    []
  );
  React.useEffect(() => {
    let active = true;

    if (inputValue === "") {
      setOptions(value ? [value] : []);
      return undefined;
    }

    fetch({ input: inputValue }, (results?: readonly UserProfile[]) => {
      if (active) {
        let newOptions: readonly UserProfile[] = [];

        if (value) {
          newOptions = [value];
        }

        if (results) {
          newOptions = [...newOptions, ...results];
        }

        setOptions(newOptions);
      }
    });

    return () => {
      active = false;
    };
  }, [value, inputValue, fetch]);

  return (
    <>
      <AutToolBar></AutToolBar>

      <MainBackground dimensions={dimensions}></MainBackground>
      <AutBox
        sx={{
          position: "fixed",
          width: "520px",
          height: "200px"
        }}
      >
        <ContentWrapper>
          <FormWrapper autoComplete="off" onSubmit={handleSubmit(onSubmit)}>
            <FieldWrapper>
              <Controller
                key="username"
                name="username"
                control={control}
                render={({ field: { name, value, onChange } }) => {
                  return (
                    <>
                      <Autocomplete
                        id="search-aut"
                        sx={{
                          width: 480
                        }}
                        getOptionLabel={(option) =>
                          typeof option === "string" ? option : option.name
                        }
                        filterOptions={(x) => x}
                        options={options}
                        autoComplete
                        PaperComponent={CustomPaper}
                        disableCloseOnSelect
                        open={true}
                        includeInputInList
                        filterSelectedOptions
                        value={value}
                        onChange={(
                          event: any,
                          newValue: UserProfile | null
                        ) => {
                          setOptions(
                            newValue ? [newValue, ...options] : options
                          );
                          setValue(newValue);
                        }}
                        onInputChange={(event, newInputValue) => {
                          setInputValue(newInputValue);
                        }}
                        ListboxProps={{
                          style: {
                            border: "none",
                            display: "flex",
                            margin: 0,
                            padding: 0,
                            flexDirection: "column",
                            background: "transparent",
                            backdropFilter: "blur(8px)",
                            width: "474px"
                          }
                        }}
                        renderInput={(params) => (
                          <AutTextField
                            {...params}
                            color="offWhite"
                            placeholder="Start typing to search..."
                            sx={{
                              ".MuiInputBase-input": {
                                "&::placeholder": {
                                  color: theme.palette.offWhite.main,
                                  opacity: 0.5
                                }
                              },
                              ".MuiInputBase-root": {
                                caretColor: theme.palette.primary.main,

                                fieldset: {
                                  border: "1.5px solid #82FBFB !important",
                                  borderRadius: "6px"
                                },
                                borderRadius: "6px",
                                background: "rgba(0, 0, 0, 0.64)",
                                boxShadow:
                                  // eslint-disable-next-line max-len
                                  `0px 16px 80px 0px ${theme.palette.primary.main}, 0px 0px 16px 0px rgba(20, 200, 236, 0.64), 0px 0px 16px 0px rgba(20, 200, 236, 0.32)`,
                                backdropFilter: "blur(8px)"
                              },
                              ".MuiInputLabel-root": {
                                color: "white"
                              },

                              ".MuiAutocomplete-popupIndicator": {
                                display: "none"
                              },
                              ".MuiAutocomplete-clearIndicator": {
                                background: "#818CA2",
                                borderRadius: "50%",
                                color: "black",
                                marginRight: "10px",
                                ":hover": {
                                  background: "#A7B1C4",
                                  color: "black"
                                }
                              }
                            }}
                          />
                        )}
                        renderOption={(props, option: any) => {
                          return (
                            <UserRow
                              onClick={() => selectProfile(option)}
                              key={option.name}
                            >
                              <div
                                style={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                  flex: "1",
                                  overflow: "hidden"
                                }}
                              >
                                <div
                                  style={{
                                    justifyContent: "start",
                                    alignItems: "center",
                                    height: "100%",
                                    display: "flex",
                                    flex: "1"
                                  }}
                                >
                                  <Typography
                                    sx={{
                                      display: "flex",
                                      alignSelf: "start",
                                      justifyContent: "start",
                                      alignItems: "start",
                                      padding: "3px",
                                      height: "100%",
                                      color: theme.palette.offWhite.main,
                                      m: "0px 10px"
                                    }}
                                    variant="h6"
                                    fontFamily="FractulRegular"
                                  >
                                    {option?.name}
                                  </Typography>
                                </div>
                              </div>
                            </UserRow>
                          );
                        }}
                      />
                      {/* <Autocomplete
                      sx={{ width: 500 }}
                      getOptionLabel={(option) =>
                        typeof option === "string" ? option : option.name
                      }
                      filterOptions={(x) => x}
                      options={options}
                      autoComplete
                      includeInputInList
                      filterSelectedOptions
                      value={value}
                      noOptionsText="No users"
                      onChange={(event: any, newValue: UserProfile | null) => {
                        setOptions(newValue ? [newValue, ...options] : options);
                        setValue(newValue);
                      }}
                      onInputChange={(event, newInputValue) => {
                        setInputValue(newInputValue);
                        console.log(newInputValue, "NEW INPUT VALUE");
                      }}
                      renderInput={(params) => (
                        <AutTextField
                          {...params}
                          variant="standard"
                          color="offWhite"
                          label="Search for a user..."
                        />
                      )}
                      renderOption={(props, option) => {
                        debugger;
                        const matches =
                          option.structured_formatting
                            .main_text_matched_substrings || [];

                        const parts = parse(
                          option.structured_formatting.main_text,
                          matches.map((match: any) => [
                            match.offset,
                            match.offset + match.length
                          ])
                        );

                        return (
                          <li {...props}>
                            <AutIDProfileList
                              profiles={parts}
                              onSelect={selectProfile}
                            />
                          </li>
                        );
                      }}
                    /> */}
                    </>
                  );
                }}
              />
            </FieldWrapper>
            <Typography
              variant="subtitle2"
              fontWeight="normal"
              zIndex="10"
              color="offWhite.main"
              sx={{
                width: {
                  _: "400px"
                }
              }}
            >
              Find anyone and connect with them - just type _
            </Typography>
          </FormWrapper>
        </ContentWrapper>
      </AutBox>
    </>
  );
};

export default AutSearch;
