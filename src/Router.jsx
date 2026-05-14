import React from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import App from "./App";
// import {
//   Dashboard
// } from "./scenes";
import Dashboard from "./scenes/dashboard/DashboardController";
import Room from "./scenes/room/RoomController";
import RoomDetailsForm from "./scenes/room/RoomDetailsForm/RoomDetailsFormController";
import RoomDetailsView from "./scenes/room/RoomDetailsView/RoomDetailsViewController";
import Category from "./scenes/category/CategoryController";
import CategoryDetailsView from "./scenes/category/CategoryDetailsViewController";
import CategoryDetailsForm from "./scenes/category/CategoryDetailsFormController";
import Item from "./scenes/item";
import ItemDetailsView from "./scenes/item/itemDetails-view";
import ItemDetailsForm from "./scenes/item/itemDetails-form";
import Login from "./scenes/login/LoginController";
import ItemOptions from "./scenes/menuDetails/options";
import ItemoptionsForm from "./scenes/menuDetails/options/itemOptions-form";
import ItemOptionsView from "./scenes/menuDetails/options/ItemOptionsViewController";
import ItemPreferences from "./scenes/menuDetails/preferences";
import ItemPreferencesView from "./scenes/menuDetails/preferences/ItemPreferencesViewController";
import ItemPreferencesForm from "./scenes/menuDetails/preferences/itemPreferences-form";
import MenuDetails from "./scenes/menuDetails/MenuDetailsController";
import MenuDetailsController from "./scenes/menuDetails/MenuDetailsForm/MenuDetailsFormController";
// import MenuDetailsForm from "./scenes/menuDetails/MenuDetailsForm/MenuDetailsFormController";
import MenuDetailsView from "./scenes/menuDetails/MenuDetailsView/MenuDetailsViewController";
import OrderDetails from "./scenes/orderDetails/OrderDetailsController";
import Setting from "./scenes/settings/SettingController";
import Roles from "./scenes/Roles/RolesController";
import RolesDetailsView from "./scenes/Roles/RolesDetailsView/RolesDetailsViewController";
import RoleDetailsForm from "./scenes/Roles/RoleDetailsForm/RoleDetailsFormController";
import User from "./scenes/user/UserController";
import UserDetailsView from "./scenes/user/userDetailsView/UserDetailsViewController";
import UserDetailsForm from "./scenes/user/UserDetailsForm/UserDetailsForm";
import NotFound from "./scenes/pageNotFounf/NotFound";
import Forms from "./scenes/Forms/FormsController";
import FormsAddUpdate from "./scenes/Forms/FormsAddUpdate/FormsAddUpdateController";
import FormsDetailsView from "./scenes/Forms/FormsDetailsView/FormsDetailsView";
import ChargesReports from "./scenes/chargesReports/ChargesReportsController";


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
          {/*Resident  */}
          <Route path="/resident-details" element={<Room />} />
          <Route path="/resident-details/create" element={<RoomDetailsForm />} />
          <Route path="/resident-details/:id/edit" element={<RoomDetailsForm />} />
          <Route path="/resident-details/:id" element={<RoomDetailsView />} />
          {/*Category  */}
          <Route path="/category-details" element={<Category />} />
          <Route path="/category-details/create" element={<CategoryDetailsForm />} />
          <Route path="/category-details/:id/edit" element={<CategoryDetailsForm />} />
          <Route path="/category-details/:id" element={<CategoryDetailsView />} />
          {/*Item  */}
          <Route path="/menu-item-details" element={<Item />} />
          <Route path="/menu-item-details/:id" element={<ItemDetailsView />} />
          <Route path="/menu-item-details/:id/edit" element={<ItemDetailsForm />} />
          <Route path="/menu-item-details/create" element={<ItemDetailsForm />} />
          {/*Item Options */}
          <Route path="/menu-item-options" element={<ItemOptions />} />
          <Route path="/menu-item-options/create" element={<ItemoptionsForm />} />
          <Route path="/menu-item-options/:id/edit" element={<ItemoptionsForm />} />
          <Route path="/menu-item-options/:id" element={<ItemOptionsView />} />
          {/*Item Preferences */}
          <Route path="/menu-item-preferences" element={<ItemPreferences />} />
          <Route path="/menu-item-preferences/create" element={<ItemPreferencesForm />} />
          <Route path="/menu-item-preferences/:id/edit" element={<ItemPreferencesForm />} />
          <Route path="/menu-item-preferences/:id" element={<ItemPreferencesView />} />
          {/*Menu Details */}
          <Route path="/menu-details" element={<MenuDetails />} />
          <Route path="/menu-details/create" element={<MenuDetailsController />} />
          <Route path="/menu-details/:id/edit" element={<MenuDetailsController />} />
          <Route path="/menu-details/:id" element={<MenuDetailsView />} />
          {/*Order Details */}
          <Route path="/order-details" element={<OrderDetails />} />
          <Route path="/charges-reports" element={<ChargesReports />} />

          {/*Menu Details */}
          <Route path="/settings" element={<Setting />} />

          <Route path="/roles-details" element={<Roles />} />
          <Route path="/roles-details/:id" element={<RolesDetailsView />} />
          <Route path="/roles-details/create" element={<RoleDetailsForm />} />
          <Route path="/roles-details/:id/edit" element={<RoleDetailsForm />} />
          {/* User */}
          <Route path="/users-details" element={<User />} />
          <Route path="/users-details/:id" element={<UserDetailsView />} />
          <Route path="/users-details/create" element={<UserDetailsForm />} />
          <Route path="/users-details/:id/edit" element={<UserDetailsForm />} />
          
          {/* Forms */}          
          {/* Temperorry Commented */}
          {/* <Route path="/forms" element={<Forms />} />
          <Route path="/forms/:id" element={<FormsDetailsView />} />
          <Route path="/forms/create" element={<FormsAddUpdate />} />
          <Route path="/forms/:id/edit" element={<FormsAddUpdate />} /> */}

          
          <Route path="*" element={<NotFound />} />

        </Route>
      </Routes>
    </Router>
  );
};

export default AppRouter;
