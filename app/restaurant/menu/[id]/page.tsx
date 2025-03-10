"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import CategoryComponent from "@/components/CategoryBar"
import DishesCard from "@/components/DishesCard"
import axios from "axios"
import HamburgerMenu from "@/components/HambergerMenu"
import { Button } from "@/components/ui/button"
import { ArrowBigDown, ChefHatIcon, PencilIcon, Search } from "lucide-react"
import Link from "next/link"
import { REQUEST_URL } from "@/config"

interface RestaurantDetails {
  restaurantName: string
  weekdaysWorking: string
  weekendWorking: string
  location: string
  contactNumber: string
  logo: string
}

interface Category {
  id: number
  name: string
  restaurantId: number
}

interface Dish {
  id: number
  name: string
  description: string
  price: number
  image: string
  categoryId: number
  restaurantId: number
}

export default function RestaurantMenuPage() {
  const params = useParams()
  const { id } = params

  const [categories, setCategories] = useState<Category[]>([])
  const [dishes, setDishes] = useState<Dish[]>([])
  const [filteredDishes, setFilteredDishes] = useState<Dish[]>([])
  const [logo, setLogo] = useState("")
  const [restaurantData, setRestaurantData] = useState<RestaurantDetails | null>(null)
  const [loading, setLoading] = useState(false)
  // Inside your component
  const [showScrollText, setShowScrollText] = useState(true)
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value.toLowerCase();
    setSearchQuery(query);
  
    const filtered = dishes.filter((dish) =>
      dish.name.toLowerCase().includes(query)
    );
    setFilteredDishes(filtered);
  };
  
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollText(false)
    }

    window.addEventListener("scroll", handleScroll)

    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  useEffect(() => {
    const fetchMenuData = async () => {
      setLoading(true)
      try {
        const res = await axios.get(`${REQUEST_URL}/api/menu/${id}`)
        const menuData = res.data

        setRestaurantData(menuData)
        setLogo(menuData.logo)
        setCategories(menuData.categories)
        setDishes(menuData.dishes)
        setFilteredDishes(menuData.dishes)
      } catch (error) {
        console.error("Error fetching menu data:", error)
      } finally {
        setLoading(false)
      }
    }

    if (id) fetchMenuData() // Ensure `id` is available before making API call
  }, [id])

  const handleCategorySelect = (categoryId: number) => {
    const filtered = dishes.filter((dish) => dish.categoryId === categoryId)
    setFilteredDishes(filtered)
  }

  return (
    <div className="bg-white">
      <div className="flex justify-between w-full bg-stone-500 items-center mt-0 p-2 mb-0">
        <HamburgerMenu
          restaurantName={restaurantData?.restaurantName ?? "Loading..."}
          weekdaysWorking={restaurantData?.weekdaysWorking ?? ""}
          weekendWorking={restaurantData?.weekendWorking ?? ""}
          contactNumber={restaurantData?.contactNumber ?? ""}
        />

        <Link href={`https://dineinn-tier2-iota.vercel.app/restaurant/menu/${id}/feedback`}>
          <Button className="rounded-2xl  flex items-center gap-2 px-4 ">
            <PencilIcon size={18} />
            <span>Feedback</span>
          </Button>
        </Link>
      </div>

      <div className="flex w-full h-14  bg-center rounded-lg items-center px-4">
        <Search className="text-black mr-2 h-12" />
        <input
  className="w-full text-black h-14 bg-white focus:outline-none px-2"
  placeholder="Search dishes..."
  value={searchQuery}
  onChange={handleSearch}
/>

      </div>

      <div className="flex w-full h-40 bg-[url('https://res.cloudinary.com/dixjcb4on/image/upload/v1739046120/dishes_image/res%20image.jpg')] bg-cover bg-center  items-center"></div>

      {loading ? (
        <div className="flex  justify-center items-center my-40">
          <ChefHatIcon size={80} className="animate-spin flex text-gray-900" />
        </div>
      ) : (
        <>
          <CategoryComponent categories={categories} onCategorySelect={handleCategorySelect} />
          <div className="grid grid-cols-1  bg-white md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
            {filteredDishes.map((dish) => (
              <div key={dish.id} className="relative pb-4">
                <DishesCard
                  id={dish.id}
                  name={dish.name}
                  description={dish.description}
                  price={dish.price}
                  image={dish.image}
                  categoryId={dish.categoryId}
                  restaurantId={dish.restaurantId}
                />
                {/* Dotted Line */}
                <div className="w-[calc(100%-44px)] mx-auto border-t-2 border-dotted border-gray-300 mt-4"></div>
              </div>
            ))}
          </div>
        </>
      )}
      {showScrollText && (
        <div className="fixed bottom-2 transform -translate-x-1/2 flex items-center ml-40 justify-center font-semibold text-lg text-black opacity-80 animate-bounce">
          <ArrowBigDown />
          Scroll Here
        </div>
      )}
    </div>
  )
}

