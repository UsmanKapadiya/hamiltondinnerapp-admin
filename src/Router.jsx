import React from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import App from "./App";
import {
  Dashboard,
  FAQ
} from "./scenes";
import Room from "./scenes/room";
import RoomDetailsForm from "./scenes/room/roomDetails-form";
import RoomDetailsOrder from "./scenes/room/roomDetailsOrder";
import RoomDetailsView from "./scenes/room/roomDetails-view";
import Category from "./scenes/category";
import CategoryDetailsView from "./scenes/category/categoryDetails-view";
import CategoryDetailsForm from "./scenes/category/categoryDetails-form";
import CategoryDetailsOrder from "./scenes/category/categoryDetailsOrder";
import Item from "./scenes/item";
import ItemDetailsView from "./scenes/item/itemDetails-view";
import ItemDetailsForm from "./scenes/item/itemDetails-form";
import ItemDetailsOrder from "./scenes/item/itemDetailsOrder";
import Login from "./scenes/login";
import ItemOptions from "./scenes/options";
import ItemoptionsForm from "./scenes/options/itemOptions-form";
import ItemOptionsView from "./scenes/options/itemOptions-view";
import ItemPreferences from "./scenes/preferences";
import ItemPreferencesView from "./scenes/preferences/itemPreferences-view";
import ItemPreferencesForm from "./scenes/preferences/itemPreferences-form";
import MenuDetails from "./scenes/menuDetails";
import MenuDetailsForm from "./scenes/menuDetails/menuDetails-form";
import MenuDetailsView from "./scenes/menuDetails/menuDetails-view";
import OrderDetails from "./scenes/orderDetails";
import Setting from "./scenes/settings";
import Roles from "./scenes/Roles";
import RolesDetailsView from "./scenes/Roles/rolesDetails-view";
import RoleDetailsForm from "./scenes/Roles/rolesDetails-form";
import User from "./scenes/user";
import UserDetailsView from "./scenes/user/userDetails-view";
import UserDetailsForm from "./scenes/user/userDetails-form";
import NotFound from "./scenes/pageNotFounf/NotFound";


const ProtectedRoute = ({ children }) => {
  const isAuthenticated = !!localStorage.getItem("authToken");
  return isAuthenticated ? children : <Navigate to="/login" />;
};
const AppRouter = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <App />
            </ProtectedRoute>
          }
        >
          <Route path="/" element={<Dashboard />} />
          {/*Room  */}
          <Route path="/room-details" element={<Room />} />
          <Route path="/room-details/create" element={<RoomDetailsForm />} />
          <Route path="/room-details/:id/edit" element={<RoomDetailsForm />} />
          <Route path="/room-details/:id" element={<RoomDetailsView />} />
          <Route path="/room-details/order" element={<RoomDetailsOrder />} />
          {/*Category  */}
          <Route path="/category-details" element={<Category />} />
          <Route path="/category-details/create" element={<CategoryDetailsForm />} />
          <Route path="/category-details/:id/edit" element={<CategoryDetailsForm />} />
          <Route path="/category-details/:id" element={<CategoryDetailsView />} />
          <Route path="/category-details/order" element={<CategoryDetailsOrder />} />
          {/*Item  */}
          <Route path="/item-details" element={<Item />} />
          <Route path="/item-details/:id" element={<ItemDetailsView />} />
          <Route path="/item-details/:id/edit" element={<ItemDetailsForm />} />
          <Route path="/item-details/create" element={<ItemDetailsForm />} />
          <Route path="/item-details/order" element={<ItemDetailsOrder />} />
          {/*Item Options */}
          <Route path="/item-options" element={<ItemOptions />} />
          <Route path="/item-options/create" element={<ItemoptionsForm />} />
          <Route path="/item-options/:id/edit" element={<ItemoptionsForm />} />
          <Route path="/item-options/:id" element={<ItemOptionsView />} />
          {/*Item Preferences */}
          <Route path="/item-preferences" element={<ItemPreferences />} />
          <Route path="/item-preferences/create" element={<ItemPreferencesForm />} />
          <Route path="/item-preferences/:id/edit" element={<ItemPreferencesForm />} />
          <Route path="/item-preferences/:id" element={<ItemPreferencesView />} />
          {/*Menu Details */}
          <Route path="/menu-details" element={<MenuDetails />} />
          <Route path="/menu-details/create" element={<MenuDetailsForm />} />
          <Route path="/menu-details/:id/edit" element={<MenuDetailsForm />} />
          <Route path="/menu-details/:id" element={<MenuDetailsView />} />
          {/*Order Details */}
          <Route path="/order-details" element={<OrderDetails />} />

          {/*Menu Details */}
          <Route path="/settings" element={<Setting />} />

          <Route path="/roles" element={<Roles />} />
          <Route path="/roles-details/:id" element={<RolesDetailsView />} />
          <Route path="/roles-details/create" element={<RoleDetailsForm />} />
          <Route path="/roles-details/:id/edit" element={<RoleDetailsForm />} />
          {/* User */}
          <Route path="/users" element={<User />} />
          <Route path="/users-details/:id" element={<UserDetailsView />} />
          <Route path="/users-details/create" element={<UserDetailsForm />} />
          <Route path="/users-details/:id/edit" element={<UserDetailsForm />} />

          <Route path="/faq" element={<FAQ />} />
          <Route path="*" element={<NotFound />} />

        </Route>
      </Routes>
    </Router>
  );
};

export default AppRouter;
