import React,{useEffect} from 'react'
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import  AppRoutes from './utils/AppRoutes';
import { Navigate, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';


<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-T3c6CoIi6uLrA9TneNEoa7RxnatzjcDSCmG1MXxSR1GAsXEV/Dwwykc2MPK8M2HN" crossOrigin="anonymous"/>



function App() {
  const routes=createBrowserRouter(AppRoutes)
  
  return <>
 <RouterProvider router={routes} />
  </>
}

export default App