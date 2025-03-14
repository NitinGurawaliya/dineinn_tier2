"use client";

import type React from "react";
import { useInView } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { CardContent } from "@/components/ui/card";
import { Star, Share2, ArrowBigUpDashIcon } from "lucide-react";
import DishDetailsModal from "./DishDetailsModal";

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
}

const DishesCard: React.FC<DishCardProps> = ({
  id,
  name,
  price,
  image,
  description,
  categoryId,
  restaurantId,
  rating = 4.5,
  reviewCount = 24,
  isVeg = true,
  isNew = false,
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { margin: "-100px" });
  const [hasAnimated, setHasAnimated] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
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
    console.log("Shared dish:", id);
  };

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={`full-${i}`} className="w-4 h-4 fill-primary text-primary" />);
    }

    if (hasHalfStar) {
      stars.push(
        <div key="half" className="relative">
          <Star className="w-4 h-4 text-primary" />
          <div className="absolute top-0 left-0 overflow-hidden w-1/2">
            <Star className="w-4 h-4 fill-primary text-primary" />
          </div>
        </div>
      );
    }

    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<Star key={`empty-${i}`} className="w-4 h-4 text-muted-foreground" />);
    }

    return stars;
  };

  const words = description.split(" ");
  const truncatedDescription = words.slice(0, 8).join(" ");
  const shouldTruncate = words.length > 8;

  return (
    <>
      <div
        className="flex flex-row-reverse bg-white mt-0 rounded-lg h-full w-full cursor-pointer relative overflow-hidden"
        onClick={handleCardClick}
        ref={ref}
      >
        {/* Image on the Right */}
        <img
          src={image || "/placeholder.svg"}
          className="w-44 h-48 object-cover rounded-xl bg-white"
          alt={name}
        />

        {/* Text Section on the Left */}
        <CardContent className="bg-white flex-1">
          <div className="flex justify-between items-start">
            <h3 className="text-md font-bold tracking-wide">{name}</h3>
            {isNew && <div className="bg-red-500 text-white text-xs px-2 py-0.5 rounded">NEW</div>}
          </div>

          {/* Star rating */}
          <div className="flex items-center gap-1 mt-1 mb-2">
            {renderStars(rating)}
            <span className="text-xs text-muted-foreground ml-1">({reviewCount})</span>
          </div>

          {/* Description */}
          <div className="text-sm pt-2 mb-4 text-gray-700 text-muted-foreground">
            {isDescriptionExpanded ? description : truncatedDescription}
            {shouldTruncate && !isDescriptionExpanded && (
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

          {/* Price */}
          <span className="text-md font-semibold text-black">₹{price}</span>

          {/* Upvote and Share */}
          <div className="mt-3 flex gap-3">
            <button
              className="flex items-center justify-center border rounded-full p-1.5 hover:bg-gray-50"
              onClick={handleUpvote}
            >
              <ArrowBigUpDashIcon />
            </button>
            <button
              className="flex items-center justify-center border rounded-full p-1.5 hover:bg-gray-50"
              onClick={handleShare}
            >
              <Share2 />
            </button>
          </div>
        </CardContent>
      </div>

      <DishDetailsModal
        isOpen={isPopupOpen}
        onClose={handleClosePopup}
        dish={{ id, name, price, image, description, categoryId, restaurantId }}
      />
    </>
  );
};

export default DishesCard;
