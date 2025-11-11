/* eslint-disable react/prop-types */
import { Avatar, Box, IconButton, Typography, useTheme, Collapse, List, ListItemButton, ListItemText, ListItemIcon } from "@mui/material";
import { useContext, useState, useEffect } from "react";
import { tokens } from "../../../theme";
import { Menu, MenuItem, Sidebar } from "react-pro-sidebar";
import {
  AssessmentOutlined,
  BarChartOutlined,
  CalendarTodayOutlined,
  ContactsOutlined,
  CreateOutlined,
  DashboardOutlined,
  DonutLargeOutlined,
  DvrOutlined,
  DynamicFormOutlined,
  ExpandLessOutlined,
  ExpandMoreOutlined,
  HelpOutlineOutlined,
  Home,
  HomeMaxOutlined,
  LocalPizzaOutlined,
  LockOutlined,
  MapOutlined,
  MenuOutlined,
  PeopleAltOutlined,
  PersonOutlined,
  PlaylistAddOutlined,
  ReceiptOutlined,
  SettingsOutlined,
  TimelineOutlined,
  TonalityOutlined,
  WavesOutlined,

} from "@mui/icons-material";
// import avatar from "../../../assets/images/avatar.png";
// import logo from "../../../assets/images/logo.png";
import logos from "../../../assets/images/hamilton-logo.png";
import Item from "./Item";
import { ToggledContext } from "../../../App";

const defaultAvtar = "http://hamiltondinnerapp.staging.intelligrp.com/images/user.webp"

const SideBar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const { toggled, setToggled } = useContext(ToggledContext);
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [reportsDropdownOpen, setReportsDropdownOpen] = useState(false);
  const userData = JSON.parse(localStorage.getItem('userData'));
  const [avatarSrc, setAvatarSrc] = useState(userData?.avatar && userData?.avatar !== "" ? userData.avatar : defaultAvtar);

  useEffect(() => {
    setAvatarSrc(userData?.avatar && userData?.avatar !== "" ? userData.avatar : defaultAvtar);
  }, [userData?.avatar]);

  const handleDropdownToggle = () => {
    setDropdownOpen(!dropdownOpen);
  };
  const handleReportsDropdownToggle = () => {
    setReportsDropdownOpen(!reportsDropdownOpen);
  };
  return (
    <Sidebar
      backgroundColor={colors.primary[400]}
      rootStyles={{
        border: 0,
        height: "100%",
      }}
      collapsed={collapsed}
      onBackdropClick={() => setToggled(false)}
      toggled={toggled}
      breakPoint="md"
    >
      <Menu
        menuItemStyles={{
          button: { ":hover": { background: "transparent" } },
        }}
      >
        <MenuItem
          rootStyles={{
            margin: "10px 0 20px 0",
            color: colors.gray[100],
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            {!collapsed && (
              <Box
                display="flex"
                alignItems="center"
                gap="12px"
                sx={{ transition: ".3s ease" }}
              >
                <img
                  style={{ width: "30px", height: "30px", borderRadius: "8px" }}
                  src={logos}
                  alt="Argon"
                />
                <Typography
                  variant="h4"
                  fontWeight="bold"
                  textTransform="capitalize"
                  color={colors.greenAccent[500]}
                >
                  Dinning App
                </Typography>
              </Box>
            )}
            <IconButton onClick={() => setCollapsed(!collapsed)}>
              <MenuOutlined />
            </IconButton>
          </Box>
        </MenuItem>
      </Menu>
      {!collapsed && (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "10px",
            mb: "25px",
          }}
        >
          <Avatar
            alt="avatar"
            src={avatarSrc}
            sx={{ width: "100px", height: "100px" }}
            onError={e => {
              if (avatarSrc !== defaultAvtar) {
                setAvatarSrc(defaultAvtar);
              }
            }}
          />
          <Box sx={{ textAlign: "center" }}>
            <Typography variant="h3" fontWeight="bold" color={colors.gray[100]}>
              {userData?.name}
            </Typography>
            {/* <Typography
              variant="h6"
              fontWeight="500"
              color={colors.greenAccent[500]}
            >
              VP Fancy Admin
            </Typography> */}
          </Box>
        </Box>
      )}

      <Box mb={5} pl={collapsed ? undefined : "5%"}>
        <Menu
          menuItemStyles={{
            button: {
              ":hover": {
                color: "#868dfb",
                background: "transparent",
                transition: ".4s ease",
              },
            },
          }}
        >
          <Item
            title="Dashboard"
            path="/"
            colors={colors}
            icon={<DashboardOutlined />}
          />
        </Menu>
        {/* <Typography
          variant="h6"
          color={colors.gray[300]}
          sx={{ m: "15px 0 5px 20px" }}
        >
          {!collapsed ? "Data" : " "}
        </Typography>{" "} */}
        <Menu
          menuItemStyles={{
            button: {
              ":hover": {
                color: "#868dfb",
                background: "transparent",
                transition: ".4s ease",
              },
            },
          }}
        >
          <Item
            title="Menu Details"
            path="/menu-details"
            colors={colors}
            icon={<CreateOutlined />}
          />
          <List>
            <ListItemButton onClick={handleDropdownToggle}>
              <ListItemIcon style={{ paddingLeft: 10 }}>
                <TonalityOutlined style={{ color: colors.gray[100], }} />
              </ListItemIcon>
              <ListItemText
                primary="Manage Menu Items"
                primaryTypographyProps={{
                  color: colors.gray[100],
                  fontWeight: "bold",
                }}
              />
              {dropdownOpen ? <ExpandLessOutlined /> : <ExpandMoreOutlined />}
            </ListItemButton>
            <Collapse in={dropdownOpen} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                <Item
                  title="Menu Item Details"
                  path="/menu-item-details"
                  colors={colors}
                  icon={<PlaylistAddOutlined />}
                />
                <Item
                  title="Menu Item Options"
                  path="/menu-item-options"
                  colors={colors}
                  icon={<ContactsOutlined />}
                />
                <Item
                  title="Menu Item Preferences"
                  path="/menu-item-preferences"
                  colors={colors}
                  icon={<ReceiptOutlined />}
                />
              </List>
            </Collapse>
          </List>
          <Item
            title="Course Details"
            path="/category-details"
            colors={colors}
            icon={<DvrOutlined />}
          />
          <Item
            title="Resident Details"
            path="/resident-details"
            colors={colors}
            icon={<Home />}
          />
          <Item
            title="Order Details"
            path="/order-details"
            colors={colors}
            icon={<LocalPizzaOutlined />}
          />
          <Item
            title="Charges Reports"
            path="/charges-reports"
            colors={colors}
            icon={<AssessmentOutlined />}
          />
          <Item
            title="Users"
            path="/users-details"
            colors={colors}
            icon={<PersonOutlined />}
          />
          <Item
            title="Roles"
            path="/roles-details"
            colors={colors}
            icon={<LockOutlined />}
          />
          {/* Temperorry Commented */}
          {/* <Item
            title="Form Types"
            path="/forms"
            colors={colors}
            icon={<DynamicFormOutlined />}
          /> */}
          <Item
            title="Settings"
            path="/settings"
            colors={colors}
            icon={<SettingsOutlined />}
          />
        </Menu>
      </Box>
    </Sidebar>
  );
};

export default SideBar;
