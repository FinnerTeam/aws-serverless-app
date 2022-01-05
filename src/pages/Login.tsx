import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
  CognitoUserPool,
  CognitoUser,
  AuthenticationDetails,
  CognitoUserSession,
} from "amazon-cognito-identity-js";

//Mui
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";

type loginFormKeyType = "password" | "userName";

const styles = {
  item: {
    mt: 2,
  },
};

export const Login = ({ userPool }: { userPool: CognitoUserPool }) => {
  const navigate = useNavigate();
  const [loginForm, setLoginForm] = useState({
    userName: "",
    password: "",
  });

  const [loginRequest, setLoginRequest] = useState({
    isLoading: false,
    isError: false,
    message: "",
  });

  const loginFormHandler = ({
    key,
    value,
  }: {
    key: loginFormKeyType;
    value: string;
  }) => {
    setLoginForm((prevState) => ({ ...prevState, [key]: value }));
  };

  const LoginWithCognito = () => {
    setLoginRequest({ isLoading: true, isError: false, message: "" });
    const authData = {
      Username: loginForm.userName,
      Password: loginForm.password,
    };
    const authDetails = new AuthenticationDetails(authData);

    const authPoolData = {
      Username: loginForm.userName,
      Pool: userPool,
    };
    const cognitoUser = new CognitoUser(authPoolData);

    cognitoUser.authenticateUser(authDetails, {
      onSuccess(result: CognitoUserSession) {
        setLoginRequest({
          isLoading: false,
          isError: false,
          message: "Login Successfully",
        });
        navigate("/compare-your-self");
      },
      onFailure(err) {
        console.log(err);
        setLoginRequest({
          isLoading: false,
          isError: true,
          message: `Login failed, ${err}`,
        });
      },
    });
  };

  return (
    <>
      <h1>Login</h1>
      <TextField
        label="User name"
        variant="outlined"
        sx={styles.item}
        onChange={(e) =>
          loginFormHandler({ key: "userName", value: e?.target?.value })
        }
      />
      <TextField
        label="Password"
        type="password"
        variant="outlined"
        sx={styles.item}
        onChange={(e) =>
          loginFormHandler({ key: "password", value: e?.target?.value })
        }
      />
      <Button
        variant="contained"
        sx={styles.item}
        onClick={LoginWithCognito}
        disabled={
          loginForm.userName.length === 0 || loginForm.password.length === 0
        }
      >
        {loginRequest.isLoading ? "Loading" : "Login"}
      </Button>
      <Link to="/sign-up">Sign Up</Link>

      {loginRequest.isError && loginRequest.message.length > 0 && (
        <Typography sx={{ ...styles.item, color: "error.main" }}>
          {loginRequest.message}
        </Typography>
      )}
      {!loginRequest.isError && loginRequest.message.length > 0 && (
        <Typography sx={{ ...styles.item, color: "success.main" }}>
          {loginRequest.message}
        </Typography>
      )}
    </>
  );
};
