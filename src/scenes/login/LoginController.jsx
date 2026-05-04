import React from "react";
import { Box, TextField, Button, Typography, useTheme, useMediaQuery, FormControlLabel, Checkbox } from "@mui/material";
import shipImage from "../../assets/images/ship.jpg";
import { LoginOutlined } from "@mui/icons-material";
import { tokens } from "../../theme";
import useLogin from "./useLogin";
import { ToastContainer } from "react-toastify";

const LoginController = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const isMdDevices = useMediaQuery("(min-width: 724px)");
  const { formData, errors, loading, handleChange, handleSubmit } = useLogin();

  return (
    <Box
      display="flex"
      height="100vh"
      width="100vw"
      sx={{
        overflow: "hidden",
      }}
    >
      {/* Left Section: Background Image */}
      <ToastContainer />
       <Box
        flex={8}
        sx={{
          backgroundImage: `url(${shipImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          height: "100vh",
          width: "100%",
        }}
      />

      {/* Right Section: Login Form */}
       <Box
        flex={4}
        display="flex"
        alignItems="center"
        justifyContent="center"
        sx={{
          backgroundColor: "white",
          height: "100vh", // Ensure it fills the viewport height
          width: "100%", // Ensure it fills the width
        }}
      >
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "flex-start",
            width: "100%",
            maxWidth: "400px",
            padding: "20px",
          }}
        >
          <Typography
            variant="h6"
            gutterBottom
            sx={{
              textAlign: "left",
              textTransform: "uppercase",
            }}
          >
            Sign In Below:
          </Typography>
          <TextField
            label="Email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            error={!!errors.email}
            helperText={errors.email}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            error={!!errors.password}
            helperText={errors.password}
            fullWidth
            margin="normal"
          />
          <FormControlLabel
            control={<Checkbox name="rememberMe" />}
            label="Remember Me"
            sx={{
              marginTop: "10px",
              color: colors.gray[700],
            }}
          />
          <Box>
            <Button
              type="submit"
              disabled={loading}
              variant="contained"
              sx={{
                width: "100%",
                bgcolor: colors.blueAccent[700],
                color: "#fcfcfc",
                fontSize: isMdDevices ? "14px" : "10px",
                fontWeight: "bold",
                p: "10px 20px",
                mt: "18px",
                transition: ".3s ease",
                ":hover": {
                  bgcolor: colors.blueAccent[800],
                },
              }}
              startIcon={<LoginOutlined />}
            >
              {loading ? "Loading..." : "Login"}
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default LoginController;
