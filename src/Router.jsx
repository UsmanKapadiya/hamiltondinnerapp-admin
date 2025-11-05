import React from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import App from "./App";
import {
  Dashboard,
  FAQ
} from "./scenes";
import Room from "./scenes/room";
import RoomDetailsForm from "./scenes/room/roomDetails-form";
import RoomDetailsView from "./scenes/room/roomDetails-view";
import Category from "./scenes/category";
import CategoryDetailsView from "./scenes/category/categoryDetails-view";
import CategoryDetailsForm from "./scenes/category/categoryDetails-form";
import Item from "./scenes/item";
import ItemDetailsView from "./scenes/item/itemDetails-view";
import ItemDetailsForm from "./scenes/item/itemDetails-form";
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
import Forms from "./scenes/Forms";
import FormsAddUpdate from "./scenes/Forms/forms-addUpdate";
import FormsDetailsView from "./scenes/Forms/formsDetails-view";
import ChargesReports from "./scenes/chargesReports";


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
          <Route path="/menu-details/create" element={<MenuDetailsForm />} />
          <Route path="/menu-details/:id/edit" element={<MenuDetailsForm />} />
          <Route path="/menu-details/:id" element={<MenuDetailsView />} />
          {/*Order Details */}
          <Route path="/order-details" element={<OrderDetails />} />
          
          {/* Temperorry Commented */}
          {/* <Route path="/charges-reports" element={<ChargesReports />} /> */}

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

          <Route path="/faq" element={<FAQ />} />
          <Route path="*" element={<NotFound />} />

        </Route>
      </Routes>
    </Router>
  );
};

export default AppRouter;
