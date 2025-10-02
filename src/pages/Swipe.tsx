import { Navbar } from "@/components/Navbar";
import { SwipeCard } from "@/components/SwipeCard";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useAuth } from "@/hooks/use-auth";
import { useMutation, useQuery } from "convex/react";
import { motion } from "framer-motion";
import { Loader2, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";

export default function Swipe() {
  const { isLoading, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showSizeDialog, setShowSizeDialog] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);

  const items = useQuery(api.items.getSwipeItems, { limit: 20 });
  const recordSwipe = useMutation(api.items.recordSwipe);
  const addToCart = useMutation(api.cart.addToCart);
  const addToWishlist = useMutation(api.wishlist.addToWishlist);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate("/auth");
    }
  }, [isLoading, isAuthenticated, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!items || items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="bg-[#FF0080] border-4 border-black p-8 shadow-[8px_8px_0px_0px_#000000] inline-block rotate-2">
              <Sparkles className="h-16 w-16 mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">No more items!</h2>
              <p className="mb-4">Check back later for new arrivals</p>
              <Button
                onClick={() => navigate("/")}
                className="border-3 border-black bg-[#00FF80] hover:bg-[#00FF80]/90 font-bold shadow-[4px_4px_0px_0px_#000000]"
              >
                Go Home
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const currentItem = items[currentIndex];

  const handleSwipe = async (direction: "left" | "right") => {
    if (!currentItem) return;

    try {
      await recordSwipe({
        itemId: currentItem._id as Id<"items">,
        action: direction,
      });

      if (direction === "right") {
        await addToWishlist({ itemId: currentItem._id as Id<"items"> });
        toast.success("Added to wishlist! ❤️");
      }

      setCurrentIndex((prev) => prev + 1);
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  const handleAddToCart = () => {
    setSelectedItem(currentItem);
    setShowSizeDialog(true);
  };

  const handleSizeSelect = async (size: string) => {
    if (!selectedItem) return;

    try {
      await addToCart({
        itemId: selectedItem._id as Id<"items">,
        size,
        quantity: 1,
      });
      toast.success("Added to cart! 🛒");
      setShowSizeDialog(false);
      setSelectedItem(null);
      setCurrentIndex((prev) => prev + 1);
    } catch (error) {
      toast.error("Failed to add to cart");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FFE5F0]">
      <Navbar />

      <div className="flex-1 flex items-center justify-center p-4">
        <div className="relative w-full max-w-sm h-[600px]">
          {currentItem && (
            <motion.div
              key={currentItem._id}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <SwipeCard
                item={currentItem}
                onSwipe={handleSwipe}
                onAddToCart={handleAddToCart}
              />
            </motion.div>
          )}
        </div>
      </div>

      {/* Size Selection Dialog */}
      <Dialog open={showSizeDialog} onOpenChange={setShowSizeDialog}>
        <DialogContent className="border-4 border-black shadow-[8px_8px_0px_0px_#000000]">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">Select Size</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-3 gap-3 mt-4">
            {selectedItem?.sizes.map((size: string) => (
              <Button
                key={size}
                onClick={() => handleSizeSelect(size)}
                className="border-3 border-black bg-[#00FF80] hover:bg-[#00FF80]/90 font-bold shadow-[4px_4px_0px_0px_#000000] hover:shadow-[2px_2px_0px_0px_#000000] transition-all"
              >
                {size}
              </Button>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
