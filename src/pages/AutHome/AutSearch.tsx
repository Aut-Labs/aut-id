/* eslint-disable no-unused-expressions */
import {
  Avatar,
  Box,
  Card,
  CardContent,
  CardHeader,
  Chip,
  InputAdornment,
  Link,
  styled,
  SvgIcon,
  Typography,
  useMediaQuery,
} from '@mui/material';
import { ReactComponent as MyAutIDLogo } from '@assets/MyAutIdLogo.svg';
import { ReactComponent as SearchIcon } from '@assets/SearchIcon.svg';
import { ReactComponent as RedirectIcon } from '@assets/RedirectIcon.svg';

import { useHistory, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { IsAuthenticated } from '@auth/auth.reducer';
import { pxToRem } from '@utils/text-size';
import { Controller, useForm } from 'react-hook-form';
import { AutTextField } from '@components/Fields/AutFields';
import { fetchSearchResults, NoSearchResults, SearchResult, SearchStatus } from '@store/search/search.reducer';
import { ResultState } from '@store/result-status';
import AutLoading from '@components/AutLoading';
import { AutID } from '@api/aut.model';
import { useAppDispatch } from '@store/store.model';
import { useState } from 'react';
import { Player } from '@lottiefiles/react-lottie-player';
import { ipfsCIDToHttpUrl } from '@api/storage.api';
import * as animationData from '../../assets/aut-load.json';

const AutBox = styled(Box)(({ theme }) => ({
  '&.MuiBox-root': {
    width: '100%',
  },
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  height: '100%',
  alignItems: 'center',
  position: 'absolute',
  transform: 'translate(-50%, -50%)',
  left: '50%',
  top: '50%',
}));
const TopWrapper = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  width: pxToRem(600),
  justifyContent: 'center',
  alignItems: 'center',

  '@media(max-width: 1024px)': {
    width: '80%',
  },

  '@media(max-width: 360px)': {
    width: '90%',
  },
});
const ResultWrapper = styled('div')({
  marginTop: pxToRem(20),
  display: 'flex',
  flexDirection: 'column',
  width: pxToRem(600),
  minHeight: pxToRem(200),
  justifyContent: 'flex-start',
  alignItems: 'center',

  '@media(max-width: 1024px)': {
    width: '80%',
  },

  '@media(max-width: 360px)': {
    width: '100%',
  },
});

const FieldWrapper = styled('div')({
  flexDirection: 'row',
  marginBottom: pxToRem(20),
  minHeight: pxToRem(70),
  display: 'flex',
  width: pxToRem(600),
  justifyContent: 'flex-start',
  alignItems: 'flex-start',

  '@media(max-width: 1024px)': {
    justifyContent: 'center',
    alignItems: 'center',
    width: '80%',
  },

  '@media(max-width: 360px)': {
    justifyContent: 'center',
    alignItems: 'center',
    width: '90%',
  },
});

const FormWrapper = styled('form')({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  width: '100%',

  '@media(max-width:1024px)': {
    width: '100%',
    paddingLeft: '0',
    paddingRight: '0',
    alignItems: 'center',
    justifyContent: 'center',
    alignContent: 'center',
  },
});

const UserRow = styled('div')({
  display: 'flex',
  flexDirection: 'row',
  height: pxToRem(80),
  width: '100%',
  cursor: 'pointer',
  borderBottom: '1px solid white',
  borderTop: '1px solid white',

  '&:not(:first-of-type)': {
    borderBottom: '1px solid white',
    borderTop: 'none',
  },

  '&:hover': {
    backgroundColor: 'rgba(67, 158, 221, 0.15)',
  },

  '@media(max-width:1024px)': {
    display: 'flex',
    flexDirection: 'row',
    height: pxToRem(80),
    width: '100%',
    cursor: 'pointer',
    borderBottom: '1px solid white',
    borderTop: '1px solid white',
  },
});

