import { motion, useMotionValue, useTransform } from "framer-motion";
import { Heart, ShoppingCart, X, ChevronUp } from "lucide-react";
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
  onSwipeUp: () => void;
  onAddToCart: () => void;
  onTap: () => void;
}

export function SwipeCard({ item, onSwipe, onSwipeUp, onAddToCart, onTap }: SwipeCardProps) {
  const [exitX, setExitX] = useState(0);
  const [exitY, setExitY] = useState(0);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-25, 25]);
  const opacity = useTransform(x, [-200, 0, 200], [0, 1, 0]);

  // Visual feedback transforms
  const likeOpacity = useTransform(x, [0, 100], [0, 1]);
  const nopeOpacity = useTransform(x, [-100, 0], [1, 0]);
  const similarOpacity = useTransform(y, [-100, 0], [1, 0]);

  const handleDragEnd = (_: any, info: any) => {
    const { offset } = info;
    
    // Check for swipe up first (vertical movement)
    if (offset.y < -100 && Math.abs(offset.x) < 50) {
      setExitY(-300);
      onSwipeUp();
      return;
    }
    
    // Then check for horizontal swipes
    if (Math.abs(offset.x) > 100) {
      setExitX(offset.x > 0 ? 300 : -300);
      onSwipe(offset.x > 0 ? "right" : "left");
    }
  };

  const handleClick = (e: React.MouseEvent) => {
    // Only trigger tap if not clicking on buttons
    if ((e.target as HTMLElement).closest('button')) {
      return;
    }
    onTap();
  };

  return (
    <motion.div
      style={{
        x,
        y,
        rotate,
        opacity,
      }}
      drag
      dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
      onDragEnd={handleDragEnd}
      animate={{ x: exitX, y: exitY }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="absolute w-full max-w-sm cursor-grab active:cursor-grabbing"
      onClick={handleClick}
    >
      <div className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_#000000] overflow-hidden relative">
        {/* LIKE Overlay */}
        <motion.div
          style={{ opacity: likeOpacity }}
          className="absolute inset-0 z-20 flex items-center justify-center bg-[#00FF80]/20 pointer-events-none"
        >
          <div className="bg-[#00FF80] border-4 border-black px-8 py-4 rotate-12 shadow-[8px_8px_0px_0px_#000000]">
            <div className="flex items-center gap-3">
              <Heart className="h-12 w-12 text-red-600 fill-red-600" />
              <span className="text-4xl font-bold text-black">LIKE!</span>
            </div>
          </div>
        </motion.div>

        {/* NOPE Overlay */}
        <motion.div
          style={{ opacity: nopeOpacity }}
          className="absolute inset-0 z-20 flex items-center justify-center bg-red-500/20 pointer-events-none"
        >
          <div className="bg-red-500 border-4 border-black px-8 py-4 -rotate-12 shadow-[8px_8px_0px_0px_#000000]">
            <div className="flex items-center gap-3">
              <X className="h-12 w-12 text-white" />
              <span className="text-4xl font-bold text-white">NOPE!</span>
            </div>
          </div>
        </motion.div>

        {/* SIMILAR Overlay */}
        <motion.div
          style={{ opacity: similarOpacity }}
          className="absolute inset-0 z-20 flex items-center justify-center bg-[#0080FF]/20 pointer-events-none"
        >
          <div className="bg-[#0080FF] border-4 border-black px-8 py-4 shadow-[8px_8px_0px_0px_#000000]">
            <div className="flex items-center gap-3">
              <ChevronUp className="h-12 w-12 text-white" />
              <span className="text-4xl font-bold text-white">SIMILAR!</span>
            </div>
          </div>
        </motion.div>

        {/* Swipe Up Indicator */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 bg-[#0080FF] border-3 border-black px-4 py-2 shadow-[4px_4px_0px_0px_#000000] animate-bounce">
          <div className="flex items-center gap-2">
            <ChevronUp className="h-5 w-5 text-white font-bold" />
            <span className="text-white font-bold text-sm">SWIPE UP</span>
          </div>
        </div>

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

          {/* Swipe Instructions */}
          <div className="mb-4 p-3 bg-[#FFE5F0] border-3 border-black">
            <p className="text-xs font-bold text-center">
              ← SWIPE LEFT to skip | SWIPE RIGHT to like →
            </p>
            <p className="text-xs font-bold text-center mt-1">
              ↑ SWIPE UP for similar | TAP for details
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button
              onClick={() => onSwipe("left")}
              variant="outline"
              size="lg"
              className="flex-1 border-4 border-black bg-white hover:bg-red-100 shadow-[4px_4px_0px_0px_#000000] hover:shadow-[2px_2px_0px_0px_#000000] transition-all"
            >
              <X className="h-6 w-6 text-red-600" />
            </Button>
            <Button
              onClick={onAddToCart}
              size="lg"
              className="flex-1 border-4 border-black bg-[#FF0080] hover:bg-[#FF0080]/90 text-white shadow-[4px_4px_0px_0px_#000000] hover:shadow-[2px_2px_0px_0px_#000000] transition-all font-bold"
            >
              <ShoppingCart className="h-5 w-5 mr-2" />
              CART
            </Button>
            <Button
              onClick={() => onSwipe("right")}
              variant="outline"
              size="lg"
              className="flex-1 border-4 border-black bg-[#00FF80] hover:bg-[#00FF80]/90 shadow-[4px_4px_0px_0px_#000000] hover:shadow-[2px_2px_0px_0px_#000000] transition-all"
            >
              <Heart className="h-6 w-6 text-red-600 fill-red-600" />
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}