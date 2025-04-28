import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import App from "./App";
import {
  Dashboard,
  Team,
  Invoices,
  Contacts,
  Form,
  Bar,
  Line,
  Pie,
  FAQ,
  Geography,
  Calendar,
  Stream,
} from "./scenes";
import Room from "./scenes/room";
import RoomDetailsForm from "./scenes/room/roomDetails-form";
import RoomDetailsOrder from "./scenes/room/roomDetailsOrder";
import RoomDetailsView from "./scenes/room/roomDetails-view";
import Category from "./scenes/category";
import CategoryDetailsView from "./scenes/category/caregoryDetails-view";
import CategoryDetailsForm from "./scenes/category/caregoryDetails-form";
import CategoryDetailsOrder from "./scenes/category/caregoryDetailsOrder";
import Item from "./scenes/item";
import ItemDetailsView from "./scenes/item/itemDetails-view";
import ItemDetailsForm from "./scenes/item/itemDetails-form";
import ItemDetailsOrder from "./scenes/item/itemDetailsOrder";
import Login from "./scenes/login";

const AppRouter = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login/>}/>
        <Route path="/" element={<App />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/room-details" element={<Room />} />
          <Route path="/room-details/:id" element={<RoomDetailsView />} />
          <Route path="/room-details/:id/edit" element={<RoomDetailsForm />} />
          <Route path="/room-details/create" element={<RoomDetailsForm />} />
          <Route path="/room-details/order" element={<RoomDetailsOrder/>} />
          <Route path="/category-details" element={<Category />} />  
          <Route path="/category-details/:id" element={<CategoryDetailsView />} />
          <Route path="/category-details/:id/edit" element={<CategoryDetailsForm />} />
          <Route path="/category-details/create" element={<CategoryDetailsForm />} />
          <Route path="/category-details/order" element={<CategoryDetailsOrder/>} />     
          <Route path="/item-details" element={<Item />} />  
          <Route path="/item-details/:id" element={<ItemDetailsView />} />
          <Route path="/item-details/:id/edit" element={<ItemDetailsForm />} />
          <Route path="/item-details/create" element={<ItemDetailsForm />} />
          <Route path="/item-details/order" element={<ItemDetailsOrder/>} />        
          <Route path="/team" element={<Team />} />
          <Route path="/contacts" element={<Contacts />} />
          <Route path="/invoices" element={<Invoices />} />
          <Route path="/form" element={<Form />} />
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/bar" element={<Bar />} />
          <Route path="/pie" element={<Pie />} />
          <Route path="/stream" element={<Stream />} />
          <Route path="/line" element={<Line />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/geography" element={<Geography />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default AppRouter;