const AutSearch = ({ match }) => {
  const dispatch = useAppDispatch();
  const status = useSelector(SearchStatus);
  const noResults = useSelector(NoSearchResults);
  const searchResult: AutID[] = useSelector(SearchResult);
  const desktop = useMediaQuery('(min-width:1024px)');
  const xs = useMediaQuery('(max-width:360px)');
  const history = useHistory();

  function clickRow(username, network) {
    history.push(`/${network}/${username}`);
  }
  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    mode: 'onChange',
    defaultValues: {
      username: '',
    },
  });

  const onSubmit = async (data) => {
    dispatch(fetchSearchResults(data));
  };

  return (
    <AutBox>
      <TopWrapper>
        <MyAutIDLogo style={{ height: xs ? pxToRem(60) : pxToRem(120), width: xs ? pxToRem(200) : pxToRem(400) }} />
        <Typography
          sx={{
            mt: pxToRem(50),
            mb: pxToRem(20),
            fontSize: pxToRem(16),
            color: 'white',
            textAlign: 'left',
            fontWeight: 'bold',
            width: '100%',
          }}
        >
          Own your own Identity. <br />
        </Typography>
        <Typography
          sx={{
            mb: pxToRem(50),
            fontSize: pxToRem(16),
            color: 'white',
            textAlign: 'left',
            width: '100%',
          }}
        >
          ĀutID is self-sovereign, unique, and portable: it lets you join new DAOs, and log in across DAO-powered Web3 DApps.
          <br />
          This is a shareable Social profile, with on-chain DAOs & contacts!
        </Typography>
      </TopWrapper>

      <FormWrapper autoComplete="off" onSubmit={handleSubmit(onSubmit)}>
        <FieldWrapper>
          <Controller
            key="username"
            name="username"
            control={control}
            render={({ field: { name, value, onChange } }) => {
              return (
                <>
                  <AutTextField
                    placeholder="Search āut"
                    focused
                    id={name}
                    name={name}
                    value={value}
                    width="100%"
                    onChange={onChange}
                    sx={{
                      mb: pxToRem(45),
                    }}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <SvgIcon
                            sx={{
                              height: pxToRem(34),
                              width: pxToRem(34),
                              mt: pxToRem(10),
                              ml: pxToRem(20),
                              cursor: 'pointer',
                              color: 'white',
                              ':hover': {
                                color: '#009ADE',
                              },
                            }}
                            key="username-icon"
                            component={SearchIcon}
                            onClick={handleSubmit(onSubmit)}
                          />
                        </InputAdornment>
                      ),
                    }}
                  />
                </>
              );
            }}
          />
        </FieldWrapper>
      </FormWrapper>

      <ResultWrapper>
        {status === ResultState.Loading ? (
          <>
            <Typography
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                color: 'white',
              }}
              variant="h3"
            >
              One second, let me look...
            </Typography>
            <Player
              loop
              autoplay
              rendererSettings={{ preserveAspectRatio: 'xMidYMid slice' }}
              src={animationData}
              style={{ height: '130px', width: '130px' }}
            />
          </>
        ) : noResults ? (
          <Typography
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              color: 'white',
            }}
            variant="h3"
          >
            No user found with that username. Try again!
          </Typography>
        ) : (
          searchResult.map((user: AutID, index) => {
            return (
              <UserRow key={`result-${index}`} onClick={() => clickRow(user?.name, user.properties?.network)}>
                <Avatar
                  sx={{
                    bgcolor: 'background.default',
                    height: pxToRem(78),
                    width: pxToRem(78),
                    borderRadius: 0,
                  }}
                  aria-label="avatar"
                  src={ipfsCIDToHttpUrl(user?.properties?.avatar as string)}
                />
                <div style={{ display: 'flex', flex: '1' }}>
                  <div style={{ width: '33%', justifyContent: 'center', alignItems: 'center', height: '100%', display: 'flex' }}>
                    <Typography
                      sx={{
                        display: 'flex',
                        alignSelf: 'center',
                        justifyContent: 'center',
                        alignItems: 'center',
                        padding: '3px',
                        height: '100%',
                        color: 'white',
                        ml: pxToRem(20),
                      }}
                      variant="h2"
                    >
                      {user?.name}
                    </Typography>
                  </div>
                  <div style={{ width: '33%', justifyContent: 'center', alignItems: 'center', height: '100%', display: 'flex' }}>
                    <Typography
                      sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        color: 'white',
                        ml: pxToRem(20),
                        padding: '5px',
                        borderRadius: '3px',
                        backgroundColor: 'rgba(67, 158, 221, 0.3)',
                      }}
                      variant="h2"
                    >
                      {user?.properties?.network}
                    </Typography>
                  </div>
                  <div style={{ width: '33%', display: 'flex', alignContent: 'center', alignSelf: 'center' }}>
                    <SvgIcon
                      sx={{
                        height: pxToRem(34),
                        width: '100%',
                        mt: pxToRem(10),
                        ml: pxToRem(20),
                        justifyContent: 'center',
                        cursor: 'pointer',
                      }}
                      key="redirect-icon"
                      component={RedirectIcon}
                    />
                  </div>
                </div>
              </UserRow>
            );
          })
        )}
      </ResultWrapper>
    </AutBox>
  );
};

export default AutSearch;