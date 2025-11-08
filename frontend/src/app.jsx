import React from 'react'
import {Home} from './pages/home.jsx';
import {createBrowserRouter, RouterProvider} from 'react-router';
import axios from 'axios';
import {MainNavigation} from './components/mainNavigation.jsx';
import AddFoodRecipe from './pages/addFoodRecipe.jsx';

const getAllRecipes = async () => {
  const res = await axios.get('http://localhost:5000/recipe')
  return res.data.data
}

const router = createBrowserRouter([

  {path:"/",element:<MainNavigation/>,children:[
      {path:"/",element:<Home/>,loader: getAllRecipes},
      {path:"/addRecipe",element:<AddFoodRecipe/>},
    ]}

])
export const App = () => {
  return (
    <RouterProvider router={router}></RouterProvider>
  )
}
