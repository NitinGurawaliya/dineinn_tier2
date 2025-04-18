"use client"

import type React from "react"
import { AnimatePresence, motion } from "framer-motion"
import { X } from "lucide-react"
import { useEffect } from "react"
import axios from "axios"

interface DishDetailsModalProps {
  dish: {
    id: number
    name: string
    price: number
    image: string
    description: string
    categoryId: number
    restaurantId: number
    nutrition?: {
      calories?: number
      protein?: number
      carbs?: number
      fat?: number
    }
  }
  isOpen: boolean
  onClose: () => void
}

const DishDetailsModal: React.FC<DishDetailsModalProps> = ({ dish, isOpen, onClose }) => {

  useEffect(() => {
    if (!isOpen || !dish?.id) return; // Ensure modal is open and dish ID is valid
  
    console.log("popup opened, incrementing view count for dish ID:", dish.id);
  
    async function incrementView() {
      try {
        const res = await axios.post(`/api/menu/analytics/dish/${dish.id}`);
        console.log("This dish is viewed times ", res.data.dishView.id);
      } catch (error) {
        console.error("Error recording dish view:", error);
      }
    }
  
    incrementView();
  }, [isOpen, dish?.id]); // Run only when `isOpen` changes
  
  
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-end z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="bg-white pt-6 shadow-xl rounded-t-3xl w-full max-w-lg relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 bg-black/10 hover:bg-black/20 transition-colors p-1.5 rounded-full"
              aria-label="Close"
            >
              <X size={18} className="text-gray-700" />
            </button>

            {/* Image Container */}
            <div className="w-full h-[250px] px-6 mb-4">
              <motion.div
                className="w-full h-full rounded-xl overflow-hidden bg-gray-100 flex items-center justify-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <motion.img
                  src={dish.image || "/placeholder.svg"}
                  className="w-full h-full object-cover"
                  alt={dish.name}
                  initial={{ scale: 1.1 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                />
              </motion.div>
            </div>

            {/* Dish Info */}
            <motion.div
              className="px-6 pb-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-xl font-bold text-gray-900">{dish.name}</h3>
                <div className="text-lg font-bold text-black">₹{dish.price}</div>
              </div>

              <p className="text-gray-600 line-clamp-2  mb-4">{dish.description}</p>

              {/* Nutritional Information */}
             
  <div className="mt-6">
   <div className="flex flex-wrap gap-2">
      <div className="px-3 py-1 bg-amber-50 border border-amber-200 rounded-full text-xs font-medium text-amber-700">
        500 calories
      </div>
      <div className="px-3 py-1 bg-emerald-50 border border-emerald-200 rounded-full text-xs font-medium text-emerald-700">
        20g protein
      </div>
      <div className="px-3 py-1 bg-blue-50 border border-blue-200 rounded-full text-xs font-medium text-blue-700">
        60g carbs
      </div>
      <div className="px-3 py-1 bg-purple-50 border border-purple-200 rounded-full text-xs font-medium text-purple-700">
        10g fat
      </div>
    </div>
  </div>


            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default DishDetailsModal

