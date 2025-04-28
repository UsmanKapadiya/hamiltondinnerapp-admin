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
