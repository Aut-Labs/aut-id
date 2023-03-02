/* eslint-disable react/button-has-type */
import { CanUpdateProfile } from "@auth/auth.reducer";
import AutLoading from "@components/AutLoading";
import { styled, useMediaQuery, useTheme } from "@mui/material";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import Scrollbar from "@components/Scrollbar";
import {
  AutIDProfiles,
  HolderData,
  HolderStatus,
  updateHolderState
} from "@store/holder/holder.reducer";
import PerfectScrollbar from "react-perfect-scrollbar";
import { ResultState } from "@store/result-status";
import { useSelector } from "react-redux";
import AutToolBar from "./AutToolBar";
import AutUserInfo from "./AutUserInfo";
import SelectAutIDProfileDialog from "@components/AutIDProfileList";
import { AutID } from "@api/aut.model";
import { useAppDispatch } from "@store/store.model";
import { lazy } from "react";

const AutLeftContainer = styled("div")(({ theme }) => ({
  display: "flex",
  flexDirection: "column"
}));

const AutCommunityEdit = lazy(() => import("./AutCommunityEdit"));
const AutProfileEdit = lazy(() => import("./AutProfileEdit"));

const AutLeft = ({ match }) => {
  const dispatch = useAppDispatch();
  const status = useSelector(HolderStatus);
  const profiles = useSelector(AutIDProfiles);
  const holderData = useSelector(HolderData);
  const navigate = useNavigate();
  const location = useLocation();
  const canUpdateProfile = useSelector(CanUpdateProfile);
  const theme = useTheme();
  const desktop = useMediaQuery(theme.breakpoints.up("md"));

  const onSelect = async (profile: AutID) => {
    const params = new URLSearchParams(location.search);
    params.set("network", profile.properties.network?.toLowerCase());
    navigate({
      pathname: `/${profile.name}`,
      search: `?${params.toString()}`
    });
    await dispatch(
      updateHolderState({
        selectedProfileAddress: profile.properties.address,
        selectedProfileNetwork: profile.properties.network?.toLowerCase()
      })
    );
  };

  return (
    <AutLeftContainer
      style={{
        width: desktop && status === ResultState.Success ? "50%" : "100%",
        height: "100vh"
      }}
    >
      <SelectAutIDProfileDialog
        profiles={profiles}
        onSelect={onSelect}
        open={profiles?.length > 1 && !holderData}
      />

      {status === ResultState.Loading || status === ResultState.Idle ? (
        <AutLoading />
      ) : (
        <>
          <AutToolBar isDesktop={desktop} />
          <PerfectScrollbar
            style={{
              height: "calc(100% - 84px)",
              display: "flex",
              flexDirection: "column"
            }}
          >
            <Routes>
              {holderData && <Route index element={<AutUserInfo />} />}
              {canUpdateProfile && (
                <>
                  <Route
                    path="edit-community/:communityAddress"
                    element={<AutCommunityEdit />}
                  />
                  <Route path="edit-profile" element={<AutProfileEdit />} />
                </>
              )}
            </Routes>
          </PerfectScrollbar>
        </>
      )}
    </AutLeftContainer>
  );
};

export default AutLeft;
