import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'framer-motion';
import { Upload, Clock, ChefHat, FileText, Image, Loader2 } from 'lucide-react';

const API_BASE_URL = 'http://localhost:5000'; // Replace with your deployed backend URL

export default function AddFoodRecipe() {
  const [recipeData, setRecipeData] = useState({
    title: '',
    time: '',
    ingredients: '',
    instructions: '',
    file: null
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [preview, setPreview] = useState(null);

  const token = localStorage.getItem('token');

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === 'file') {
      const file = files[0];
      setRecipeData(prev => ({ ...prev, [name]: file }));

      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => setPreview(reader.result);
        reader.readAsDataURL(file);
      }
    } else {
      setRecipeData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('title', recipeData.title);
      formData.append('time', recipeData.time);
      formData.append('ingredients', recipeData.ingredients);
      formData.append('instructions', recipeData.instructions);

      if (recipeData.file) {
        formData.append('file', recipeData.file);
      }

      const response = await axios.post(`${API_BASE_URL}/recipe`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        }
      });

      // Optionally, handle response data here if needed
      navigate('/');
    } catch (err) {
      console.error('Error adding recipe:', err);
      setError(err.response?.data?.message || 'Failed to add recipe. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50 py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        className="max-w-3xl mx-auto"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <motion.div variants={itemVariants} className="text-center mb-8">
          <motion.div
            className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-orange-500 to-amber-500 rounded-full mb-4 shadow-lg"
            whileHover={{ scale: 1.1, rotate: 5 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <ChefHat className="w-8 h-8 text-white" />
          </motion.div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Add New Recipe</h1>
          <p className="text-gray-600">Share your culinary masterpiece with the world</p>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            <motion.div variants={itemVariants}>
              <label htmlFor="title" className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                <FileText className="w-4 h-4 mr-2 text-orange-500" />
                Recipe Title
              </label>
              <input
                id="title"
                type="text"
                name="title"
                value={recipeData.title}
                onChange={handleChange}
                required
                placeholder="e.g., Grandma's Chocolate Cake"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 outline-none"
              />
            </motion.div>

            <motion.div variants={itemVariants}>
              <label htmlFor="time" className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                <Clock className="w-4 h-4 mr-2 text-orange-500" />
                Cooking Time
              </label>
              <input
                id="time"
                type="text"
                name="time"
                value={recipeData.time}
                onChange={handleChange}
                required
                placeholder="e.g., 45 minutes"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 outline-none"
              />
            </motion.div>

            <motion.div variants={itemVariants}>
              <label htmlFor="ingredients" className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                <ChefHat className="w-4 h-4 mr-2 text-orange-500" />
                Ingredients
              </label>
              <textarea
                id="ingredients"
                name="ingredients"
                rows="5"
                value={recipeData.ingredients}
                onChange={handleChange}
                required
                placeholder="Enter each ingredient on a new line&#10;• 2 cups flour&#10;• 1 cup sugar&#10;• 3 eggs"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 outline-none resize-none"
              />
            </motion.div>

            <motion.div variants={itemVariants}>
              <label htmlFor="instructions" className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                <FileText className="w-4 h-4 mr-2 text-orange-500" />
                Instructions
              </label>
              <textarea
                id="instructions"
                name="instructions"
                rows="6"
                value={recipeData.instructions}
                onChange={handleChange}
                required
                placeholder="Describe the cooking steps in detail..."
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 outline-none resize-none"
              />
            </motion.div>

            <motion.div variants={itemVariants}>
              <label htmlFor="file" className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                <Image className="w-4 h-4 mr-2 text-orange-500" />
                Recipe Image
              </label>

              <div className="relative">
                <input
                  id="file"
                  type="file"
                  name="file"
                  onChange={handleChange}
                  accept="image/*"
                  className="hidden"
                />
                <label
                  htmlFor="file"
                  className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-orange-500 transition-all duration-200 bg-gray-50 hover:bg-orange-50"
                >
                  {preview ? (
                    <motion.img
                      src={preview}
                      alt="Preview"
                      className="h-full w-full object-cover rounded-lg"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    />
                  ) : (
                    <div className="text-center">
                      <Upload className="w-12 h-12 mx-auto text-gray-400 mb-2" />
                      <p className="text-sm text-gray-600 font-medium">Click to upload image</p>
                      <p className="text-xs text-gray-500 mt-1">PNG, JPG up to 10MB</p>
                    </div>
                  )}
                </label>
              </div>
            </motion.div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg"
              >
                {error}
              </motion.div>
            )}

            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-gradient-to-r from-orange-500 to-amber-500 text-white font-semibold py-4 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Adding Recipe...</span>
                </>
              ) : (
                <>
                  <Upload className="w-5 h-5" />
                  <span>Add Recipe</span>
                </>
              )}
            </motion.button>
          </form>
        </motion.div>

        <motion.p
          variants={itemVariants}
          className="text-center text-gray-500 text-sm mt-6"
        >
          Make sure all information is accurate before submitting
        </motion.p>
      </motion.div>
    </div>
  );
}



