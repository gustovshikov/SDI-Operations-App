import React from "react";
import {
  Button,
  TextField,
  Grid,
  Box,
  Typography,
  Container,
  Checkbox,
  FormGroup,
  FormControlLabel,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { MemberContext } from "../MemberContext";
import { useState, useContext, useEffect } from "react";
import { useParams } from "react-router";
import { useTheme } from "@mui/material/styles";

export default function ChangePass() {
  const { API, userAccount } = useContext(MemberContext);
  const [mode, setMode] = useState("password");
  let navigate = useNavigate();
  const { email } = useParams();
  const [failedReset, setFailedReset] = useState(false);
  const [passwordReset, setPasswordReset] = useState({
    email: userAccount.email,
    password: "",
  });
  const theme = useTheme();

  useEffect(() => {
    setPasswordReset((prev) => {
      return {
        ...prev,
        email: email === undefined ? userAccount.email : email,
      };
    });
  }, [email]);

  console.log("this is email ", email);
  // post pw to api
  const postPassword = () => {
    setFailedReset(false);
    fetch(`${API}/pwreset`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      redirect: "follow",
      body: JSON.stringify(passwordReset),
    })
      .then((res) => {
        // console.log(res.status);
        if (res.status === 200) {
          return res.json();
        } else {
          setFailedReset(true);
        }
      })
      .then((data) => {
        console.log(data);
        if (data === undefined) return;
        // console.log('return data', data);
        navigate("/login");
      })
      .catch((err) => {
        console.log("error: ", err);
      });
  };

  const togglePassword = (mode) => {
    if (mode === "password") {
      setMode("text");
    } else {
      setMode("password");
    }
  };

  return (
    <Box
      sx={{
        position: "absolute",
        left: 0,
        top: 0,
        width: "100vw",
        height: "100vh",
        backgroundColor: "#212121",
      }}
    >
      <Container component="main" maxWidth="xs">
        <Box
          sx={{
            mt: 10,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 3,
          }}
        >
          {/* <Box
            sx={{ backgroundColor: '#212121', borderRadius: '20px', pl: 1.5 }}
          >
            <img src={logo} alt='logo' style={{ width: '20rem' }} />
          </Box> */}

          {failedReset && (
            <>
              <Typography
                component="span"
                variant="h5"
                align="center"
                color="error"
              >
                All info required.
              </Typography>
            </>
          )}

          <Box
            sx={{
              //backgroundColor: '#FAFAFF',
              backgroundColor:
                theme.palette.mode === "light" ? "#FAFAFF" : "#212121",
              borderRadius: 3,
              px: 4,
              py: 2,
              mt: 10,
            }}
          >
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  error={failedReset}
                  required
                  fullWidth
                  id="email"
                  label="Email"
                  name="email"
                  defaultValue={email === undefined ? userAccount.email : email}
                  //   disabled={!userAccount.admin}
                  disabled={true}
                  autoComplete="email"
                  autoFocus
                  onChange={(e) => {
                    setPasswordReset((prev) => {
                      return { ...prev, email: e.target.value };
                    });
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  error={failedReset}
                  required
                  fullWidth
                  type={mode}
                  id="new Password"
                  label="New Password"
                  name="New Password"
                  autoComplete="new Password"
                  autoFocus
                  onChange={(e) => {
                    setPasswordReset((prev) => {
                      return { ...prev, password: e.target.value };
                    });
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  error={failedReset}
                  required
                  fullWidth
                  type={mode}
                  id="verify Password"
                  label="Verify Password"
                  name="Verify Password"
                  autoComplete="verify Password"
                  autoFocus
                  //   onChange={e => {
                  //     setpasswordReset(prev => {
                  //       return { ...prev, email: e.target.value };
                  //     });
                  //   }}
                />
                <FormGroup>
                  <FormControlLabel
                    control={<Checkbox onClick={() => togglePassword(mode)} />}
                    label="Show Password"
                  />
                </FormGroup>
              </Grid>
            </Grid>
          </Box>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="secondary"
            size="medium"
            sx={{
              borderRadius: "30px",
              width: 200,
            }}
            onClick={() => {
              postPassword();
              navigate("/");
            }}
          >
            Change Password
          </Button>
        </Box>
      </Container>
    </Box>
  );
}
