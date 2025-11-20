import React, { useState, useEffect } from 'react'
import { Clock, Users, ChefHat, Bookmark, Share2, Heart, ArrowLeft, CheckCircle2, UserPlus, UserCheck, Check } from 'lucide-react'
import { useLoaderData, useNavigate } from 'react-router'
import { motion } from 'framer-motion'
import axios from 'axios'

export const RecipeDetails = () => {
  const recipe = useLoaderData()
  const navigate = useNavigate()
  const recipeData = recipe.data

  const recipeId = recipeData._id

  const [isSaved, setIsSaved] = useState(false)
  const [isLiked, setIsLiked] = useState(false)
  const [isFollowing, setIsFollowing] = useState(false)
  const [isCooked, setIsCooked] = useState(false)
  const [creatorEmail, setCreatorEmail] = useState('Unknown')

  // Load saved states from localStorage upon mount or when recipe changes
  useEffect(() => {
    const followingList = JSON.parse(localStorage.getItem('followingUsers') || '[]')
    setIsFollowing(followingList.includes(recipeData.createdBy))

    const cookedRecipes = JSON.parse(localStorage.getItem('cookedRecipes') || '[]')
    setIsCooked(cookedRecipes.includes(recipeId))

    const savedRecipes = JSON.parse(localStorage.getItem('savedRecipes') || '[]')
    setIsSaved(savedRecipes.includes(recipeId))

    const likedRecipes = JSON.parse(localStorage.getItem('likedRecipes') || '[]')
    setIsLiked(likedRecipes.includes(recipeId))
  }, [recipeId, recipeData.createdBy])

  // Fetch creator email from backend API
  useEffect(() => {
    const fetchCreator = async () => {
      try {
        const token = localStorage.getItem('token')
        const response = await axios.get(`https://recipes-app-8kbz.vercel.app/user/${recipeData.createdBy}`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        const email = response.data.email || response.data.data?.email || 'Chef'
        setCreatorEmail(email)
      } catch (error) {
        console.error('Error fetching creator:', error)
        setCreatorEmail('Chef')
      }
    }

    if (recipeData.createdBy) {
      fetchCreator()
    }
  }, [recipeData.createdBy])

  // Toggle handlers updating localStorage and state
  const toggleLocalStorageArray = (key, id, setState) => {
    const arr = JSON.parse(localStorage.getItem(key) || '[]')

    if (arr.includes(id)) {
      const updated = arr.filter(i => i !== id)
      localStorage.setItem(key, JSON.stringify(updated))
      setState(false)
    } else {
      arr.push(id)
      localStorage.setItem(key, JSON.stringify(arr))
      setState(true)
    }
  }

  const handleFollowToggle = () => toggleLocalStorageArray('followingUsers', recipeData.createdBy, setIsFollowing)
  const handleCookedToggle = () => toggleLocalStorageArray('cookedRecipes', recipeId, setIsCooked)
  const handleSaveToggle = () => toggleLocalStorageArray('savedRecipes', recipeId, setIsSaved)
  const handleLikeToggle = () => toggleLocalStorageArray('likedRecipes', recipeId, setIsLiked)

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50">
      {/* Header with back button */}
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <button onClick={() => navigate(-1)} className="flex items-center space-x-2 text-gray-600 hover:text-orange-500 transition-colors">
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Back</span>
          </button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Recipe hero section */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-3xl shadow-2xl overflow-hidden mb-8">
          <div className="relative h-[400px] overflow-hidden">
            <img
              src={recipeData.coverImage}
              alt={recipeData.title}
              className="w-full h-full object-cover"
              onError={e => {
                e.target.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800'
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>

            {/* Floating buttons */}
            <div className="absolute top-6 right-6 flex space-x-3">
              <motion.button onClick={handleSaveToggle} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} className="bg-white/90 backdrop-blur-sm p-3 rounded-full shadow-lg hover:bg-white transition-all">
                <Bookmark className={`w-5 h-5 ${isSaved ? 'fill-orange-500 text-orange-500' : 'text-gray-700'}`} />
              </motion.button>
              <motion.button onClick={handleLikeToggle} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} className="bg-white/90 backdrop-blur-sm p-3 rounded-full shadow-lg hover:bg-white transition-all">
                <Heart className={`w-5 h-5 ${isLiked ? 'fill-red-500 text-red-500' : 'text-gray-700'}`} />
              </motion.button>
              <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} className="bg-white/90 backdrop-blur-sm p-3 rounded-full shadow-lg hover:bg-white transition-all">
                <Share2 className="w-5 h-5 text-gray-700" />
              </motion.button>
            </div>

            {/* Title */}
            <div className="absolute bottom-0 left-0 right-0 p-8">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-2 drop-shadow-lg">{recipeData.title}</h1>
            </div>
          </div>

          {/* Creator and quick info */}
          <div className="p-8">
            <div className="flex items-center justify-between mb-6 pb-6 border-b border-gray-100">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <img
                    src={`https://ui-avatars.com/api/?name=${creatorEmail}&background=f97316&color=fff&size=60&bold=true`}
                    alt="Profile"
                    className="w-14 h-14 rounded-full ring-4 ring-orange-100"
                  />
                  <div className="absolute -bottom-1 -right-1 bg-green-500 w-5 h-5 rounded-full border-4 border-white"></div>
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-medium">Created by</p>
                  <p className="text-lg font-semibold text-gray-800">{creatorEmail}</p>
                  <p className="text-xs text-gray-400">{new Date(recipeData.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                </div>
              </div>
              <motion.button
                onClick={handleFollowToggle}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`px-6 py-2 font-semibold rounded-full shadow-lg hover:shadow-xl transition-all flex items-center space-x-2 ${
                  isFollowing ? 'bg-gray-100 text-gray-700 hover:bg-gray-200' : 'bg-gradient-to-r from-orange-500 to-amber-500 text-white'
                }`}
              >
                {isFollowing ? (
                  <>
                    <UserCheck className="w-4 h-4" />
                    <span>Following</span>
                  </>
                ) : (
                  <>
                    <UserPlus className="w-4 h-4" />
                    <span>Follow</span>
                  </>
                )}
              </motion.button>
            </div>

            {/* Quick info cards */}
            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-2xl p-4 text-center">
                <Clock className="w-8 h-8 text-orange-500 mx-auto mb-2" />
                <p className="text-2xl font-bold text-gray-800">{recipeData.time || '30 min'}</p>
                <p className="text-sm text-gray-600">Prep Time</p>
              </div>
              <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-2xl p-4 text-center">
                <ChefHat className="w-8 h-8 text-orange-500 mx-auto mb-2" />
                <p className="text-2xl font-bold text-gray-800">Easy</p>
                <p className="text-sm text-gray-600">Difficulty</p>
              </div>
              <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-2xl p-4 text-center">
                <Users className="w-8 h-8 text-orange-500 mx-auto mb-2" />
                <p className="text-2xl font-bold text-gray-800">4</p>
                <p className="text-sm text-gray-600">Servings</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Ingredients & Instructions */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Ingredients */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="lg:col-span-1">
            <div className="bg-white rounded-3xl shadow-xl p-8 sticky top-24">
              <div className="flex items-center space-x-3 mb-6">
                <div className="bg-gradient-to-r from-orange-500 to-amber-500 p-3 rounded-2xl">
                  <CheckCircle2 className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800">Ingredients</h2>
              </div>

              <div className="space-y-3">
                {recipeData.ingredients?.length > 0 ? (
                  recipeData.ingredients.map((item, index) => (
                    <motion.div key={index} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 + index * 0.05 }} className="flex items-start space-x-3 p-3 rounded-xl hover:bg-orange-50 transition-colors group">
                      <div className="flex-shrink-0 mt-1">
                        <div className="w-6 h-6 rounded-full bg-orange-100 flex items-center justify-center group-hover:bg-orange-200 transition-colors">
                          <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                        </div>
                      </div>
                      <p className="text-gray-700 leading-relaxed">{item.trim()}</p>
                    </motion.div>
                  ))
                ) : (
                  <p className="text-gray-500 text-center py-4">No ingredients listed</p>
                )}
              </div>

              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="w-full mt-6 px-6 py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all">
                Add to Shopping List
              </motion.button>
            </div>
          </motion.div>

          {/* Instructions */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }} className="lg:col-span-2">
            <div className="bg-white rounded-3xl shadow-xl p-8">
              <div className="flex items-center space-x-3 mb-6">
                <div className="bg-gradient-to-r from-orange-500 to-amber-500 p-3 rounded-2xl">
                  <ChefHat className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800">Instructions</h2>
              </div>

              <div className="prose prose-lg max-w-none">
                <div className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-2xl p-6 border-l-4 border-orange-500">
                  <p className="text-gray-700 leading-relaxed whitespace-pre-line">{recipeData.instructions || 'No instructions provided'}</p>
                </div>
              </div>

              {/* Tips Section */}
              <div className="mt-8 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border-l-4 border-blue-500">
                <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center space-x-2">
                  <span>💡</span>
                  <span>Pro Tips</span>
                </h3>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start space-x-2">
                    <span className="text-blue-500 mt-1">•</span>
                    <span>Read through all instructions before starting</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-blue-500 mt-1">•</span>
                    <span>Prepare all ingredients beforehand (mise en place)</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-blue-500 mt-1">•</span>
                    <span>Adjust seasoning to your taste preference</span>
                  </li>
                </ul>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 mt-8">
                <motion.button
                  onClick={handleCookedToggle}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`flex-1 px-6 py-4 font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center space-x-2 ${
                    isCooked ? 'bg-gray-100 text-gray-700 hover:bg-gray-200' : 'bg-gradient-to-r from-green-500 to-emerald-500 text-white'
                  }`}
                >
                  {isCooked ? (
                    <>
                      <Check className="w-5 h-5" />
                      <span>Marked</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-5 h-5" />
                      <span>Mark as Cooked</span>
                    </>
                  )}
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex-1 px-6 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center space-x-2"
                >
                  <Share2 className="w-5 h-5" />
                  <span>Share Recipe</span>
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}







