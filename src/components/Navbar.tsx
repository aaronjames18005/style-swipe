import { useAuth } from "@/hooks/use-auth";
import { Heart, ShoppingCart, User } from "lucide-react";
import { Link, useNavigate } from "react-router";
import { Button } from "./ui/button";

export function Navbar() {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  return (
    <nav className="border-b-4 border-black bg-white shadow-[0px_4px_0px_0px_#000000]">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 cursor-pointer">
            <div className="bg-[#FF0080] border-3 border-black p-2 rotate-3 shadow-[4px_4px_0px_0px_#000000]">
              <img src="/logo.svg" alt="Logo" className="h-8 w-8" />
            </div>
            <span className="text-2xl font-bold tracking-tight">SwipeFit</span>
          </Link>

          {/* Nav Items */}
          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <>
                <Button
                  onClick={() => navigate("/wishlist")}
                  variant="outline"
                  size="icon"
                  className="border-3 border-black bg-[#00FF80] hover:bg-[#00FF80]/90 shadow-[3px_3px_0px_0px_#000000]"
                >
                  <Heart className="h-5 w-5" />
                </Button>
                <Button
                  onClick={() => navigate("/cart")}
                  variant="outline"
                  size="icon"
                  className="border-3 border-black bg-[#0080FF] hover:bg-[#0080FF]/90 text-white shadow-[3px_3px_0px_0px_#000000]"
                >
                  <ShoppingCart className="h-5 w-5" />
                </Button>
                <Button
                  onClick={() => navigate("/profile")}
                  variant="outline"
                  size="icon"
                  className="border-3 border-black bg-white hover:bg-gray-100 shadow-[3px_3px_0px_0px_#000000]"
                >
                  <User className="h-5 w-5" />
                </Button>
              </>
            ) : (
              <Button
                onClick={() => navigate("/auth")}
                className="border-3 border-black bg-[#FF0080] hover:bg-[#FF0080]/90 text-white font-bold shadow-[4px_4px_0px_0px_#000000] hover:shadow-[2px_2px_0px_0px_#000000] transition-all"
              >
                Get Started
              </Button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
