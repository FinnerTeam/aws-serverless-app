import { useEffect, useState } from "react";
import "cross-fetch/polyfill";
import {
  CognitoUserPool,
  CognitoUserSession,
  CognitoIdToken,
} from "amazon-cognito-identity-js";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";

//Comps
import { SignUp } from "./pages/SignUp";
import { Login } from "./pages/Login";
import { Validation } from "./pages/Validation";
import { CompareYourSelf } from "./pages/CompareYourSelf";

//Mui
import Grid from "@mui/material/Grid";

const App = () => {
  const navigate = useNavigate();

  const [userPool, setUserPool] = useState<CognitoUserPool>();
  const [idToken, setIdToken] = useState<CognitoIdToken>();
  const [accessToken, setAccessToken] = useState<CognitoIdToken>();
  useEffect(() => {
    const POOL_DATA = {
      UserPoolId: "us-east-2_rwnGVVDP3",
      ClientId: "47d5umjvcqjg9i6o1qd0djp6ka",
    };

    const userPool = new CognitoUserPool(POOL_DATA);
    setUserPool(userPool);
    const user = userPool.getCurrentUser();
    if (user) {
      user.getSession((err: Error, session: CognitoUserSession | null) => {
        if (err) {
          return;
        } else if (session && session.isValid()) {
          setIdToken(session.getIdToken());
          setAccessToken(session.getAccessToken());
          navigate("/compare-your-self");
        }
      });
    }
  }, [navigate]);

  return (
    <Grid container direction="column" alignItems="center">
      <Routes>
        {userPool && (
          <>
            <Route path="/sign-up" element={<SignUp userPool={userPool} />} />
            {idToken && accessToken && (
              <Route
                path="/compare-your-self"
                element={
                  <CompareYourSelf
                    idToken={idToken}
                    accessToken={accessToken}
                  />
                }
              />
            )}

            <Route
              path="/validation"
              element={<Validation userPool={userPool} />}
            />
            <Route path="login" element={<Login userPool={userPool} />} />
            <Route path="*" element={<Navigate replace to="/sign-up" />} />
          </>
        )}
      </Routes>
    </Grid>
  );
};

export default App;
