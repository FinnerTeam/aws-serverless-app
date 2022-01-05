import { useState } from "react";

import { CognitoUser, CognitoUserPool } from "amazon-cognito-identity-js";

import { Link } from "react-router-dom";

//Mui
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";

const styles = {
  item: {
    mt: 2,
  },
};

interface props {
  userPool: CognitoUserPool;
}

export const Validation = ({ userPool }: props) => {
  const [confirmUserForm, setConfirmUserForm] = useState({
    userName: "",
    validationCode: "",
  });

  const [confirmUser, setConfirmUser] = useState({
    isLoading: false,
    isError: false,
    isSuccess: false,
    message: "",
  });

  const confirmUserWithCognito = () => {
    setConfirmUser({
      isLoading: true,
      isError: false,
      message: "",
      isSuccess: false,
    });
    const newUserData = {
      Username: confirmUserForm.userName,
      Pool: userPool,
    };
    const cognitoUser = new CognitoUser(newUserData);
    cognitoUser.confirmRegistration(
      confirmUserForm.validationCode || "",
      true,
      (err, result) => {
        if (err) {
          setConfirmUser({
            isLoading: false,
            isError: true,
            message: err.message,
            isSuccess: false,
          });
          console.log(err);
        } else {
          console.log(result);
          setConfirmUser({
            isLoading: false,
            isError: false,
            message: `${confirmUserForm.userName} has been confirmed successfully.`,
            isSuccess: true,
          });
        }
      }
    );
  };

  const setValidationCode = (e: React.ChangeEvent<HTMLInputElement>) =>
    setConfirmUserForm((prevState) => ({
      ...prevState,
      validationCode: e?.target?.value,
    }));
  const setUserName = (e: React.ChangeEvent<HTMLInputElement>) =>
    setConfirmUserForm((prevState) => ({
      ...prevState,
      userName: e.target?.value,
    }));

  return (
    <>
      <h1>Validation</h1>
      <TextField
        label="User Name"
        type="text"
        variant="outlined"
        sx={styles.item}
        onChange={setUserName}
      />
      <TextField
        label="Validation Code"
        type="text"
        variant="outlined"
        sx={styles.item}
        onChange={setValidationCode}
      />
      <Button
        variant="contained"
        sx={styles.item}
        onClick={confirmUserWithCognito}
        disabled={!(confirmUserForm.userName && confirmUserForm.validationCode)}
      >
        {confirmUser.isLoading ? "Loading" : "Confirm User"}
      </Button>
      <Link to="/sign-up">
        <Typography sx={styles.item}> Sign Up</Typography>
      </Link>
      {confirmUser.isError && confirmUser.message.length > 0 && (
        <Typography sx={{ ...styles.item, color: "error.main" }}>
          {confirmUser.message}
        </Typography>
      )}
    </>
  );
};
