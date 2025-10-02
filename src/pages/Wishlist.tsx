import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useAuth } from "@/hooks/use-auth";
import { useMutation, useQuery } from "convex/react";
import { motion } from "framer-motion";
import { Heart, Loader2, ShoppingCart } from "lucide-react";
import { useEffect } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";

export default function Wishlist() {
  const { isLoading, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const wishlistItems = useQuery(api.wishlist.getWishlist);
  const removeFromWishlist = useMutation(api.wishlist.removeFromWishlist);

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

  const handleRemove = async (itemId: Id<"items">) => {
    try {
      await removeFromWishlist({ itemId });
      toast.success("Removed from wishlist");
    } catch (error) {
      toast.error("Failed to remove item");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FFE5F0]">
      <Navbar />

      <div className="flex-1 container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-6xl mx-auto"
        >
          <div className="bg-[#00FF80] border-4 border-black p-4 mb-6 shadow-[8px_8px_0px_0px_#000000] rotate-1">
            <h1 className="text-3xl font-bold tracking-tight">My Wishlist</h1>
          </div>

          {!wishlistItems || wishlistItems.length === 0 ? (
            <div className="text-center py-16">
              <div className="bg-white border-4 border-black p-8 inline-block shadow-[8px_8px_0px_0px_#000000] -rotate-2">
                <Heart className="h-16 w-16 mx-auto mb-4" />
                <h2 className="text-2xl font-bold mb-2">No favorites yet</h2>
                <p className="mb-4">Swipe right to add items!</p>
                <Button
                  onClick={() => navigate("/swipe")}
                  className="border-3 border-black bg-[#FF0080] hover:bg-[#FF0080]/90 text-white font-bold shadow-[4px_4px_0px_0px_#000000]"
                >
                  Start Swiping
                </Button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {wishlistItems.map((wishlistItem, index) => (
                <motion.div
                  key={wishlistItem._id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white border-4 border-black shadow-[6px_6px_0px_0px_#000000] overflow-hidden"
                >
                  <div className="relative h-64 bg-gray-200">
                    <img
                      src={wishlistItem.item?.imageUrl}
                      alt={wishlistItem.item?.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-3 right-3 bg-[#FF0080] border-3 border-black px-3 py-1 shadow-[3px_3px_0px_0px_#000000]">
                      <span className="font-bold text-white">${wishlistItem.item?.price}</span>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-lg mb-2">{wishlistItem.item?.name}</h3>
                    <p className="text-sm text-gray-600 mb-4">{wishlistItem.item?.brand}</p>
                    <div className="flex gap-2">
                      <Button
                        onClick={() => handleRemove(wishlistItem.itemId)}
                        variant="outline"
                        className="flex-1 border-3 border-black bg-white hover:bg-gray-100 shadow-[3px_3px_0px_0px_#000000]"
                      >
                        Remove
                      </Button>
                      <Button
                        onClick={() => navigate("/swipe")}
                        className="flex-1 border-3 border-black bg-[#0080FF] hover:bg-[#0080FF]/90 text-white shadow-[3px_3px_0px_0px_#000000]"
                      >
                        <ShoppingCart className="h-4 w-4 mr-2" />
                        Buy
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
