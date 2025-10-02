import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { getCurrentUser } from "./users";

// Get user's wishlist
export const getWishlist = query({
  args: {},
  handler: async (ctx) => {
    const user = await getCurrentUser(ctx);
    if (!user) return [];

    const wishlistItems = await ctx.db
      .query("wishlist")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .collect();

    // Fetch item details
    const itemsWithDetails = await Promise.all(
      wishlistItems.map(async (wishlistItem) => {
        const item = await ctx.db.get(wishlistItem.itemId);
        return {
          ...wishlistItem,
          item,
        };
      })
    );

    return itemsWithDetails;
  },
});

// Add to wishlist
export const addToWishlist = mutation({
  args: { itemId: v.id("items") },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user) throw new Error("Not authenticated");

    // Check if already in wishlist
    const existing = await ctx.db
      .query("wishlist")
      .withIndex("by_user_and_item", (q) =>
        q.eq("userId", user._id).eq("itemId", args.itemId)
      )
      .unique();

    if (existing) {
      return existing._id;
    }

    return await ctx.db.insert("wishlist", {
      userId: user._id,
      itemId: args.itemId,
    });
  },
});

// Remove from wishlist
export const removeFromWishlist = mutation({
  args: { itemId: v.id("items") },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user) throw new Error("Not authenticated");

    const wishlistItem = await ctx.db
      .query("wishlist")
      .withIndex("by_user_and_item", (q) =>
        q.eq("userId", user._id).eq("itemId", args.itemId)
      )
      .unique();

    if (wishlistItem) {
      await ctx.db.delete(wishlistItem._id);
    }
  },
});

// Check if item is in wishlist
export const isInWishlist = query({
  args: { itemId: v.id("items") },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user) return false;

    const wishlistItem = await ctx.db
      .query("wishlist")
      .withIndex("by_user_and_item", (q) =>
        q.eq("userId", user._id).eq("itemId", args.itemId)
      )
      .unique();

    return !!wishlistItem;
  },
});
