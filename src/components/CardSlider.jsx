// components/CardSlider.jsx
"use client";

import { motion, AnimatePresence } from "motion/react";
import { useState } from "react";

const cardsData = [
  { id: 1, color: "#ff4d4d", text: "Card 1" },
  { id: 2, color: "#4d79ff", text: "Card 2" },
  { id: 3, color: "#4dff88", text: "Card 3" },
  { id: 4, color: "#ffc14d", text: "Card 4" },
  { id: 5, color: "#d94dff", text: "Card 5" },
];

export default function CardSlider() {
  const [cards, setCards] = useState(cardsData);

  const handleSwipe = (direction) => {
    // Remove first card and push it to the back
    setCards((prev) => {
      const updated = [...prev];
      const firstCard = updated.shift();
      updated.push(firstCard);
      return updated;
    });
  };

  return (
    <div className="relative w-[300px] h-[400px] mx-auto mt-20">
      <AnimatePresence>
        {cards.map((card, index) => {
          const isTop = index === 0;
          return (
            <motion.div
              key={card.id}
              drag={isTop ? "x" : false} // only top card draggable
              dragConstraints={{ left: 0, right: 0 }}
              onDragEnd={(e, info) => {
                if (info.offset.x > 100) handleSwipe("right");
                else if (info.offset.x < -100) handleSwipe("left");
              }}
              initial={{
                scale: 1 - index * 0.05,
                y: index * 10,
                zIndex: cards.length - index,
              }}
              animate={{
                scale: 1 - index * 0.05,
                y: index * 10,
                zIndex: cards.length - index,
              }}
              exit={{ opacity: 0, x: directionX(direction), rotate: 15 }}
              transition={{ duration: 0.3 }}
              className="absolute w-full h-full rounded-xl shadow-lg flex items-center justify-center text-white text-2xl font-bold"
              style={{ backgroundColor: card.color }}
            >
              {card.text}
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}

// Small helper for exit animation direction
function directionX(dir) {
  return dir === "right" ? 200 : -200;
}
