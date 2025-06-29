"use client";

import { useEffect, useState } from "react";
import { Star } from "lucide-react";
import useSWR from "swr";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { useSession } from "next-auth/react";
import { formatTimeAgo } from "@/lib/utils";
import LoadingSpinner from "./LoadingSpinner";
import { Button } from "./ui/button";
import clsx from "clsx";

interface Review {
  rating: number;
  text: string;
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());
export default function RatingComponent({ recipeId }: { recipeId?: number }) {
  const { data: session, status } = useSession();

  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    data: reviewData,
    isLoading: reviewLoading,
    mutate: mutateData,
  } = useSWR(`/api/reviewRecipe?recipeId=${recipeId}`, fetcher);

  useEffect(() => {
    const getReviewDetails = reviewData?.data?.find(
      (item: any) => Number(item.userId) === Number(session?.user?.id)
    );
    setReviewText(getReviewDetails?.reviewText);
    setRating(getReviewDetails?.rating);
    setHoverRating(getReviewDetails?.rating);
  }, [reviewData]);

  const handleStarClick = (index: number) => {
    setRating(index + 1);
  };

  const handleSubmit = async () => {
    if (rating === 0 || reviewText.trim() === "") return;
    try {
      setIsSubmitting(true);
      const response = await fetch("/api/reviewRecipe", {
        method: "POST",
        body: JSON.stringify({ recipeId, rating, reviewText }),
      });

      setReviews([{ rating, text: reviewText }, ...reviews]);
      setRating(0);
      setHoverRating(0);
      setReviewText("");
      await mutateData();
    } catch (error) {
    } finally {
      setIsSubmitting(false);
    }
  };

  const displayRating = hoverRating || rating;
  if (reviewLoading) return "Review Loading";
  return (
    <div
      className={clsx(
        "max-w-md mx-auto p-7 border rounded-xl shadow-md bg-white space-y-4",
        status === "unauthenticated" && "hidden"
      )}
    >
      <h2 className="text-xl font-semibold">Leave a Review</h2>

      {/* Star Rating */}
      <div className="flex items-center gap-1">
        {[0, 1, 2, 3, 4].map((index) => (
          <div
            key={index}
            className="cursor-pointer transition-transform hover:scale-110"
            onMouseEnter={() => setHoverRating(index + 1)}
            onMouseLeave={() => setHoverRating(0)}
            onClick={() => handleStarClick(index)}
          >
            <Star
              size={24}
              className={
                displayRating > index
                  ? "text-orange-400 stroke-orange-400"
                  : "text-gray-300 stroke-gray-300"
              }
              fill="currentColor"
            />
          </div>
        ))}
      </div>

      {/* Review Text */}
      <textarea
        className="w-full border rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
        placeholder="Write your review..."
        value={reviewText}
        onChange={(e) => setReviewText(e.target.value)}
        rows={4}
      />

      {/* Submit Button */}
      <Button
        onClick={handleSubmit}
        className="px-4 py-2 bg-orange-400 hover:bg-orange-500 text-white rounded-md font-medium"
        disabled={isSubmitting ? true : false}
      >
        {isSubmitting ? <LoadingSpinner /> : "Submit Review"}
      </Button>

      {/* Display Reviews */}
      <div className="space-y-3 pt-4">
        <h3 className="text-lg font-semibold">Reviews</h3>
        {reviewData.data.length === 0 ? (
          <p className="text-gray-500 text-sm">No reviews yet.</p>
        ) : (
          reviewData.data.map((r: any, i: any) => (
            <div key={i} className="border rounded-md p-3 shadow-sm">
              <div className="flex gap-3 ">
                <div className="flex items-center">
                  <Avatar className="w-9 h-9 ">
                    <AvatarImage
                      src={
                        session?.user?.image || "https://github.com/shadcn.png"
                      }
                      alt={session?.user?.name || "User"}
                    />
                    <AvatarFallback>U</AvatarFallback>
                  </Avatar>
                </div>
                <div className="grid grid-rows-2">
                  <p className="font-semibold">{session?.user?.name}</p>
                  <div className="flex items-center gap-1 mb-1">
                    {[...Array(r.rating)].map((_, idx) => (
                      <Star
                        key={idx}
                        size={16}
                        className="text-orange-400"
                        fill="currentColor"
                      />
                    ))}
                    {[...Array(5 - r.rating)].map((_, idx) => (
                      <Star
                        key={idx}
                        size={16}
                        className="text-gray-300"
                        fill="currentColor"
                      />
                    ))}
                  </div>
                </div>
              </div>
              <p className="text-sm text-gray-800">{r.reviewText}</p>
              <p className="text-xs text-gray-500 mt-2">
                {formatTimeAgo(r.createdAt)}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
