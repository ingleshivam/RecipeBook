"use client";

import type React from "react";
import { useState } from "react";
import { Star } from "lucide-react";

interface StarRatingProps {
  initialRating?: number;
  onRatingChange?: (rating: number) => void;
  size?: number;
  className?: string;
}

export default function RatingComponent({
  initialRating = 0,
  onRatingChange,
  size = 24,
  className = "",
}: StarRatingProps) {
  const [rating, setRating] = useState(initialRating);
  const [hoverRating, setHoverRating] = useState(0);

  const handleMouseEnter = (starIndex: number) => {
    setHoverRating(starIndex + 1);
  };

  const handleClick = (starIndex: number) => {
    const newRating = starIndex + 1;
    setRating(newRating);
    onRatingChange?.(newRating);
  };

  const handleMouseLeave = () => {
    setHoverRating(0);
  };

  const displayRating = hoverRating || rating;

  return (
    <div className={`flex flex-col items-center gap-2 ${className}`}>
      <div className="flex items-center gap-1">
        {[0, 1, 2, 3, 4].map((starIndex) => {
          const isFilled = displayRating > starIndex;

          return (
            <div
              key={starIndex}
              className="cursor-pointer transition-transform hover:scale-110"
              onMouseEnter={() => handleMouseEnter(starIndex)}
              onClick={() => handleClick(starIndex)}
              onMouseLeave={handleMouseLeave}
              style={{ width: size, height: size }}
            >
              <Star
                size={size}
                className={
                  isFilled
                    ? "text-yellow-400 stroke-yellow-400"
                    : "text-gray-300 stroke-gray-300"
                }
                fill="currentColor"
              />
            </div>
          );
        })}
      </div>

      <div className="text-sm font-medium text-gray-600">
        {displayRating > 0 ? `${displayRating} out of 5` : "No rating"}
      </div>
    </div>
  );
}
