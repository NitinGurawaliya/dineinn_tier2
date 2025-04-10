
export const dynamic = 'force-dynamic'; // Ensures the page is always dynamically rendered

import CategoryComponent from "@/components/CategoryBar";
import DishesCard from "@/components/DishesCard";
import { REQUEST_URL } from "@/config";
import axios from "axios";
import { cookies } from "next/headers";

interface Category {
    id: number;
    name: string;
    restaurantId: number;
}

interface Dish {
    id: number;
    name: string;
    price: number;
    image: string;
    description:string
    categoryId: number;
    type:string;
    restaurantId: number;
}

interface MenuData {
    restaurantName: string;
    logo: string;
    categories: Category[];
    dishes: Dish[];
}

export default async function MenuPage() {
    let menuData: MenuData | null = null;

    try {
        const cookieHeader = cookies().toString();

        const res = await axios.get(`/api/menu`, {
            headers: {
              Cookie: cookieHeader, 
            },
            withCredentials: true,
          });

        const data = res.data;
        menuData = data; 

        console.log(menuData?.restaurantName); // "solan dhaba"
        console.log(menuData?.dishes); // Array of dish objects

    } catch (error) {
        console.error("Error fetching menu data:", error);
    }


    
    return (
        <div className="p-4">
            {/* Restaurant Name & Logo */}
            
            <div className="flex flex-col items-center mb-6">
                <img src={menuData?.logo} className="w-24 h-24 sm:w-40 sm:h-40 md:w-48 md:h-48 lg:w-56 lg:h-56 bg-gray-300 "></img>
             </div>
             <h1 className="text-2xl text-center font-bold">{menuData?.restaurantName}</h1>

             {/* {menuData?.categories && <CategoryComponent  categories={menuData.categories} />} */}

            {/* Dishes List */}
            <div className="grid grid-cols-1  md:grid-cols-2 lg:grid-cols-3 gap-4">
                {menuData?.dishes.map((dish) => (
                    <DishesCard
                    key={dish.id}
                    id={dish.id}
                    type={dish.type}
                    name={dish.name}
                    price={dish.price}
                    image={dish.image}
                    description={dish.description}
                    categoryId={dish.categoryId}
                    restaurantId={dish.restaurantId}
                />
                
                ))}
            </div>
        </div>
    );
}