import { createBrowserRouter, RouterProvider } from "react-router";
import Home from './pages/Home';
import MainNavigation from './components/MainNavigation';
import AddFoodRecipe from './pages/AddFoodRecipe';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000';


// ========== AXIOS SETUP ==========
// Axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests if available
// Note: Interceptor React component na, tai direct localStorage use korte hobe
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Optional: Response interceptor for global error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // 401 Unauthorized - token expired or invalid
    if (error.response?.status === 401) {
      console.log('Unauthorized - clearing auth data');
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // Optional: redirect to login
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ========== LOADERS ==========
// Note: Loaders React component na, tai direct localStorage use korte hobe

// Loader: Get all recipes
const getAllRecipes = async () => {
  try {
    const { data } = await api.get('/recipe');
    return data;
  } catch (error) {
    console.error('Error fetching recipes:', error);
    return [];
  }
};

// Loader: Get user's own recipes
const getMyRecipes = async () => {
  try {
    const userStr = localStorage.getItem('user');
    const user = userStr ? JSON.parse(userStr) : null;

    if (!user?._id) return [];

    const allRecipes = await getAllRecipes();
    return allRecipes.filter(recipe => recipe.createdBy === user._id);
  } catch (error) {
    console.error('Error fetching my recipes:', error);
    return [];
  }
};

// Loader: Get favorite recipes
const getFavRecipes = () => {
  try {
    const favRecipesStr = localStorage.getItem('fav');
    return favRecipesStr ? JSON.parse(favRecipesStr) : [];
  } catch (error) {
    console.error('Error fetching favorite recipes:', error);
    return [];
  }
};

// Loader: Get single recipe with user details
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

// ========== ROUTER CONFIGURATION ==========
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
        element: <Home />,
        loader: getMyRecipes
      },
      {
        path: "favRecipe",
        element: <Home />,
        loader: getFavRecipes
      },
      {
        path: "addRecipe",
        element: <AddFoodRecipe />
      }
    ]
  }
]);

export default function App() {
  return <RouterProvider router={router} />;
}