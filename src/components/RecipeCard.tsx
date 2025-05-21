"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { Open_Sans } from "next/font/google";

const opensans = Open_Sans({
  weight: ["400", "600", "700"],
  style: ["normal", "italic"],
  subsets: ["latin"],
});

export default function RecipeCard() {
  return (
    <motion.div
      className="bg-white h-fit overflow-hidden rounded-lg shadow-md"
      whileHover={{
        scale: 1.02,
        boxShadow:
          "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
      }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 20,
      }}
    >
      <div className="relative aspect-[3/2] h-auto">
        <Image
          src="/RecipesImages/Aambyachi_Kadhi.jpg"
          fill
          className="object-cover"
          alt="Aambyachi Kadhi"
        />
      </div>
      <div className="py-4 px-4">
        <h2
          className={`sm:text-sm md:text-lg ${opensans.className} font-semibold`}
        >
          Aambyachi Kadhi
        </h2>
      </div>
    </motion.div>
  );
}
