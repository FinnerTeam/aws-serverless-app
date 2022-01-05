import { useState, useEffect } from "react";
import { CognitoIdToken, CognitoAccessToken } from "amazon-cognito-identity-js";
import axios from "axios";
//mui
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";

const styles = {
  item: {
    mt: 2,
  },
};
interface item {
  age: number;
  income: number;
  height: number;
}

export const CompareYourSelf = ({
  idToken,
  accessToken,
}: {
  idToken: CognitoIdToken;
  accessToken: CognitoAccessToken;
}) => {
  const [serverData, setServerData] = useState<item[]>([]);
  const [compareData, setCompareData] = useState({
    age: 0,
    height: 0,
    income: 0,
  });

  // const sendRequest = async () => {
  //   const type = "all";
  //   const jwtToken = idToken.getJwtToken();
  //   const headers = {
  //     Authorization: jwtToken,
  //   };
  //   try {
  //     const response = await axios.get(
  //       `https://w2oz7np800.execute-api.us-east-2.amazonaws.com/dev/compare-yourself/?type=${type}&accessToken=${accessToken}`,
  //       { headers }
  //     );
  //     const array: any = response.data;

  //     // if (Array.isArray(array)) {
  //     setServerData(array);
  //     // }
  //   } catch (err: any) {
  //     console.log(err);
  //   }
  // };
  // sendRequest();
  const compareYourselfHandler = async () => {
    const jwtToken = idToken.getJwtToken();
    const headers = {
      Authorization: jwtToken,
    };
    try {
      const { data } = await axios.post(
        "https://w2oz7np800.execute-api.us-east-2.amazonaws.com/dev/compare-yourself",
        compareData,
        { headers }
      );
      console.log(data);
    } catch (err: any) {
      console.log(err.response.data);
    }
  };

  return (
    <>
      <h1>Compare Your Self</h1>
      <TextField
        label="Age"
        variant="outlined"
        sx={styles.item}
        type="number"
        onChange={(e) =>
          setCompareData((prevState) => ({
            ...prevState,
            age: parseInt(e.target.value),
          }))
        }
      />
      <TextField
        label="Height"
        variant="outlined"
        sx={styles.item}
        type="number"
        onChange={(e) =>
          setCompareData((prevState) => ({
            ...prevState,
            height: parseInt(e.target.value),
          }))
        }
      />
      <TextField
        label="Income"
        variant="outlined"
        type="number"
        sx={styles.item}
        onChange={(e) =>
          setCompareData((prevState) => ({
            ...prevState,
            income: parseInt(e.target.value),
          }))
        }
      />
      <Button
        variant="contained"
        sx={styles.item}
        onClick={compareYourselfHandler}
        disabled={
          compareData.age === 0 ||
          compareData.income === 0 ||
          compareData.height === 0
        }
      >
        compare{" "}
      </Button>
      {Array.isArray(serverData) &&
        serverData.length > 0 &&
        serverData.map((item: any) => (
          <Grid container gap={3}>
            <Grid item>{item?.age}</Grid>
            <Grid item>{item?.height}</Grid>
            <Grid item>{item?.income}</Grid>
          </Grid>
        ))}
    </>
  );
};
