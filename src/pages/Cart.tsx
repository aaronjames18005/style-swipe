import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useAuth } from "@/hooks/use-auth";
import { useMutation, useQuery } from "convex/react";
import { motion } from "framer-motion";
import { Loader2, Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { useEffect } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";

export default function Cart() {
  const { isLoading, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const cartItems = useQuery(api.cart.getCart);
  const updateQuantity = useMutation(api.cart.updateCartQuantity);
  const removeFromCart = useMutation(api.cart.removeFromCart);
  const clearCart = useMutation(api.cart.clearCart);

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

  const total = cartItems?.reduce((sum, item) => {
    return sum + (item.item?.price || 0) * item.quantity;
  }, 0) || 0;

  const handleCheckout = async () => {
    toast.success("Checkout coming soon! 🎉");
    await clearCart();
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#E5F0FF]">
      <Navbar />

      <div className="flex-1 container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto"
        >
          <div className="bg-[#FF0080] border-4 border-black p-4 mb-6 shadow-[8px_8px_0px_0px_#000000] -rotate-1">
            <h1 className="text-3xl font-bold text-white tracking-tight">Shopping Cart</h1>
          </div>

          {!cartItems || cartItems.length === 0 ? (
            <div className="text-center py-16">
              <div className="bg-white border-4 border-black p-8 inline-block shadow-[8px_8px_0px_0px_#000000] rotate-2">
                <ShoppingBag className="h-16 w-16 mx-auto mb-4" />
                <h2 className="text-2xl font-bold mb-2">Your cart is empty</h2>
                <p className="mb-4">Start swiping to add items!</p>
                <Button
                  onClick={() => navigate("/swipe")}
                  className="border-3 border-black bg-[#00FF80] hover:bg-[#00FF80]/90 font-bold shadow-[4px_4px_0px_0px_#000000]"
                >
                  Start Shopping
                </Button>
              </div>
            </div>
          ) : (
            <div className="grid gap-6">
              {/* Cart Items */}
              <div className="space-y-4">
                {cartItems.map((cartItem, index) => (
                  <motion.div
                    key={cartItem._id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white border-4 border-black p-4 shadow-[6px_6px_0px_0px_#000000]"
                  >
                    <div className="flex gap-4">
                      <img
                        src={cartItem.item?.imageUrl}
                        alt={cartItem.item?.name}
                        className="w-24 h-24 object-cover border-3 border-black"
                      />
                      <div className="flex-1">
                        <h3 className="font-bold text-lg">{cartItem.item?.name}</h3>
                        <p className="text-sm text-gray-600">Size: {cartItem.size}</p>
                        <p className="font-bold mt-2">${cartItem.item?.price}</p>
                      </div>
                      <div className="flex flex-col items-end justify-between">
                        <Button
                          onClick={() => removeFromCart({ cartItemId: cartItem._id as Id<"cart"> })}
                          variant="outline"
                          size="icon"
                          className="border-3 border-black bg-white hover:bg-red-100 shadow-[3px_3px_0px_0px_#000000]"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                        <div className="flex items-center gap-2">
                          <Button
                            onClick={() =>
                              updateQuantity({
                                cartItemId: cartItem._id as Id<"cart">,
                                quantity: cartItem.quantity - 1,
                              })
                            }
                            variant="outline"
                            size="icon"
                            className="h-8 w-8 border-3 border-black shadow-[2px_2px_0px_0px_#000000]"
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <span className="font-bold w-8 text-center">{cartItem.quantity}</span>
                          <Button
                            onClick={() =>
                              updateQuantity({
                                cartItemId: cartItem._id as Id<"cart">,
                                quantity: cartItem.quantity + 1,
                              })
                            }
                            variant="outline"
                            size="icon"
                            className="h-8 w-8 border-3 border-black shadow-[2px_2px_0px_0px_#000000]"
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Total & Checkout */}
              <div className="bg-[#00FF80] border-4 border-black p-6 shadow-[8px_8px_0px_0px_#000000] rotate-1">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-2xl font-bold">Total:</span>
                  <span className="text-3xl font-bold">${total.toFixed(2)}</span>
                </div>
                <Button
                  onClick={handleCheckout}
                  className="w-full border-3 border-black bg-[#FF0080] hover:bg-[#FF0080]/90 text-white font-bold text-lg py-6 shadow-[4px_4px_0px_0px_#000000] hover:shadow-[2px_2px_0px_0px_#000000] transition-all"
                >
                  Checkout
                </Button>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