// import axios from 'axios';
// import React, { useState } from 'react';
// import { useNavigate } from 'react-router';
// import { motion } from 'framer-motion';
// import { Upload, Clock, ChefHat, FileText, Image, Loader2 } from 'lucide-react';
//
// const API_BASE_URL = 'http://localhost:5000';
//
// export default function AddFoodRecipe() {
//   const [recipeData, setRecipeData] = useState({
//     title: '',
//     time: '',
//     ingredients: '',
//     instructions: '',
//     file: null
//   });
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [preview, setPreview] = useState(null);
//
//   const token = localStorage.getItem('token');
//
//   const navigate = useNavigate();
//
//   const handleChange = (e) => {
//     const { name, value, files } = e.target;
//
//     if (name === 'file') {
//       const file = files[0];
//       setRecipeData(prev => ({ ...prev, [name]: file }));
//
//       if (file) {
//         const reader = new FileReader();
//         reader.onloadend = () => setPreview(reader.result);
//         reader.readAsDataURL(file);
//       }
//     } else {
//       setRecipeData(prev => ({ ...prev, [name]: value }));
//     }
//   };
//
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError(null);
//
//     try {
//       const formData = new FormData();
//       formData.append('title', recipeData.title);
//       formData.append('time', recipeData.time);
//       formData.append('ingredients', recipeData.ingredients);
//       formData.append('instructions', recipeData.instructions);
//
//       if (recipeData.file) {
//         formData.append('file', recipeData.file);
//       }
//
//       await axios.post(`${API_BASE_URL}/recipe`, formData, {
//         headers: {
//           'Content-Type': 'multipart/form-data',
//           'Authorization': `Bearer ${token}`
//         }
//       });
//
//       navigate('/');
//     } catch (err) {
//       console.error('Error adding recipe:', err);
//       setError(err.response?.data?.message || 'Failed to add recipe. Please try again.');
//     } finally {
//       setLoading(false);
//     }
//   };
//
//   const containerVariants = {
//     hidden: { opacity: 0, y: 20 },
//     visible: {
//       opacity: 1,
//       y: 0,
//       transition: { duration: 0.6, staggerChildren: 0.1 }
//     }
//   };
//
//   const itemVariants = {
//     hidden: { opacity: 0, x: -20 },
//     visible: { opacity: 1, x: 0 }
//   };
//
//   return (
//     <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50 py-12 px-4 sm:px-6 lg:px-8">
//       <motion.div
//         className="max-w-3xl mx-auto"
//         initial="hidden"
//         animate="visible"
//         variants={containerVariants}
//       >
//         {/* Header */}
//         <motion.div variants={itemVariants} className="text-center mb-8">
//           <motion.div
//             className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-orange-500 to-amber-500 rounded-full mb-4 shadow-lg"
//             whileHover={{ scale: 1.1, rotate: 5 }}
//             transition={{ type: "spring", stiffness: 300 }}
//           >
//             <ChefHat className="w-8 h-8 text-white" />
//           </motion.div>
//           <h1 className="text-4xl font-bold text-gray-900 mb-2">Add New Recipe</h1>
//           <p className="text-gray-600">Share your culinary masterpiece with the world</p>
//         </motion.div>
//
//         {/* Form Card */}
//         <motion.div
//           variants={itemVariants}
//           className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100"
//         >
//           <form onSubmit={handleSubmit} className="space-y-6">
//             {/* Title Input */}
//             <motion.div variants={itemVariants}>
//               <label htmlFor="title" className="flex items-center text-sm font-semibold text-gray-700 mb-2">
//                 <FileText className="w-4 h-4 mr-2 text-orange-500" />
//                 Recipe Title
//               </label>
//               <input
//                 id="title"
//                 type="text"
//                 name="title"
//                 value={recipeData.title}
//                 onChange={handleChange}
//                 required
//                 placeholder="e.g., Grandma's Chocolate Cake"
//                 className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 outline-none"
//               />
//             </motion.div>
//
//             {/* Time Input */}
//             <motion.div variants={itemVariants}>
//               <label htmlFor="time" className="flex items-center text-sm font-semibold text-gray-700 mb-2">
//                 <Clock className="w-4 h-4 mr-2 text-orange-500" />
//                 Cooking Time
//               </label>
//               <input
//                 id="time"
//                 type="text"
//                 name="time"
//                 value={recipeData.time}
//                 onChange={handleChange}
//                 required
//                 placeholder="e.g., 45 minutes"
//                 className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 outline-none"
//               />
//             </motion.div>
//
//             {/* Ingredients Textarea */}
//             <motion.div variants={itemVariants}>
//               <label htmlFor="ingredients" className="flex items-center text-sm font-semibold text-gray-700 mb-2">
//                 <ChefHat className="w-4 h-4 mr-2 text-orange-500" />
//                 Ingredients
//               </label>
//               <textarea
//                 id="ingredients"
//                 name="ingredients"
//                 rows="5"
//                 value={recipeData.ingredients}
//                 onChange={handleChange}
//                 required
//                 placeholder="Enter each ingredient on a new line&#10;• 2 cups flour&#10;• 1 cup sugar&#10;• 3 eggs"
//                 className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 outline-none resize-none"
//               />
//             </motion.div>
//
//             {/* Instructions Textarea */}
//             <motion.div variants={itemVariants}>
//               <label htmlFor="instructions" className="flex items-center text-sm font-semibold text-gray-700 mb-2">
//                 <FileText className="w-4 h-4 mr-2 text-orange-500" />
//                 Instructions
//               </label>
//               <textarea
//                 id="instructions"
//                 name="instructions"
//                 rows="6"
//                 value={recipeData.instructions}
//                 onChange={handleChange}
//                 required
//                 placeholder="Describe the cooking steps in detail..."
//                 className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 outline-none resize-none"
//               />
//             </motion.div>
//
//             {/* File Upload */}
//             <motion.div variants={itemVariants}>
//               <label htmlFor="file" className="flex items-center text-sm font-semibold text-gray-700 mb-2">
//                 <Image className="w-4 h-4 mr-2 text-orange-500" />
//                 Recipe Image
//               </label>
//
//               <div className="relative">
//                 <input
//                   id="file"
//                   type="file"
//                   name="file"
//                   onChange={handleChange}
//                   accept="image/*"
//                   className="hidden"
//                 />
//                 <label
//                   htmlFor="file"
//                   className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-orange-500 transition-all duration-200 bg-gray-50 hover:bg-orange-50"
//                 >
//                   {preview ? (
//                     <motion.img
//                       src={preview}
//                       alt="Preview"
//                       className="h-full w-full object-cover rounded-lg"
//                       initial={{ opacity: 0 }}
//                       animate={{ opacity: 1 }}
//                     />
//                   ) : (
//                     <div className="text-center">
//                       <Upload className="w-12 h-12 mx-auto text-gray-400 mb-2" />
//                       <p className="text-sm text-gray-600 font-medium">Click to upload image</p>
//                       <p className="text-xs text-gray-500 mt-1">PNG, JPG up to 10MB</p>
//                     </div>
//                   )}
//                 </label>
//               </div>
//             </motion.div>
//
//             {/* Error Message */}
//             {error && (
//               <motion.div
//                 initial={{ opacity: 0, y: -10 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg"
//               >
//                 {error}
//               </motion.div>
//             )}
//
//             {/* Submit Button */}
//             <motion.button
//               type="submit"
//               disabled={loading}
//               whileHover={{ scale: 1.02 }}
//               whileTap={{ scale: 0.98 }}
//               className="w-full bg-gradient-to-r from-orange-500 to-amber-500 text-white font-semibold py-4 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
//             >
//               {loading ? (
//                 <>
//                   <Loader2 className="w-5 h-5 animate-spin" />
//                   <span>Adding Recipe...</span>
//                 </>
//               ) : (
//                 <>
//                   <Upload className="w-5 h-5" />
//                   <span>Add Recipe</span>
//                 </>
//               )}
//             </motion.button>
//           </form>
//         </motion.div>
//
//         {/* Footer */}
//         <motion.p
//           variants={itemVariants}
//           className="text-center text-gray-500 text-sm mt-6"
//         >
//           Make sure all information is accurate before submitting
//         </motion.p>
//       </motion.div>
//     </div>
//   );
// }