import { Toaster } from "@/components/ui/sonner";
import AuthPage from "@/pages/Auth.tsx";
import { ConvexAuthProvider } from "@convex-dev/auth/react";
import { ConvexReactClient } from "convex/react";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router";
import "./index.css";
import Landing from "./pages/Landing.tsx";
import NotFound from "./pages/NotFound.tsx";
import Swipe from "./pages/Swipe.tsx";
import Cart from "./pages/Cart.tsx";
import Wishlist from "./pages/Wishlist.tsx";
import Profile from "./pages/Profile.tsx";
import "./types/global.d.ts";

const convex = new ConvexReactClient(import.meta.env.VITE_CONVEX_URL as string);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
      <ConvexAuthProvider client={convex}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/auth" element={<AuthPage redirectAfterAuth="/swipe" />} />
            <Route path="/swipe" element={<Swipe />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/wishlist" element={<Wishlist />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
        <Toaster />
      </ConvexAuthProvider>
  </StrictMode>,
);