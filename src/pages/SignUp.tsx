import { useState } from "react";
import { Link } from "react-router-dom";
import {
  CognitoUserPool,
  CognitoUserAttribute,
} from "amazon-cognito-identity-js";

//Mui
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";

type signUpFormKeyType = "password" | "email" | "userName";

const styles = {
  item: {
    mt: 2,
  },
};

export const SignUp = ({ userPool }: { userPool: CognitoUserPool }) => {
  const [signUpForm, setSignUpForm] = useState({
    email: "",
    password: "",
    userName: "",
  });

  const [signUpRequest, setSignUpRequest] = useState({
    isLoading: false,
    isError: false,
    message: "",
    isSuccess: false,
  });

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
    setSignUpRequest({
      isLoading: true,
      isError: false,
      message: "",
      isSuccess: false,
    });
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
            isSuccess: false,
          });
        } else {
          setSignUpRequest({
            isLoading: false,
            isError: false,
            isSuccess: true,
            message: `Check ${signUpForm.email} to get your validation code.`,
          });
        }
      }
    );
  };

  return (
    <>
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
      <Link to="/validation">Validation</Link>
      <Link to="/login">Login</Link>
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
    </>
  );
};
