import React from "react";
import { Route } from "react-router-dom";
import Login from "../components/Login";
import Home from "../components/Home";
import Review from "../components/Review";
import Favourite from "../components/Favourite";
import Profile from "../components/Profile";
import Navbar from "../components/Navbar";
import { AuthProvider } from "../context/AuthProvider";
const AppRoutes = [
  {
    path: "/",
    element: <Login />,
  },
  {
    path: "/home",
    element: <AuthProvider><Navbar/><Home/></AuthProvider>,
  },
  {
    path: "/review/:bookId",
    element: <AuthProvider><Navbar/><Review /></AuthProvider>,
  },
  {
    path: "/favourite",
    element: <AuthProvider><Navbar/><Favourite /></AuthProvider>,
  },
  {
    path: "/profile",
    element: <AuthProvider><Navbar/><Profile /></AuthProvider>,
  },
];

export default AppRoutes;
