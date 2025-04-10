"use client";

import React, { useEffect, useState } from "react";
import { Button } from "./ui/button";
import DishesCard from "./DishesCard";
import axios from "axios";
import { REQUEST_URL } from "@/config";
import { ChefHatIcon, Delete, DeleteIcon, Edit2, Loader2Icon, Trash2Icon } from "lucide-react";
import { AddDishDialog } from "./AddDishDialog";
import CategoryComponent from "./CategoryBar";
import { AddCategoryDialog } from "./AddCategoryDialog";
import DashboardDishesCard from "./dashboard-dish-card";

interface Category {
  id: number;
  name: string;
  restaurantId: number;
}

interface Dish {
  id: number;
  name: string;
  price: number;
  description:string,
  image: string;
  categoryId: number;
  type:string;
  restaurantId: number;
}

export default function EditMenu() {
  const [category, setCategory] = useState<Category[]>([]);
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [isDishModalOpen, setIsDishModalOpen] = useState(false);
  const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false)
  const[loading,setLoading] = useState(false)

  useEffect(() => {
    async function getData() {
      setLoading(true)
      try {
        const res = await axios.get(`/api/menu`, {
          withCredentials: true,
        });
        setCategory(res.data.categories || []);
        setDishes(res.data.dishes || []);
        setLoading(false)
      } catch (error) {
        console.error("Error fetching menu:", error);
      }
    }
    getData();
  }, []);



  

  const handleCategorySubmit = (category: { name: string }) => {
    // Handle the submitted category data here
    console.log("Submitted category:", category)
  }

  if(loading){
    return (
      <div className="flex  justify-center items-center my-40">
            <ChefHatIcon size={80} className="animate-spin flex text-gray-900" />
          </div>
    )
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <div className="flex border-gray-300 border-b p-2">
        <h2 className="text-3xl font-semibold mb-4">Edit Menu</h2>
        <Button onClick={() => setIsCategoryDialogOpen(true)} className="px-6 ml-10 text-lg py-3 bg-gray-900 text-white font-semibold rounded-lg shadow-md hover:bg-gray-700">
          Manage Category
        </Button>

        <Button
          onClick={()=>{setIsDishModalOpen(true)}}
          className="px-6 text-lg py-3 ml-4 bg-gray-800 text-white font-semibold rounded-lg shadow-lg hover:bg-gray-200 hover:text-black"
        >
          Add Dishes
        </Button>
      </div>

       {/* {category && <CategoryComponent  categories={category} />} */}

      <div className="grid grid-cols-1 bg-gray-100 p-4 md:grid-cols-2 lg:grid-cols-2 gap-4 mt-4">
        {dishes.map((dish: Dish) => (
          <div key={dish.id} className="relative">
            <DashboardDishesCard {...dish} />
            <button
              onClick={async () => {
                const confirmDelete = confirm(`Are you sure you want to delete ${dish.name} from your menu?`);
                
                if (confirmDelete) {
                  try {
                    await axios.delete(`/api/menu/dishes/${dish.id}`);
                    alert(`${dish.name} has been deleted successfully.`);
                    setDishes((prevDishes) => prevDishes.filter((d) => d.id !== dish.id)); 
                  } catch (error) {
                    console.error("Error deleting dish:", error);
                    alert("Failed to delete the dish. Please try again.");
                  }
                }
              }}
              className="absolute top-1 bg-red-600 right-1 p-2 rounded-full shadow-md hover:bg-red-700 text-white"
              >
              <Trash2Icon size={18} />
              </button>
          </div>
        ))}
      </div>

     
      <AddDishDialog isOpen={isDishModalOpen} onClose={()=>{setIsDishModalOpen(false)}} />

      <AddCategoryDialog
        isOpen={isCategoryDialogOpen}
        onClose={() => setIsCategoryDialogOpen(false)}
        onSubmit={handleCategorySubmit}
      />
    </div>
  );
}
