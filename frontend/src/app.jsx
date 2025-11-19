import { createBrowserRouter, RouterProvider } from "react-router";

import axios from 'axios';
import {Home} from './pages/home.jsx';
import {MainNavigation} from './components/mainNavigation.jsx';
import {ProtectedRoute} from './components/protectedRoute.jsx';
import {EditRecipe} from './pages/editRecipe.jsx';
import {RecipeDetails} from './pages/recipeDetails.jsx';
import AddFoodRecipe from './pages/addFoodRecipe.jsx';

const API_BASE_URL = 'http://localhost:5000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.log('Unauthorized - clearing auth data');
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
    return Promise.reject(error);
  }
);

const getAllRecipes = async () => {
  try {
    const { data } = await api.get('/recipe');
    return data.data;
  } catch (error) {
    console.error('Error fetching recipes:', error);
    return [];
  }
};

const getMyRecipes = async () => {
  try {
    const userStr = localStorage.getItem('user');

    const user = userStr ? JSON.parse(userStr) : null;
    console.log(user)

    if (!user?._id) return [];

    const allRecipes = await getAllRecipes();
    // console.log(allRecipes)

    return allRecipes.filter(recipe => recipe.createdBy === user._id);
  } catch (error) {
    console.error('Error fetching my recipes:', error);
    return [];
  }
};

const getFavRecipes = () => {
  try {
    const favRecipesStr = localStorage.getItem('fav');
    return favRecipesStr ? JSON.parse(favRecipesStr) : [];
  } catch (error) {
    console.error('Error fetching favorite recipes:', error);
    return [];
  }
};

const getRecipe = async ({ params }) => {
  try {
    const { data: recipe } = await api.get(`/recipe/${params.id}`);

    if (recipe?.createdBy) {
      const { data: user } = await api.get(`/user/${recipe.createdBy}`);
      return { ...recipe, email: user.email, userName: user.name };
    }

    return recipe;
  } catch (error) {
    console.error('Error fetching recipe:', error);
    throw new Response('Recipe not found', { status: 404 });
  }
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainNavigation />,
    children: [
      {
        index: true,
        element: <Home />,
        loader: getAllRecipes
      },
      {
        path: "myRecipe",
        element:  <ProtectedRoute><Home /></ProtectedRoute>,
        loader: getMyRecipes
      },
      {
        path: "favRecipe",
        element:  <ProtectedRoute><Home /></ProtectedRoute>,
        loader: getFavRecipes
      },
      {
        path: "addRecipe",
        element: <ProtectedRoute>
          <AddFoodRecipe />
        </ProtectedRoute>
      },
      {
        path: "editRecipe/:id",
        element: <ProtectedRoute>
          <EditRecipe />
        </ProtectedRoute>
      },
      {
        path: "recipe/:id",
        element: <RecipeDetails />,
        loader: getRecipe
      }
    ]
  }
]);

export default function App() {
  return <RouterProvider router={router} />;
}