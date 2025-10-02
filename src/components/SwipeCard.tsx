import { motion, useMotionValue, useTransform } from "framer-motion";
import { Heart, ShoppingCart, X } from "lucide-react";
import { useState } from "react";
import { Button } from "./ui/button";

interface SwipeCardProps {
  item: {
    _id: string;
    name: string;
    type: string;
    color: string;
    imageUrl: string;
    price: number;
    brand?: string;
    description?: string;
  };
  onSwipe: (direction: "left" | "right") => void;
  onAddToCart: () => void;
}

export function SwipeCard({ item, onSwipe, onAddToCart }: SwipeCardProps) {
  const [exitX, setExitX] = useState(0);
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-25, 25]);
  const opacity = useTransform(x, [-200, -100, 0, 100, 200], [0, 1, 1, 1, 0]);

  const handleDragEnd = (_: any, info: any) => {
    if (Math.abs(info.offset.x) > 100) {
      setExitX(info.offset.x > 0 ? 300 : -300);
      onSwipe(info.offset.x > 0 ? "right" : "left");
    }
  };

  return (
    <motion.div
      style={{
        x,
        rotate,
        opacity,
      }}
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      onDragEnd={handleDragEnd}
      animate={{ x: exitX }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="absolute w-full max-w-sm cursor-grab active:cursor-grabbing"
    >
      <div className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_#000000] overflow-hidden">
        {/* Image */}
        <div className="relative h-96 bg-[#FF0080] overflow-hidden">
          <img
            src={item.imageUrl}
            alt={item.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute top-4 right-4 bg-[#00FF80] border-3 border-black px-3 py-1 rotate-3 shadow-[4px_4px_0px_0px_#000000]">
            <span className="font-bold text-black">${item.price}</span>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 bg-white">
          <div className="mb-2">
            {item.brand && (
              <span className="inline-block bg-[#0080FF] text-white px-3 py-1 text-xs font-bold border-2 border-black -rotate-1">
                {item.brand}
              </span>
            )}
          </div>
          <h3 className="text-2xl font-bold mb-2 tracking-tight">{item.name}</h3>
          <p className="text-sm mb-4">{item.description}</p>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button
              onClick={() => onSwipe("left")}
              variant="outline"
              size="lg"
              className="flex-1 border-4 border-black bg-white hover:bg-gray-100 shadow-[4px_4px_0px_0px_#000000] hover:shadow-[2px_2px_0px_0px_#000000] transition-all"
            >
              <X className="h-6 w-6" />
            </Button>
            <Button
              onClick={onAddToCart}
              size="lg"
              className="flex-1 border-4 border-black bg-[#FF0080] hover:bg-[#FF0080]/90 text-white shadow-[4px_4px_0px_0px_#000000] hover:shadow-[2px_2px_0px_0px_#000000] transition-all"
            >
              <ShoppingCart className="h-5 w-5 mr-2" />
              Add to Cart
            </Button>
            <Button
              onClick={() => onSwipe("right")}
              variant="outline"
              size="lg"
              className="flex-1 border-4 border-black bg-[#00FF80] hover:bg-[#00FF80]/90 shadow-[4px_4px_0px_0px_#000000] hover:shadow-[2px_2px_0px_0px_#000000] transition-all"
            >
              <Heart className="h-6 w-6" />
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
