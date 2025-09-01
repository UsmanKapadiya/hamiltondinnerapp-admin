/* eslint-disable react/prop-types */
import { MenuItem } from "react-pro-sidebar";
import { Link, useLocation } from "react-router-dom";

const Item = ({ title, path, icon }) => {
  const location = useLocation();
  const activeRoutes = Array.isArray(path) ? path : [path];
  const isActive = activeRoutes.some(route => {
    const cleanRoute = route.endsWith('/') ? route.slice(0, -1) : route;
    return location.pathname === cleanRoute || location.pathname.startsWith(cleanRoute + '/');
  });
  return (
    <MenuItem
      component={<Link to={Array.isArray(path) ? path[0] : path} />}
      to={Array.isArray(path) ? path[0] : path}
      icon={icon}
      rootStyles={{
        color: isActive ? "#868dfb" : undefined, fontWeight: isActive ? "bold" : undefined,
      }}
    >
      {title}
    </MenuItem>
  );
};

export default Item;