// import React, { useState, useEffect } from 'react'
// import { Clock, Users, ChefHat, Bookmark, Share2, Heart, ArrowLeft, CheckCircle2, UserPlus, UserCheck, Check } from 'lucide-react'
// import { useLoaderData, useNavigate } from 'react-router'
// import { motion } from 'framer-motion'
// import axios from 'axios'
//
// export const RecipeDetails = () => {
//   const recipe = useLoaderData()
//   const navigate = useNavigate()
//   const recipeData = recipe.data
//   const recipeId = recipeData._id
//
//   const [isSaved, setIsSaved] = useState(false)
//   const [isLiked, setIsLiked] = useState(false)
//   const [isFollowing, setIsFollowing] = useState(false)
//   const [isCooked, setIsCooked] = useState(false)
//   const [creatorEmail, setCreatorEmail] = useState('Unknown')
//
//   // Load saved states from localStorage on mount
//   useEffect(() => {
//     // Load following state
//     const followingList = JSON.parse(localStorage.getItem('followingUsers') || '[]')
//     setIsFollowing(followingList.includes(recipeData.createdBy))
//
//     // Load cooked state
//     const cookedRecipes = JSON.parse(localStorage.getItem('cookedRecipes') || '[]')
//     setIsCooked(cookedRecipes.includes(recipeId))
//
//     // Load saved state
//     const savedRecipes = JSON.parse(localStorage.getItem('savedRecipes') || '[]')
//     setIsSaved(savedRecipes.includes(recipeId))
//
//     // Load liked state
//     const likedRecipes = JSON.parse(localStorage.getItem('likedRecipes') || '[]')
//     setIsLiked(likedRecipes.includes(recipeId))
//   }, [recipeId, recipeData.createdBy])
//
//   // Fetch creator email from user ID
//   useEffect(() => {
//     const fetchCreator = async () => {
//       try {
//         const token = localStorage.getItem('token')
//         const response = await axios.get(`https://recipes-app-8kbz.vercel.app/user/${recipeData.createdBy}`, {
//           headers: {
//             'Authorization': `Bearer ${token}`
//           }
//         })
//         setCreatorEmail(response.data.email || response.data.data?.email || 'Chef')
//       } catch (error) {
//         console.error('Error fetching creator:', error)
//         setCreatorEmail('Chef')
//       }
//     }
//
//     if (recipeData.createdBy) {
//       fetchCreator()
//     }
//   }, [recipeData.createdBy])
//
//   // Toggle following
//   const handleFollowToggle = () => {
//     const followingList = JSON.parse(localStorage.getItem('followingUsers') || '[]')
//
//     if (isFollowing) {
//       // Unfollow
//       const updatedList = followingList.filter(id => id !== recipeData.createdBy)
//       localStorage.setItem('followingUsers', JSON.stringify(updatedList))
//       setIsFollowing(false)
//     } else {
//       // Follow
//       followingList.push(recipeData.createdBy)
//       localStorage.setItem('followingUsers', JSON.stringify(followingList))
//       setIsFollowing(true)
//     }
//   }
//
//   // Toggle cooked
//   const handleCookedToggle = () => {
//     const cookedRecipes = JSON.parse(localStorage.getItem('cookedRecipes') || '[]')
//
//     if (isCooked) {
//       // Unmark
//       const updatedList = cookedRecipes.filter(id => id !== recipeId)
//       localStorage.setItem('cookedRecipes', JSON.stringify(updatedList))
//       setIsCooked(false)
//     } else {
//       // Mark as cooked
//       cookedRecipes.push(recipeId)
//       localStorage.setItem('cookedRecipes', JSON.stringify(cookedRecipes))
//       setIsCooked(true)
//     }
//   }
//
//   // Toggle saved
//   const handleSaveToggle = () => {
//     const savedRecipes = JSON.parse(localStorage.getItem('savedRecipes') || '[]')
//
//     if (isSaved) {
//       const updatedList = savedRecipes.filter(id => id !== recipeId)
//       localStorage.setItem('savedRecipes', JSON.stringify(updatedList))
//       setIsSaved(false)
//     } else {
//       savedRecipes.push(recipeId)
//       localStorage.setItem('savedRecipes', JSON.stringify(savedRecipes))
//       setIsSaved(true)
//     }
//   }
//
//   // Toggle liked
//   const handleLikeToggle = () => {
//     const likedRecipes = JSON.parse(localStorage.getItem('likedRecipes') || '[]')
//
//     if (isLiked) {
//       const updatedList = likedRecipes.filter(id => id !== recipeId)
//       localStorage.setItem('likedRecipes', JSON.stringify(updatedList))
//       setIsLiked(false)
//     } else {
//       likedRecipes.push(recipeId)
//       localStorage.setItem('likedRecipes', JSON.stringify(likedRecipes))
//       setIsLiked(true)
//     }
//   }
//
//   return (
//     <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50">
//       {/* Header with Back Button */}
//       <div className="bg-white shadow-sm sticky top-0 z-10">
//         <div className="container mx-auto px-4 py-4">
//           <button
//             onClick={() => navigate(-1)}
//             className="flex items-center space-x-2 text-gray-600 hover:text-orange-500 transition-colors"
//           >
//             <ArrowLeft className="w-5 h-5" />
//             <span className="font-medium">Back</span>
//           </button>
//         </div>
//       </div>
//
//       <div className="container mx-auto px-4 py-8 max-w-6xl">
//         {/* Hero Section */}
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           className="bg-white rounded-3xl shadow-2xl overflow-hidden mb-8"
//         >
//           {/* Cover Image */}
//           <div className="relative h-[400px] overflow-hidden">
//             <img
//               src={`https://recipes-app-8kbz.vercel.app/public/images/${recipeData.coverImage}`}
//               alt={recipeData.title}
//               className="w-full h-full object-cover"
//               onError={(e) => {
//                 e.target.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800'
//               }}
//             />
//             <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
//
//             {/* Floating Action Buttons */}
//             <div className="absolute top-6 right-6 flex space-x-3">
//               <motion.button
//                 whileHover={{ scale: 1.1 }}
//                 whileTap={{ scale: 0.9 }}
//                 onClick={handleSaveToggle}
//                 className="bg-white/90 backdrop-blur-sm p-3 rounded-full shadow-lg hover:bg-white transition-all"
//               >
//                 <Bookmark className={`w-5 h-5 ${isSaved ? 'fill-orange-500 text-orange-500' : 'text-gray-700'}`} />
//               </motion.button>
//               <motion.button
//                 whileHover={{ scale: 1.1 }}
//                 whileTap={{ scale: 0.9 }}
//                 onClick={handleLikeToggle}
//                 className="bg-white/90 backdrop-blur-sm p-3 rounded-full shadow-lg hover:bg-white transition-all"
//               >
//                 <Heart className={`w-5 h-5 ${isLiked ? 'fill-red-500 text-red-500' : 'text-gray-700'}`} />
//               </motion.button>
//               <motion.button
//                 whileHover={{ scale: 1.1 }}
//                 whileTap={{ scale: 0.9 }}
//                 className="bg-white/90 backdrop-blur-sm p-3 rounded-full shadow-lg hover:bg-white transition-all"
//               >
//                 <Share2 className="w-5 h-5 text-gray-700" />
//               </motion.button>
//             </div>
//
//             {/* Title Overlay */}
//             <div className="absolute bottom-0 left-0 right-0 p-8">
//               <h1 className="text-4xl md:text-5xl font-bold text-white mb-2 drop-shadow-lg">
//                 {recipeData.title}
//               </h1>
//             </div>
//           </div>
//
//           {/* Author & Quick Info */}
//           <div className="p-8">
//             {/* Author Profile */}
//             <div className="flex items-center justify-between mb-6 pb-6 border-b border-gray-100">
//               <div className="flex items-center space-x-4">
//                 <div className="relative">
//                   <img
//                     src={`https://ui-avatars.com/api/?name=${creatorEmail}&background=f97316&color=fff&size=60&bold=true`}
//                     alt="Profile"
//                     className="w-14 h-14 rounded-full ring-4 ring-orange-100"
//                   />
//                   <div className="absolute -bottom-1 -right-1 bg-green-500 w-5 h-5 rounded-full border-4 border-white"></div>
//                 </div>
//                 <div>
//                   <p className="text-sm text-gray-500 font-medium">Created by</p>
//                   <p className="text-lg font-semibold text-gray-800">{creatorEmail}</p>
//                   <p className="text-xs text-gray-400">
//                     {new Date(recipeData.createdAt).toLocaleDateString('en-US', {
//                       month: 'short',
//                       day: 'numeric',
//                       year: 'numeric'
//                     })}
//                   </p>
//                 </div>
//               </div>
//               <motion.button
//                 whileHover={{ scale: 1.05 }}
//                 whileTap={{ scale: 0.95 }}
//                 onClick={handleFollowToggle}
//                 className={`px-6 py-2 font-semibold rounded-full shadow-lg hover:shadow-xl transition-all flex items-center space-x-2 ${
//                   isFollowing
//                     ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
//                     : 'bg-gradient-to-r from-orange-500 to-amber-500 text-white'
//                 }`}
//               >
//                 {isFollowing ? (
//                   <>
//                     <UserCheck className="w-4 h-4" />
//                     <span>Following</span>
//                   </>
//                 ) : (
//                   <>
//                     <UserPlus className="w-4 h-4" />
//                     <span>Follow</span>
//                   </>
//                 )}
//               </motion.button>
//             </div>
//
//             {/* Quick Info Cards */}
//             <div className="grid grid-cols-3 gap-4 mb-8">
//               <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-2xl p-4 text-center">
//                 <Clock className="w-8 h-8 text-orange-500 mx-auto mb-2" />
//                 <p className="text-2xl font-bold text-gray-800">{recipeData.time || '30 min'}</p>
//                 <p className="text-sm text-gray-600">Prep Time</p>
//               </div>
//               <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-2xl p-4 text-center">
//                 <ChefHat className="w-8 h-8 text-orange-500 mx-auto mb-2" />
//                 <p className="text-2xl font-bold text-gray-800">Easy</p>
//                 <p className="text-sm text-gray-600">Difficulty</p>
//               </div>
//               <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-2xl p-4 text-center">
//                 <Users className="w-8 h-8 text-orange-500 mx-auto mb-2" />
//                 <p className="text-2xl font-bold text-gray-800">4</p>
//                 <p className="text-sm text-gray-600">Servings</p>
//               </div>
//             </div>
//           </div>
//         </motion.div>
//
//         {/* Content Grid */}
//         <div className="grid lg:grid-cols-3 gap-8">
//           {/* Ingredients */}
//           <motion.div
//             initial={{ opacity: 0, x: -20 }}
//             animate={{ opacity: 1, x: 0 }}
//             transition={{ delay: 0.2 }}
//             className="lg:col-span-1"
//           >
//             <div className="bg-white rounded-3xl shadow-xl p-8 sticky top-24">
//               <div className="flex items-center space-x-3 mb-6">
//                 <div className="bg-gradient-to-r from-orange-500 to-amber-500 p-3 rounded-2xl">
//                   <CheckCircle2 className="w-6 h-6 text-white" />
//                 </div>
//                 <h2 className="text-2xl font-bold text-gray-800">Ingredients</h2>
//               </div>
//
//               <div className="space-y-3">
//                 {recipeData.ingredients?.length > 0 ? (
//                   recipeData.ingredients.map((item, index) => (
//                     <motion.div
//                       key={index}
//                       initial={{ opacity: 0, x: -10 }}
//                       animate={{ opacity: 1, x: 0 }}
//                       transition={{ delay: 0.3 + index * 0.05 }}
//                       className="flex items-start space-x-3 p-3 rounded-xl hover:bg-orange-50 transition-colors group"
//                     >
//                       <div className="flex-shrink-0 mt-1">
//                         <div className="w-6 h-6 rounded-full bg-orange-100 flex items-center justify-center group-hover:bg-orange-200 transition-colors">
//                           <div className="w-2 h-2 rounded-full bg-orange-500"></div>
//                         </div>
//                       </div>
//                       <p className="text-gray-700 leading-relaxed">{item.trim()}</p>
//                     </motion.div>
//                   ))
//                 ) : (
//                   <p className="text-gray-500 text-center py-4">No ingredients listed</p>
//                 )}
//               </div>
//
//               <motion.button
//                 whileHover={{ scale: 1.02 }}
//                 whileTap={{ scale: 0.98 }}
//                 className="w-full mt-6 px-6 py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all"
//               >
//                 Add to Shopping List
//               </motion.button>
//             </div>
//           </motion.div>
//
//           {/* Instructions */}
//           <motion.div
//             initial={{ opacity: 0, x: 20 }}
//             animate={{ opacity: 1, x: 0 }}
//             transition={{ delay: 0.3 }}
//             className="lg:col-span-2"
//           >
//             <div className="bg-white rounded-3xl shadow-xl p-8">
//               <div className="flex items-center space-x-3 mb-6">
//                 <div className="bg-gradient-to-r from-orange-500 to-amber-500 p-3 rounded-2xl">
//                   <ChefHat className="w-6 h-6 text-white" />
//                 </div>
//                 <h2 className="text-2xl font-bold text-gray-800">Instructions</h2>
//               </div>
//
//               <div className="prose prose-lg max-w-none">
//                 <div className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-2xl p-6 border-l-4 border-orange-500">
//                   <p className="text-gray-700 leading-relaxed whitespace-pre-line">
//                     {recipeData.instructions || 'No instructions provided'}
//                   </p>
//                 </div>
//               </div>
//
//               {/* Tips Section */}
//               <div className="mt-8 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border-l-4 border-blue-500">
//                 <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center space-x-2">
//                   <span>💡</span>
//                   <span>Pro Tips</span>
//                 </h3>
//                 <ul className="space-y-2 text-gray-700">
//                   <li className="flex items-start space-x-2">
//                     <span className="text-blue-500 mt-1">•</span>
//                     <span>Read through all instructions before starting</span>
//                   </li>
//                   <li className="flex items-start space-x-2">
//                     <span className="text-blue-500 mt-1">•</span>
//                     <span>Prepare all ingredients beforehand (mise en place)</span>
//                   </li>
//                   <li className="flex items-start space-x-2">
//                     <span className="text-blue-500 mt-1">•</span>
//                     <span>Adjust seasoning to your taste preference</span>
//                   </li>
//                 </ul>
//               </div>
//
//               {/* Action Buttons */}
//               <div className="flex gap-4 mt-8">
//                 <motion.button
//                   whileHover={{ scale: 1.02 }}
//                   whileTap={{ scale: 0.98 }}
//                   onClick={handleCookedToggle}
//                   className={`flex-1 px-6 py-4 font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center space-x-2 ${
//                     isCooked
//                       ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
//                       : 'bg-gradient-to-r from-green-500 to-emerald-500 text-white'
//                   }`}
//                 >
//                   {isCooked ? (
//                     <>
//                       <Check className="w-5 h-5" />
//                       <span>Marked</span>
//                     </>
//                   ) : (
//                     <>
//                       <CheckCircle2 className="w-5 h-5" />
//                       <span>Mark as Cooked</span>
//                     </>
//                   )}
//                 </motion.button>
//                 <motion.button
//                   whileHover={{ scale: 1.02 }}
//                   whileTap={{ scale: 0.98 }}
//                   className="flex-1 px-6 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center space-x-2"
//                 >
//                   <Share2 className="w-5 h-5" />
//                   <span>Share Recipe</span>
//                 </motion.button>
//               </div>
//             </div>
//           </motion.div>
//         </div>
//       </div>
//     </div>
//   )
// }