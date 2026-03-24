import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import PublicLayout from "../layouts/PublicLayout";
import PrivateLayout from "../layouts/PrivateLayout";

import Home from "../pages/client/Home";
import Tours from "../pages/client/Tours";
import Contact from "../pages/client/Contact";
import Login from "../pages/client/Login";

import Dashboard from "../pages/admin/Dashboard";
import Users from "../pages/admin/Users";
import Packages from "../pages/admin/Packages";

import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const AppRouter = () => {
  const { isAuth } = useContext(AuthContext);

  return (
    <BrowserRouter>
      <Routes>

        {/* PUBLIC */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/tours" element={<Tours />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
        </Route>

        {/* PRIVATE */}
        <Route
          element={isAuth ? <PrivateLayout /> : <Navigate to="/login" />}
        >
          <Route path="/admin" element={<Dashboard />} />
          <Route path="/admin/users" element={<Users />} />
          <Route path="/admin/packages" element={<Packages />} />
        </Route>

      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;