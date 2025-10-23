import React from 'react'
import {Home} from './pages/home.jsx';
import {createBrowserRouter, RouterProvider} from 'react-router';
import axios from 'axios';

const getAllRecipes=async()=>{
  let allRecipes=[]
  await axios.get('http://localhost:5000/recipe').then(res=>{
    allRecipes=res.data
  })
  return allRecipes
}

const router = createBrowserRouter([

      {path:"/",element:<Home/>}

])
export const App = () => {
  return (
    <RouterProvider router={router}></RouterProvider>
  )
}
