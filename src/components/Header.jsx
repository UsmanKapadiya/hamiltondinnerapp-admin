/* eslint-disable react/prop-types */
import { Box, Typography, useTheme, Button, useMediaQuery } from "@mui/material";
import { tokens } from "../theme";
import { Icon } from "@mui/material";
import {
  AddOutlined,
  DeleteOutline,
  MenuOutlined,
  VisibilityOffOutlined,
  VisibilityOutlined,
} from "@mui/icons-material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";



const Header = ({ title, icon, Buttons }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const isMdDevices = useMediaQuery("(min-width: 724px)");
  const [showDeleted, setShowDeleted] = useState(false);
  const navigate = useNavigate(); // Initialize useNavigate


  const handleToggle = () => {
    setShowDeleted((prev) => !prev);
  };
  const handleAddNewClick = () => {
    navigate("/room-details/create");
  };
  const handleOrderClick = () => {
    navigate("/room-details/order");
  };
  return (
    <Box mb="30px">
      <Box display="flex" alignItems="center" justifyContent="flex-start">
        <Box display="flex" alignItems="center">
          {icon && (
            <Icon
              sx={{
                color: colors.gray[100],
                fontSize: "32px",
                marginRight: "10px",
                display: "flex",
                alignItems: "center",
              }}
            >
              {icon}
            </Icon>
          )}
          <Typography
            variant="h2"
            fontWeight="bold"
            color={colors.gray[100]}
            sx={{
              display: "flex",
              alignItems: "center",
            }}
          >
            {title}
          </Typography>
        </Box>
        {Buttons && (
        <Box display="flex" gap="8px" ml="30px">
          {[
            {
              label: "Add New",
              color: colors.greenAccent[700],
              hoverColor: colors.greenAccent[800],
              icon: <AddOutlined />,
              onClick: handleAddNewClick,
            },
            {
              label: "Bulk Delete",
              color: colors.redAccent[700],
              hoverColor: colors.redAccent[800],
              icon: <DeleteOutline />,
            },
            {
              label: "Order",
              color: colors.blueAccent[700],
              hoverColor: colors.blueAccent[800],
              icon: <MenuOutlined />,
              onClick: handleOrderClick,
            },
            {
              label: showDeleted ? "Hide Deleted" : "Show Deleted",
              color: showDeleted ? colors.skyBlueAccent[700] : colors.gray[700],
              hoverColor: showDeleted ? colors.skyBlueAccent[800] : colors.gray[800],
              icon: showDeleted ? <VisibilityOffOutlined /> : <VisibilityOutlined />,
              onClick: handleToggle,
            },
          ].map((button, index) => (
            <Button
              key={index}
              variant="contained"
              onClick={button.onClick || (() => { })}
              sx={{
                bgcolor: button.color,
                color: "#fcfcfc",
                fontSize: isMdDevices ? "12px" : "10px",
                fontWeight: "bold",
                p: "6px 12px",
                transition: ".3s ease",
                ":hover": {
                  bgcolor: button.hoverColor,
                },
              }}
              startIcon={button.icon}
            >
              {button.label}
            </Button>
          ))}
        </Box>
        )}
      </Box>
    </Box>
  );
};

export default Header;
