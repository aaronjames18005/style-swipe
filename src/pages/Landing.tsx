import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { motion } from "framer-motion";
import { Heart, Loader2, ShoppingBag, Sparkles, Zap } from "lucide-react";
import { useNavigate } from "react-router";

export default function Landing() {
  const { isLoading, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FFE5F0]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFE5F0]">
      {/* Navbar */}
      <nav className="border-b-4 border-black bg-white shadow-[0px_4px_0px_0px_#000000]">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center gap-2">
              <div className="bg-[#FF0080] border-3 border-black p-2 rotate-3 shadow-[4px_4px_0px_0px_#000000]">
                <img src="/logo.svg" alt="Logo" className="h-8 w-8" />
              </div>
              <span className="text-2xl font-bold tracking-tight">SwipeFit</span>
            </div>
            <Button
              onClick={() => navigate(isAuthenticated ? "/swipe" : "/auth")}
              className="border-3 border-black bg-[#FF0080] hover:bg-[#FF0080]/90 text-white font-bold shadow-[4px_4px_0px_0px_#000000] hover:shadow-[2px_2px_0px_0px_#000000] transition-all"
            >
              {isAuthenticated ? "Start Swiping" : "Get Started"}
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-4xl mx-auto"
        >
          <div className="bg-[#00FF80] border-4 border-black p-3 inline-block mb-6 rotate-2 shadow-[6px_6px_0px_0px_#000000]">
            <span className="text-sm font-bold">🔥 SWIPE. SHOP. SLAY.</span>
          </div>

          <h1 className="text-6xl md:text-7xl font-bold mb-6 tracking-tight leading-tight">
            Fashion Shopping
            <br />
            <span className="bg-[#FF0080] text-white px-4 inline-block -rotate-1 border-4 border-black shadow-[8px_8px_0px_0px_#000000]">
              Made Fun
            </span>
          </h1>

          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Swipe through curated fashion items, build your perfect wardrobe, and get AI-powered outfit recommendations. Shopping has never been this addictive!
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Button
              onClick={() => navigate(isAuthenticated ? "/swipe" : "/auth")}
              size="lg"
              className="border-4 border-black bg-[#FF0080] hover:bg-[#FF0080]/90 text-white font-bold text-lg px-8 py-6 shadow-[8px_8px_0px_0px_#000000] hover:shadow-[4px_4px_0px_0px_#000000] transition-all"
            >
              <Zap className="mr-2 h-5 w-5" />
              Start Swiping Now
            </Button>
            <Button
              onClick={() => navigate("/auth")}
              size="lg"
              variant="outline"
              className="border-4 border-black bg-white hover:bg-gray-100 font-bold text-lg px-8 py-6 shadow-[8px_8px_0px_0px_#000000] hover:shadow-[4px_4px_0px_0px_#000000] transition-all"
            >
              Learn More
            </Button>
          </div>

          {/* Feature Cards */}
          <div className="grid md:grid-cols-3 gap-6 mt-16">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white border-4 border-black p-6 shadow-[6px_6px_0px_0px_#000000] -rotate-1"
            >
              <div className="bg-[#FF0080] border-3 border-black p-3 inline-block mb-4 shadow-[4px_4px_0px_0px_#000000]">
                <Heart className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2">Swipe to Shop</h3>
              <p className="text-gray-600">
                Discover fashion items one at a time. Swipe right to love, left to pass. It's that simple!
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white border-4 border-black p-6 shadow-[6px_6px_0px_0px_#000000] rotate-1"
            >
              <div className="bg-[#00FF80] border-3 border-black p-3 inline-block mb-4 shadow-[4px_4px_0px_0px_#000000]">
                <Sparkles className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold mb-2">AI Outfits</h3>
              <p className="text-gray-600">
                Get personalized outfit recommendations based on your style and preferences.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white border-4 border-black p-6 shadow-[6px_6px_0px_0px_#000000] -rotate-1"
            >
              <div className="bg-[#0080FF] border-3 border-black p-3 inline-block mb-4 shadow-[4px_4px_0px_0px_#000000]">
                <ShoppingBag className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2">Easy Shopping</h3>
              <p className="text-gray-600">
                Add items to your cart instantly. Wishlist your favorites for later. Shop smarter!
              </p>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* CTA Section */}
      <div className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
          className="bg-[#0080FF] border-4 border-black p-12 text-center shadow-[12px_12px_0px_0px_#000000] rotate-1 max-w-3xl mx-auto"
        >
          <h2 className="text-4xl font-bold text-white mb-4">
            Ready to Transform Your Shopping?
          </h2>
          <p className="text-white text-lg mb-6">
            Join thousands of fashion lovers who've made shopping fun again!
          </p>
          <Button
            onClick={() => navigate(isAuthenticated ? "/swipe" : "/auth")}
            size="lg"
            className="border-4 border-black bg-[#00FF80] hover:bg-[#00FF80]/90 font-bold text-lg px-8 py-6 shadow-[6px_6px_0px_0px_#000000] hover:shadow-[3px_3px_0px_0px_#000000] transition-all"
          >
            Get Started Free
          </Button>
        </motion.div>
      </div>

      {/* Footer */}
      <footer className="border-t-4 border-black bg-white py-8 mt-16">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-gray-600">
            Built with ❤️ by{" "}
            <a
              href="https://vly.ai"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-[#FF0080] transition-colors font-bold"
            >
              vly.ai
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}