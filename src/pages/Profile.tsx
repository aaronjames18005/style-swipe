import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { motion } from "framer-motion";
import { Loader2, LogOut, User } from "lucide-react";
import { useEffect } from "react";
import { useNavigate } from "react-router";

export default function Profile() {
  const { isLoading, isAuthenticated, user, signOut } = useAuth();
  const navigate = useNavigate();

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

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#E5FFE5]">
      <Navbar />

      <div className="flex-1 container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl mx-auto"
        >
          <div className="bg-[#0080FF] border-4 border-black p-4 mb-6 shadow-[8px_8px_0px_0px_#000000] -rotate-1">
            <h1 className="text-3xl font-bold text-white tracking-tight">My Profile</h1>
          </div>

          <div className="bg-white border-4 border-black p-8 shadow-[8px_8px_0px_0px_#000000]">
            <div className="flex items-center gap-4 mb-6">
              <div className="bg-[#FF0080] border-3 border-black p-4 shadow-[4px_4px_0px_0px_#000000]">
                <User className="h-12 w-12 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">{user?.name || "Fashion Lover"}</h2>
                <p className="text-gray-600">{user?.email || "No email"}</p>
              </div>
            </div>

            <div className="space-y-4">
              <Button
                onClick={() => navigate("/swipe")}
                className="w-full border-3 border-black bg-[#00FF80] hover:bg-[#00FF80]/90 font-bold shadow-[4px_4px_0px_0px_#000000] hover:shadow-[2px_2px_0px_0px_#000000] transition-all"
              >
                Start Swiping
              </Button>
              <Button
                onClick={() => navigate("/wishlist")}
                className="w-full border-3 border-black bg-[#FF0080] hover:bg-[#FF0080]/90 text-white font-bold shadow-[4px_4px_0px_0px_#000000] hover:shadow-[2px_2px_0px_0px_#000000] transition-all"
              >
                View Wishlist
              </Button>
              <Button
                onClick={() => navigate("/cart")}
                className="w-full border-3 border-black bg-[#0080FF] hover:bg-[#0080FF]/90 text-white font-bold shadow-[4px_4px_0px_0px_#000000] hover:shadow-[2px_2px_0px_0px_#000000] transition-all"
              >
                View Cart
              </Button>
              <Button
                onClick={handleSignOut}
                variant="outline"
                className="w-full border-3 border-black bg-white hover:bg-gray-100 font-bold shadow-[4px_4px_0px_0px_#000000] hover:shadow-[2px_2px_0px_0px_#000000] transition-all"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
