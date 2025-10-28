import React, { useState } from 'react'
import { useLoaderData } from 'react-router'
import { Clock, Edit, Trash2, Heart } from 'lucide-react'

export const RecipeItems = () => {
  const recipes = useLoaderData()


  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          My Recipes
        </h1>
        <p className="text-gray-600">
          {recipes.length} {recipes.length === 1 ? 'recipe' : 'recipes'} found
        </p>
      </div>

      {/* Recipe Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {recipes?.map((item, index) => {

          return (
            <div
              key={item.id || index}
              className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group"
            >
              {/* Card Image */}
              <div className="relative h-48 bg-gradient-to-br from-orange-400 to-orange-600 overflow-hidden">
                {item.image ? (
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <svg
                      className="w-20 h-20 text-white opacity-50"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                      />
                    </svg>
                  </div>
                )}

                {/* Favorite Button */}
                <button
                  className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-lg hover:scale-110 transition-transform"
                  aria-label="Add to favorites"
                >
                  <Heart
                    className={`w-5 h-5 
                         text-gray-400'
                    }`}
                  />
                </button>
              </div>

              {/* Card Content */}
              <div className="p-5">
                {/* Title */}
                <h3 className="text-xl font-semibold text-gray-800 mb-3 line-clamp-2 group-hover:text-orange-500 transition-colors">
                  {item.title}
                </h3>

                {/* Meta Info */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2 text-gray-600">
                    <Clock className="w-4 h-4 text-orange-500" />
                    <span className="text-sm font-medium">{item.time}</span>
                  </div>

                  {item.difficulty && (
                    <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                      item.difficulty === 'Easy'
                        ? 'bg-green-100 text-green-700'
                        : item.difficulty === 'Medium'
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-red-100 text-red-700'
                    }`}>
                      {item.difficulty}
                    </span>
                  )}
                </div>

                {/* Description */}
                {item.description && (
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                    {item.description}
                  </p>
                )}

                {/* Action Buttons */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <button

                    className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                    <span>Edit</span>
                  </button>

                  <button

                    className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Empty State */}
      {recipes.length === 0 && (
        <div className="text-center py-20">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-6">
            <svg
              className="w-10 h-10 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            No Recipes Yet
          </h3>
          <p className="text-gray-600 mb-6">
            Start adding your favorite recipes to see them here!
          </p>
          <button className="px-6 py-3 bg-orange-500 text-white font-medium rounded-lg hover:bg-orange-600 transition-colors">
            Add Your First Recipe
          </button>
        </div>
      )}
    </div>
  )
}