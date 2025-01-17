import React, { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
// import Grid from '@mui/material/Grid';
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import LinearProgress from "@mui/material/LinearProgress";
import Checkbox from "@mui/material/Checkbox";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import { MemberContext } from "../MemberContext";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import logo from "../passlogo.svg";
import { useTheme } from "@mui/material/styles";

export default function SignIn() {
  const { API, setCookie, setUserAccount, authDomain, userDomain } =
    useContext(MemberContext);
  const [mode, setMode] = useState("password");
  const [loginCredentials, setLoginCredentials] = useState({
    email: "",
    password: "",
  });
  const [failedLogin, setFailedLogin] = useState(false);
  const [apiRes, setApiRes] = useState({ ok: false });
  const theme = useTheme();
  let navigate = useNavigate();

  useEffect(() => {
    fetch(`${API}`).then((data) => setApiRes(data));
    // .catch(err => setApiRes(err));
  }, [API]);

  useEffect(() => {
    console.log("api res ", apiRes);
  }, [apiRes]);

  const postLogin = () => {
    // console.log('fetching login', loginCredentials);
    setFailedLogin(false);
    fetch(`${API}/login`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      redirect: "follow",
      body: JSON.stringify(loginCredentials),
    })
      .then((res) => {
        console.log(res.status);
        if (res.status === 200) {
          return res.json();
        } else {
          setFailedLogin(true);
        }
      })
      .then((data) => {
        // console.log(data);
        if (data === undefined) return;
        if (data.cookie !== undefined) {
          console.log("return data", data);
          let cookieInfo = data.cookie;
          setCookie("user", JSON.stringify(data.user), {
            domain: userDomain,
            path: "/",
            maxAge: cookieInfo[2].maxAge,
            sameSite: "None",
            secure: "true",
          });
          setCookie(cookieInfo[0], cookieInfo[1], {
            domain: authDomain,
            path: "/",
            maxAge: cookieInfo[2].maxAge,
            sameSite: "None",
            secure: "true",
          });
          setUserAccount(data.user);
          navigate("/");
        } else {
          setFailedLogin(true);
        }
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
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 3,
            //backgroundColor: '#212121',
          }}
        >
          <Box
            sx={{ backgroundColor: "#212121", borderRadius: "20px", pl: 1.5 }}
          >
            <img src={logo} alt="logo" style={{ width: "20rem" }} />
          </Box>
          {failedLogin && (
            <span>
              <Typography
                component="span"
                variant="h5"
                align="center"
                color="error"
              >
                Failed to login, Retry or Sign up
              </Typography>
            </span>
          )}
          <Box
            sx={{
              backgroundColor:
                theme.palette.mode === "light"
                  ? "#FAFAFF"
                  : theme.palette.grey[800],
              borderRadius: 3,
              px: 4,
              py: 2,
            }}
          >
            <TextField
              error={failedLogin}
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email"
              name="email"
              autoComplete="email"
              autoFocus
              onChange={(e) => {
                setLoginCredentials((prev) => {
                  return { ...prev, email: e.target.value };
                });
              }}
              sx={{
                backgroundColor:
                  theme.palette.mode === "light"
                    ? "white"
                    : theme.palette.grey[900],
              }}
            />
            <TextField
              error={failedLogin}
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type={mode}
              id="password"
              autoComplete="current-password"
              onChange={(e) => {
                setLoginCredentials((prev) => {
                  return { ...prev, password: e.target.value };
                });
              }}
              onKeyPress={(event) => {
                if (event.key === "Enter") {
                  postLogin();
                }
              }}
              sx={{
                backgroundColor:
                  theme.palette.mode === "light"
                    ? "white"
                    : theme.palette.grey[900],
              }}
            />
            <FormGroup>
              <FormControlLabel
                control={<Checkbox onClick={() => togglePassword(mode)} />}
                label="Show Password"
              />
            </FormGroup>
          </Box>

          <Button
            fullWidth
            variant="contained"
            color="secondary"
            size="medium"
            sx={{
              borderRadius: "30px",
              width: 200,
            }}
            onClick={() => postLogin()}
          >
            Login
          </Button>
          <Button
            fullWidth
            variant="contained"
            color="secondary"
            size="medium"
            sx={{
              borderRadius: "30px",
              width: 200,
              display: "flex",
              justifyContent: "center",
            }}
            onClick={() => navigate("/signup")}
          >
            Create Account
          </Button>

          <Button
            fullWidth
            variant="text"
            color="secondary"
            size="medium"
            sx={{
              borderRadius: "30px",
              width: 200,
              display: "flex",
              justifyContent: "center",
            }}
            onClick={() => navigate("/forgot")}
          >
            Forgot Password?
          </Button>
          {!apiRes.ok ? (
            <Box sx={{ m: 2, width: "100%" }}>
              <Typography variant="h5" component="h5" sx={{ color: "white" }}>
                Connecting to Database
              </Typography>
              <LinearProgress />
            </Box>
          ) : null}
        </Box>
      </Container>
    </Box>
  );
}
