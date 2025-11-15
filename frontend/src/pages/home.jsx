import React, { useState } from 'react'
import { motion } from 'framer-motion'
import foodRecipe from '../assets/foodRecipe.png'
import { RecipeItems } from '../components/recipeItems.jsx'
import { Modal } from '../components/modal.jsx'
import { InputForm } from '../components/inputForm.jsx'
import { useNavigate } from 'react-router';

export const Home = () => {
  const [isOpen, setIsOpen] = useState(false)
  const navigate = useNavigate()

  const addRecipe = () => {
    const token = localStorage.getItem('token')
    if (token)
      navigate("/addRecipe")
    else {
      setIsOpen(true)
    }
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  }

  const imageVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.8,
        ease: "easeOut"
      }
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-12 md:py-20">
        <motion.div
          className="flex flex-col lg:flex-row items-center justify-between gap-12"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Left Content */}
          <motion.div
            className="flex-1 space-y-6 text-center lg:text-left"
            variants={itemVariants}
          >
            <motion.h1
              className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 leading-tight"
              variants={itemVariants}
            >
              Food <span className="text-emerald-600">Recipe</span>
            </motion.h1>

            <motion.p
              className="text-lg md:text-xl text-gray-600 leading-relaxed max-w-2xl"
              variants={itemVariants}
            >
              Discover and share amazing recipes from around the world. Join our community of food lovers and explore endless culinary possibilities that will inspire your next meal.
            </motion.p>

            <motion.button
              onClick={addRecipe}
              className="px-8 py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
              variants={itemVariants}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Share Your Recipe
            </motion.button>
          </motion.div>

          {/* Right Image */}
          <motion.div
            className="flex-1 flex justify-center"
            variants={imageVariants}
          >
            <motion.img
              src={foodRecipe}
              alt="Food Recipe"
              className="w-full max-w-md lg:max-w-lg rounded-3xl shadow-2xl"
              whileHover={{ scale: 1.05, rotate: 2 }}
              transition={{ duration: 0.3 }}
            />
          </motion.div>
        </motion.div>
      </section>

      {/* Wave Divider */}
      <div className="relative">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1440 320"
            className="w-full"
          >
            <path
              fill="#d4f6e8"
              fillOpacity="1"
              d="M0,32L40,32C80,32,160,32,240,58.7C320,85,400,139,480,149.3C560,160,640,128,720,101.3C800,75,880,53,960,80C1040,107,1120,181,1200,213.3C1280,245,1360,235,1400,229.3L1440,224L1440,320L1400,320C1360,320,1280,320,1200,320C1120,320,1040,320,960,320C880,320,800,320,720,320C640,320,560,320,480,320C400,320,320,320,240,320C160,320,80,320,40,320L0,320Z"
            />
          </svg>
        </motion.div>
      </div>

      {/* Modal */}
      {isOpen && (
        <Modal onClose={() => setIsOpen(false)}>
          <InputForm setIsOpen={setIsOpen} />
        </Modal>
      )}

      {/* Recipe Items Section */}
      <motion.div
        className="container mx-auto px-4 py-16 bg-gradient-to-b from-emerald-50 to-white"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.3 }}
      >
        <motion.h2
          className="text-4xl md:text-5xl font-bold text-center text-gray-900 mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          Popular Recipes
        </motion.h2>
        <RecipeItems />
      </motion.div>
    </div>
  )
}