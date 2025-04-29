import React from "react";
import { Box, TextField, Button, Typography, Link } from "@mui/material";
import shipImage from "../../assets/images/ship.jpg";
import "bootstrap/dist/css/bootstrap.min.css";

const Login = () => {
  const handleSubmit = (event) => {
    event.preventDefault();
    // Add form submission logic here
    console.log("Form submitted");
  };

  const handleBlur = () => {
    // Add blur handling logic here
  };

  const handleChange = () => {
    // Add change handling logic here
  };

  const values = { email: "", Password: "" }; // Replace with state management logic
  const touched = { email: false, Password: false }; // Replace with validation logic
  const errors = { email: "", Password: "" }; // Replace with validation logic

  return (
    <div className="container-fluid vh-100">
      <div className="row h-100">
        {/* Left side (8 columns) */}
        <div
          className="col-8 p-0 position-relative"
          style={{
            backgroundImage: `url(${shipImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="position-absolute bottom-0 start-0 text-white p-4">
            <h2>🍽 DINNING APP</h2>
            <p className="mb-0">
              Welcome to Voyager. The Missing Admin for Laravel
            </p>
          </div>
        </div>

        {/* Right side (4 columns) */}
        <div className="col-4 d-flex align-items-center justify-content-center bg-white">
          <div className="w-75">
            <Typography variant="h4" className="mb-4 text-dark" gutterBottom>
              SIGN IN BELOW:
            </Typography>
            <form onSubmit={handleSubmit}>
              <Box
                display="grid"
                gap="20px"
                gridTemplateColumns="repeat(4, minmax(0, 1fr))"
                sx={{
                  "& > div": {
                    gridColumn: "span 4",
                  },
                }}
              >
                <TextField
                  fullWidth
                  variant="filled"
                  type="email"
                  label="Email"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.email}
                  name="email"
                  error={touched.email && Boolean(errors.email)}
                  helperText={touched.email && errors.email}
                />

                <TextField
                  fullWidth
                  variant="filled"
                  type="password"
                  label="Password"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.Password}
                  name="Password"
                  error={touched.Password && Boolean(errors.Password)}
                  helperText={touched.Password && errors.Password}
                />
              </Box>
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                mt="20px"
              >
                <Link href="/forgot-password" variant="body2" color="secondary">
                  Forgot Password?
                </Link>
              </Box>
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                mt="20px"
              >
                <Button type="submit" color="secondary" variant="contained">
                  Login
                </Button>
              </Box>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
