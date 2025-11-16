import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import { motion } from 'framer-motion'
import { Save, Clock, ChefHat, ListChecks, FileText, Image, Loader2, ArrowLeft } from 'lucide-react'

export const EditRecipe = () => {
  const [recipeData, setRecipeData] = useState({})
  const [file, setFile] = useState(null) // Separate file state
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const navigate = useNavigate()
  const {id} = useParams()

  useEffect(() => {
    const getData = async () => {
      const token = localStorage.getItem("token")

      await axios.get(`http://localhost:5000/recipe/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      .then(response => {
        let res = response.data.data
        setRecipeData({
          title: res.title,
          ingredients: res.ingredients,
          instructions: res.instructions,
          time: res.time
        })
        setLoading(false)
      })
      .catch(error => {
        console.error('Error fetching recipe:', error)
        setLoading(false)
      })
    }
    getData()
  }, [id])

  const onHandleChange = (e) => {
    if (e.target.name === "file") {
      setFile(e.target.files[0])
    } else if (e.target.name === "ingredients") {
      setRecipeData(pre => ({ ...pre, [e.target.name]: e.target.value.split(",") }))
    } else {
      setRecipeData(pre => ({ ...pre, [e.target.name]: e.target.value }))
    }
  }

  const onHandleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)

    // Create FormData
    const formData = new FormData()
    formData.append('title', recipeData.title)
    formData.append('time', recipeData.time)
    formData.append('instructions', recipeData.instructions)

    // Ingredients কে JSON string বা comma-separated করে পাঠান
    if (Array.isArray(recipeData.ingredients)) {
      recipeData.ingredients.forEach(ingredient => {
        formData.append('ingredients[]', ingredient.trim())
      })
    }

    // File থাকলে add করুন
    if (file) {
      formData.append('file', file)
    }

    const token = localStorage.getItem("token")

    console.log('Sending FormData:')
    for (let pair of formData.entries()) {
      console.log(pair[0] + ': ' + pair[1])
    }

    try {
      await axios.put(`http://localhost:5000/recipe/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        }
      })
      navigate("/myRecipe")
    } catch (error) {
      console.error('Error updating recipe:', error.response?.data || error.message)
      alert('Failed to update recipe. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-orange-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-600 text-lg">Loading recipe...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <button
            onClick={() => navigate('/myRecipe')}
            className="flex items-center space-x-2 text-gray-600 hover:text-orange-500 mb-4 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to My Recipes</span>
          </button>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent mb-2">
            Edit Recipe
          </h1>
          <p className="text-gray-600 text-lg">Update your delicious recipe</p>
        </motion.div>

        {/* Form */}
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          onSubmit={onHandleSubmit}
          className="bg-white rounded-2xl shadow-xl p-8 space-y-6"
        >
          {/* Title */}
          <div className="space-y-2">
            <label className="flex items-center space-x-2 text-gray-700 font-semibold text-sm">
              <ChefHat className="w-5 h-5 text-orange-500" />
              <span>Recipe Title</span>
            </label>
            <input
              type="text"
              name="title"
              onChange={onHandleChange}
              value={recipeData.title || ''}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all outline-none text-gray-800"
              placeholder="Enter your recipe title"
              required
            />
          </div>

          {/* Time */}
          <div className="space-y-2">
            <label className="flex items-center space-x-2 text-gray-700 font-semibold text-sm">
              <Clock className="w-5 h-5 text-orange-500" />
              <span>Cooking Time</span>
            </label>
            <input
              type="text"
              name="time"
              onChange={onHandleChange}
              value={recipeData.time || ''}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all outline-none text-gray-800"
              placeholder="e.g., 30 minutes"
              required
            />
          </div>

          {/* Ingredients */}
          <div className="space-y-2">
            <label className="flex items-center space-x-2 text-gray-700 font-semibold text-sm">
              <ListChecks className="w-5 h-5 text-orange-500" />
              <span>Ingredients</span>
            </label>
            <textarea
              name="ingredients"
              rows="5"
              onChange={onHandleChange}
              value={Array.isArray(recipeData.ingredients) ? recipeData.ingredients.join(', ') : recipeData.ingredients || ''}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all outline-none text-gray-800 resize-none"
              placeholder="Enter ingredients separated by commas (e.g., flour, sugar, eggs)"
              required
            />
            <p className="text-sm text-gray-500">Separate ingredients with commas</p>
          </div>

          {/* Instructions */}
          <div className="space-y-2">
            <label className="flex items-center space-x-2 text-gray-700 font-semibold text-sm">
              <FileText className="w-5 h-5 text-orange-500" />
              <span>Instructions</span>
            </label>
            <textarea
              name="instructions"
              rows="6"
              onChange={onHandleChange}
              value={recipeData.instructions || ''}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all outline-none text-gray-800 resize-none"
              placeholder="Write step-by-step cooking instructions"
              required
            />
          </div>

          {/* Image Upload */}
          <div className="space-y-2">
            <label className="flex items-center space-x-2 text-gray-700 font-semibold text-sm">
              <Image className="w-5 h-5 text-orange-500" />
              <span>Recipe Image</span>
            </label>
            <div className="relative">
              <input
                type="file"
                name="file"
                onChange={onHandleChange}
                accept="image/*"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all outline-none text-gray-800 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-orange-50 file:text-orange-600 file:font-semibold hover:file:bg-orange-100 file:cursor-pointer cursor-pointer"
              />
            </div>
            <p className="text-sm text-gray-500">Upload a new image (optional)</p>
            {file && <p className="text-sm text-green-600">✓ New image selected: {file.name}</p>}
          </div>

          {/* Submit Button */}
          <div className="flex gap-4 pt-4">
            <motion.button
              type="button"
              onClick={() => navigate('/myRecipe')}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex-1 px-6 py-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl transition-all"
            >
              Cancel
            </motion.button>
            <motion.button
              type="submit"
              disabled={saving}
              whileHover={{ scale: saving ? 1 : 1.02 }}
              whileTap={{ scale: saving ? 1 : 0.98 }}
              className="flex-1 px-6 py-4 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {saving ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  <span>Save Changes</span>
                </>
              )}
            </motion.button>
          </div>
        </motion.form>
      </div>
    </div>
  )
}