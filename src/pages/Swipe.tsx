import { Navbar } from "@/components/Navbar";
import { SwipeCard } from "@/components/SwipeCard";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useAuth } from "@/hooks/use-auth";
import { useMutation, useQuery } from "convex/react";
import { motion } from "framer-motion";
import { Loader2, Sparkles, Heart, ShoppingCart, Plus, Minus } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";

export default function Swipe() {
  const { isLoading, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showSizeDialog, setShowSizeDialog] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [showRecommendations, setShowRecommendations] = useState(false);
  const [showSimilarItems, setShowSimilarItems] = useState(false);
  const [showDetailView, setShowDetailView] = useState(false);
  const [detailItem, setDetailItem] = useState<any>(null);
  const [detailQuantity, setDetailQuantity] = useState(1);
  const [detailSize, setDetailSize] = useState("");

  const items = useQuery(api.items.getSwipeItems, { limit: 20 });
  const recordSwipe = useMutation(api.items.recordSwipe);
  const addToCart = useMutation(api.cart.addToCart);
  const addToWishlist = useMutation(api.wishlist.addToWishlist);

  const currentItem = items?.[currentIndex];
  const recommendations = useQuery(
    api.items.getRecommendations,
    currentItem && showRecommendations ? { itemId: currentItem._id as Id<"items">, limit: 5 } : "skip"
  );
  const similarItems = useQuery(
    api.items.getSimilarItems,
    currentItem && showSimilarItems ? { itemId: currentItem._id as Id<"items">, limit: 10 } : "skip"
  );

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

  const handleSwipe = async (direction: "left" | "right") => {
    if (!currentItem) return;

    try {
      await recordSwipe({
        itemId: currentItem._id as Id<"items">,
        action: direction,
      });

      if (direction === "right") {
        await addToWishlist({ itemId: currentItem._id as Id<"items"> });
        toast.success("Added to wishlist! Check out these matches! 🎯");
        setShowRecommendations(true);
      } else {
        setCurrentIndex((prev) => prev + 1);
      }
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  const handleSwipeUp = () => {
    toast.success("Here are similar items! 👕");
    setShowSimilarItems(true);
  };

  const handleAddToCart = () => {
    setSelectedItem(currentItem);
    setShowSizeDialog(true);
  };

  const handleTap = () => {
    setDetailItem(currentItem);
    setDetailSize(currentItem?.sizes?.[0] || "");
    setDetailQuantity(1);
    setShowDetailView(true);
    toast.success("Item details loaded! 🔍");
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

  const handleRecommendationAction = async (itemId: string, action: "cart" | "wishlist") => {
    try {
      if (action === "wishlist") {
        await addToWishlist({ itemId: itemId as Id<"items"> });
        toast.success("Added to wishlist! ❤️");
      }
    } catch (error) {
      toast.error("Failed to add item");
    }
  };

  const handleDetailAddToCart = async () => {
    if (!detailItem || !detailSize) return;

    try {
      await addToCart({
        itemId: detailItem._id as Id<"items">,
        size: detailSize,
        quantity: detailQuantity,
      });
      toast.success("Added to cart! 🛒");
      setShowDetailView(false);
      setCurrentIndex((prev) => prev + 1);
    } catch (error) {
      toast.error("Failed to add to cart");
    }
  };

  const handleDetailAddToWishlist = async () => {
    if (!detailItem) return;

    try {
      await addToWishlist({ itemId: detailItem._id as Id<"items"> });
      toast.success("Added to wishlist! ❤️");
      setShowDetailView(false);
    } catch (error) {
      toast.error("Failed to add to wishlist");
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
                onSwipeUp={handleSwipeUp}
                onAddToCart={handleAddToCart}
                onTap={handleTap}
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

      {/* Recommendations Dialog */}
      <Dialog open={showRecommendations} onOpenChange={setShowRecommendations}>
        <DialogContent className="border-4 border-black shadow-[8px_8px_0px_0px_#000000] max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-3xl font-bold">Perfect Match! 🎯</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4 mt-4">
            {recommendations?.map((item: any) => (
              <motion.div
                key={item._id}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="border-3 border-black bg-white shadow-[4px_4px_0px_0px_#000000] overflow-hidden"
              >
                <img src={item.imageUrl} alt={item.name} className="w-full h-40 object-cover" />
                <div className="p-3">
                  <h4 className="font-bold text-sm mb-1">{item.name}</h4>
                  <p className="text-lg font-bold text-[#FF0080] mb-2">${item.price}</p>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={() => handleRecommendationAction(item._id, "wishlist")}
                      className="flex-1 border-2 border-black bg-[#00FF80] hover:bg-[#00FF80]/90 shadow-[2px_2px_0px_0px_#000000]"
                    >
                      <Heart className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          <Button
            onClick={() => {
              setShowRecommendations(false);
              setCurrentIndex((prev) => prev + 1);
            }}
            className="w-full mt-4 border-3 border-black bg-[#0080FF] hover:bg-[#0080FF]/90 text-white font-bold shadow-[4px_4px_0px_0px_#000000]"
          >
            Continue Swiping
          </Button>
        </DialogContent>
      </Dialog>

      {/* Similar Items Dialog */}
      <Dialog open={showSimilarItems} onOpenChange={setShowSimilarItems}>
        <DialogContent className="border-4 border-black shadow-[8px_8px_0px_0px_#000000] max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-3xl font-bold">Similar Styles 👕</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4 mt-4">
            {similarItems?.map((item: any) => (
              <motion.div
                key={item._id}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="border-3 border-black bg-white shadow-[4px_4px_0px_0px_#000000] overflow-hidden cursor-pointer hover:shadow-[6px_6px_0px_0px_#000000] transition-all"
                onClick={() => {
                  setDetailItem(item);
                  setDetailSize(item.sizes?.[0] || "");
                  setDetailQuantity(1);
                  setShowSimilarItems(false);
                  setShowDetailView(true);
                }}
              >
                <img src={item.imageUrl} alt={item.name} className="w-full h-40 object-cover" />
                <div className="p-3">
                  <h4 className="font-bold text-sm mb-1">{item.name}</h4>
                  <p className="text-lg font-bold text-[#FF0080]">${item.price}</p>
                </div>
              </motion.div>
            ))}
          </div>
          <Button
            onClick={() => setShowSimilarItems(false)}
            className="w-full mt-4 border-3 border-black bg-[#0080FF] hover:bg-[#0080FF]/90 text-white font-bold shadow-[4px_4px_0px_0px_#000000]"
          >
            Back to Swiping
          </Button>
        </DialogContent>
      </Dialog>

      {/* Detail View Dialog */}
      <Dialog open={showDetailView} onOpenChange={setShowDetailView}>
        <DialogContent className="border-4 border-black shadow-[8px_8px_0px_0px_#000000] max-w-2xl max-h-[90vh] overflow-y-auto">
          {detailItem && (
            <>
              <img
                src={detailItem.imageUrl}
                alt={detailItem.name}
                className="w-full h-64 object-cover border-b-4 border-black"
              />
              <div className="p-6">
                <div className="mb-3">
                  {detailItem.brand && (
                    <span className="inline-block bg-[#0080FF] text-white px-3 py-1 text-sm font-bold border-2 border-black -rotate-1">
                      {detailItem.brand}
                    </span>
                  )}
                </div>
                <h2 className="text-3xl font-bold mb-2">{detailItem.name}</h2>
                <p className="text-4xl font-bold text-[#FF0080] mb-4">${detailItem.price}</p>
                <p className="text-base mb-6">{detailItem.description}</p>

                {/* Size Selector */}
                <div className="mb-4">
                  <label className="block font-bold mb-2">Select Size:</label>
                  <div className="grid grid-cols-4 gap-2">
                    {detailItem.sizes?.map((size: string) => (
                      <Button
                        key={size}
                        onClick={() => setDetailSize(size)}
                        variant={detailSize === size ? "default" : "outline"}
                        className={`border-3 border-black font-bold shadow-[2px_2px_0px_0px_#000000] ${
                          detailSize === size
                            ? "bg-[#FF0080] text-white"
                            : "bg-white hover:bg-gray-100"
                        }`}
                      >
                        {size}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Quantity Selector */}
                <div className="mb-6">
                  <label className="block font-bold mb-2">Quantity:</label>
                  <div className="flex items-center gap-3">
                    <Button
                      onClick={() => setDetailQuantity(Math.max(1, detailQuantity - 1))}
                      className="border-3 border-black bg-white hover:bg-gray-100 shadow-[2px_2px_0px_0px_#000000]"
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="text-2xl font-bold w-12 text-center">{detailQuantity}</span>
                    <Button
                      onClick={() => setDetailQuantity(detailQuantity + 1)}
                      className="border-3 border-black bg-white hover:bg-gray-100 shadow-[2px_2px_0px_0px_#000000]"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <Button
                    onClick={handleDetailAddToCart}
                    disabled={!detailSize}
                    className="flex-1 border-4 border-black bg-[#FF0080] hover:bg-[#FF0080]/90 text-white font-bold shadow-[4px_4px_0px_0px_#000000] hover:shadow-[2px_2px_0px_0px_#000000] transition-all"
                  >
                    <ShoppingCart className="h-5 w-5 mr-2" />
                    Add to Cart
                  </Button>
                  <Button
                    onClick={handleDetailAddToWishlist}
                    className="flex-1 border-4 border-black bg-[#00FF80] hover:bg-[#00FF80]/90 font-bold shadow-[4px_4px_0px_0px_#000000] hover:shadow-[2px_2px_0px_0px_#000000] transition-all"
                  >
                    <Heart className="h-5 w-5 mr-2" />
                    Add to Wishlist
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}