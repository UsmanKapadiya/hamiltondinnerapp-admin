import React, { useState } from "react";
import {
  Box,
  IconButton,
  InputBase,
  useMediaQuery,
  useTheme,
  Menu,
  MenuItem,
} from "@mui/material";
import { tokens, ColorModeContext } from "../../../theme";
import { useContext } from "react";
import {
  DarkModeOutlined,
  ExitToAppOutlined,
  LightModeOutlined,
  MenuOutlined,
  NotificationsOutlined,
  PersonOutlined,
  SearchOutlined,
  SettingsOutlined,
} from "@mui/icons-material";
import { ToggledContext } from "../../../App";
import AuthServices from "../../../services/authServices";
import { toast } from "react-toastify";
import CustomLoadingOverlay from "../../../components/CustomLoadingOverlay";

const Navbar = () => {
  const theme = useTheme();
  const colorMode = useContext(ColorModeContext);
  const { toggled, setToggled } = useContext(ToggledContext);
  const isMdDevices = useMediaQuery("(max-width:768px)");
  const isXsDevices = useMediaQuery("(max-width:466px)");
  const colors = tokens(theme.palette.mode);
  const [loading, setLoading] = useState(false);

  // State for dropdown menu
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    try {
      setLoading(true);
      let response = await AuthServices.logout();
      const { message } = response;
      toast.success(`${message}`);
      setTimeout(() => {
        localStorage.removeItem("authToken");
        localStorage.removeItem("userData");
        window.location.href = "/login";
      }, 2000);
    } catch (error) {
      console.error("Error processing menu:", error);
      toast.error("Failed to process menu. Please try again."); // Error toast
    } finally {
      setLoading(false);
    }
  };
  function DotWaveLoader() {
    return (
      <span style={{ display: 'inline-block', height: 16 }}>
        <span className="dot-wave-loader">
          <span className="dot" style={{ animationDelay: '0s' }}>.</span>
          <span className="dot" style={{ animationDelay: '0.2s' }}>.</span>
          <span className="dot" style={{ animationDelay: '0.4s' }}>.</span>
        </span>
        <style>{`
        .dot-wave-loader {
          display: inline-flex;
          align-items: flex-end;
          height: 16px;
        }
        .dot {
          font-size: 22px;
          line-height: 1;
          margin: 0 1px;
          color: #FFF;
          animation: dotWave 1s infinite ease-in-out;
          position: relative;
        }
        @keyframes dotWave {
          0%, 60%, 100% { transform: translateY(0); }
          30% { transform: translateY(-8px); }
        }
      `}</style>
      </span>
    );
  }


  return (
    <Box display="flex" alignItems="center" justifyContent="space-between" p={2}>
      <Box display="flex" alignItems="center" gap={2}>
        <IconButton
          sx={{ display: `${isMdDevices ? "flex" : "none"}` }}
          onClick={() => setToggled(!toggled)}
        >
          <MenuOutlined />
        </IconButton>
        {/* <Box
          display="flex"
          alignItems="center"
          bgcolor={colors.primary[400]}
          borderRadius="3px"
          sx={{ display: `${isXsDevices ? "none" : "flex"}` }}
        >
          <InputBase placeholder="Search" sx={{ ml: 2, flex: 1 }} />
          <IconButton type="button" sx={{ p: 1 }}>
            <SearchOutlined />
          </IconButton>
        </Box> */}
      </Box>

      <Box>
        <IconButton onClick={colorMode.toggleColorMode}>
          {theme.palette.mode === "dark" ? (
            <LightModeOutlined />
          ) : (
            <DarkModeOutlined />
          )}
        </IconButton>
        {/* <IconButton>
          <NotificationsOutlined />
        </IconButton>
        <IconButton>
          <SettingsOutlined />
        </IconButton> */}
        <IconButton onClick={handleLogout}>
          <ExitToAppOutlined />
        </IconButton> 
        {/* Dropdown Menu Trigger */}
        {/* <IconButton onClick={handleMenuOpen}>
          <PersonOutlined />
        </IconButton>
        <Menu
          anchorEl={anchorEl}
          open={open}
          onClose={handleMenuClose}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "right",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
        >
          <MenuItem onClick={handleMenuClose}>User Settings</MenuItem>
          {loading ? (
            <MenuItem sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '100%',
                  height: 24,
                }}
              >
                <span style={{ marginLeft: 8 }}>Logging out</span>
                {DotWaveLoader()}
              </Box>
            </MenuItem>
          ) : (
            <MenuItem onClick={handleLogout}>Logout</MenuItem>
          )}
        </Menu> */}
      </Box>
    </Box>
  );
};

export default Navbar;