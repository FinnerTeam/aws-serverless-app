import { useEffect, useState } from "react";
import "cross-fetch/polyfill";
import {
  CognitoUserPool,
  CognitoUserAttribute,
} from "amazon-cognito-identity-js";

//Mui
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

const styles = {
  item: {
    mt: 2,
  },
};

type signUpFormKeyType = "password" | "email" | "userName";

const App = () => {
  const [signUpForm, setSignUpForm] = useState({
    email: "",
    password: "",
    userName: "",
  });

  const [signUpRequest, setSignUpRequest] = useState({
    isLoading: false,
    isError: false,
    message: "",
  });

  const [userPool, setUserPool] = useState<CognitoUserPool>();

  const signUpFormHandler = ({
    key,
    value,
  }: {
    key: signUpFormKeyType;
    value: string;
  }) => {
    setSignUpForm((prevState) => ({ ...prevState, [key]: value }));
  };

  const signUpWithCognito = () => {
    setSignUpRequest({ isLoading: true, isError: false, message: "" });
    const newUserData = {
      Name: "email",
      Value: signUpForm.email,
    };
    const attrList: CognitoUserAttribute[] = [];

    attrList.push(new CognitoUserAttribute(newUserData));

    userPool?.signUp(
      signUpForm.userName,
      signUpForm.password,
      attrList,
      [],
      (err, result) => {
        if (err) {
          setSignUpRequest({
            isLoading: false,
            isError: true,
            message: err.message,
          });
        } else {
          setSignUpRequest({
            isLoading: false,
            isError: false,
            message: `${signUpForm.userName} has been created successfully.`,
          });
        }
      }
    );
  };

  useEffect(() => {
    const POOL_DATA = {
      UserPoolId: "us-east-2_rwnGVVDP3",
      ClientId: "47d5umjvcqjg9i6o1qd0djp6ka",
    };

    const userPool = new CognitoUserPool(POOL_DATA);
    setUserPool(userPool);
  }, []);

  return (
    <Grid container direction="column" alignItems="center">
      <h1>Sign Up</h1>
      <TextField
        label="User name"
        variant="outlined"
        sx={styles.item}
        onChange={(e) =>
          signUpFormHandler({ key: "userName", value: e?.target?.value })
        }
      />
      <TextField
        label="Email"
        variant="outlined"
        sx={styles.item}
        onChange={(e) =>
          signUpFormHandler({ key: "email", value: e?.target?.value })
        }
      />
      <TextField
        label="Password"
        type="password"
        variant="outlined"
        sx={styles.item}
        onChange={(e) =>
          signUpFormHandler({ key: "password", value: e?.target?.value })
        }
      />
      <Button
        variant="contained"
        sx={styles.item}
        onClick={signUpWithCognito}
        disabled={
          signUpForm.userName.length === 0 ||
          signUpForm.email.length === 0 ||
          signUpForm.password.length === 0
        }
      >
        {signUpRequest.isLoading ? "Loading" : "Sign Up"}
      </Button>
      {signUpRequest.isError && signUpRequest.message.length > 0 && (
        <Typography sx={{ ...styles.item, color: "error.main" }}>
          {signUpRequest.message}
        </Typography>
      )}
      {!signUpRequest.isError && signUpRequest.message.length > 0 && (
        <Typography sx={{ ...styles.item, color: "success.main" }}>
          {signUpRequest.message}
        </Typography>
      )}
    </Grid>
  );
};

export default App;
