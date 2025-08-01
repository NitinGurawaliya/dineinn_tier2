"use client";

import type React from "react";
import { useInView } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { CardContent } from "@/components/ui/card";
import { Star, Share2, ArrowBigUpDashIcon } from "lucide-react";
import DishDetailsModal from "./DishDetailsModal";
import { NonVegLabel, VegLabel } from "./Foodlabel";
import { Button } from "./ui/button";
import { EditDishDialog } from "./EditDishDialog";

interface DishCardProps {
  id: number;
  name: string;
  price: number;
  image: string;
  description: string;
  categoryId: number;
  restaurantId: number;
  rating?: number;
  reviewCount?: number;
  isVeg?: boolean;
  isNew?: boolean;
  type:string
}

const DashboardDishesCard: React.FC<DishCardProps> = ({
  id,
  name,
  price,
  image,
  description,
  type,
  
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { margin: "-100px" });
  const [hasAnimated, setHasAnimated] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);

  useEffect(() => {
    if (isInView && !hasAnimated) {
      setHasAnimated(true);
    }
  }, [isInView, hasAnimated]);

  const handleCardClick = () => {
    setIsPopupOpen(true);
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false);
  };

  const handleReadMoreClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsDescriptionExpanded(!isDescriptionExpanded);
  };

  const handleUpvote = (e: React.MouseEvent) => {
    e.stopPropagation();
    console.log("Upvoted dish:", id);
  };

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();

    const message = `Check out amazing  ${name} at our restaurant! \n\nTry it now!`;
    const encodedMessage = encodeURIComponent(message);

    const whatsappUrl = `https://wa.me/?text=${encodedMessage}`;

    window.open(whatsappUrl, "_blank");
  };

  return (
    <div className="pt-0">
      <div className="ml-2 md:ml-6 mb-2">{type ==="VEG" ? <VegLabel /> : <NonVegLabel />}</div>
      <div
        className="flex flex-col md:flex-row-reverse bg-white mt-0 rounded-lg h-full w-full cursor-pointer relative overflow-hidden"
        onClick={handleCardClick}
        ref={ref}
      >
        <img
          src={image || "/placeholder.svg"}
          className="w-full h-44 md:w-44 md:h-48 object-cover rounded-xl bg-white"
          alt={name}
        />

        <CardContent className="bg-white flex-1 p-2 md:p-4">
          <div className="flex justify-between items-start">
            <h3 className="text-md font-bold tracking-wide">{name}</h3>
          </div>

          <div className="text-sm pt-2 mb-4 text-gray-700 text-muted-foreground">
            {isDescriptionExpanded ? description : description.split(" ").slice(0, 8).join(" ")}
            {description.split(" ").length > 8 && !isDescriptionExpanded && (
              <button className="text-primary font-medium ml-1" onClick={handleReadMoreClick}>
                <div className="font-bold text-gray-800">... read more</div>
              </button>
            )}
            {isDescriptionExpanded && (
              <button className="text-primary font-medium ml-1" onClick={handleReadMoreClick}>
                <div className="font-bold text-gray-800">... show less</div>
              </button>
            )}
          </div>

          <div className="mt-8 text-center flex gap-6">
            <span className="text-md font-bold text-black">₹{price}</span>
            <Button onClick={(e)=>{
                  e.stopPropagation(); 
                  setIsEditOpen(true);
            }} className="p-2 md:p-4 bg-white text-black border-gray-500 md:ml-4 border-2 hover:bg-black hover:text-white text-xs md:text-base" >Edit details</Button>
          </div>
        </CardContent>
      </div>

      {/* <DishDetailsModal
        isOpen={isPopupOpen}
        onClose={handleClosePopup}
        dish={{ id, name, price, image, description, categoryId, restaurantId }}
      /> */}
      <EditDishDialog
  isOpen={isEditOpen}
  onClose={() => setIsEditOpen(false)}
  dish={{
    id,
    name,
    description,
    price,
    type: type === "VEG" ? "VEG" : "NON_VEG",
  }}
  refreshDishes={() => {}}
/>

    </div>
  );
};

export default DashboardDishesCard;