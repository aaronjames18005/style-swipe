import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { getCurrentUser } from "./users";

// Get user's cart
export const getCart = query({
  args: {},
  handler: async (ctx) => {
    const user = await getCurrentUser(ctx);
    if (!user) return [];

    const cartItems = await ctx.db
      .query("cart")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .collect();

    // Fetch item details
    const itemsWithDetails = await Promise.all(
      cartItems.map(async (cartItem) => {
        const item = await ctx.db.get(cartItem.itemId);
        return {
          ...cartItem,
          item,
        };
      })
    );

    return itemsWithDetails;
  },
});

// Add to cart
export const addToCart = mutation({
  args: {
    itemId: v.id("items"),
    size: v.string(),
    quantity: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user) throw new Error("Not authenticated");

    // Check if item already in cart
    const existing = await ctx.db
      .query("cart")
      .withIndex("by_user_and_item", (q) =>
        q.eq("userId", user._id).eq("itemId", args.itemId)
      )
      .first();

    if (existing && existing.size === args.size) {
      // Update quantity
      await ctx.db.patch(existing._id, {
        quantity: existing.quantity + (args.quantity || 1),
      });
      return existing._id;
    }

    // Add new cart item
    return await ctx.db.insert("cart", {
      userId: user._id,
      itemId: args.itemId,
      size: args.size,
      quantity: args.quantity || 1,
    });
  },
});

// Remove from cart
export const removeFromCart = mutation({
  args: { cartItemId: v.id("cart") },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user) throw new Error("Not authenticated");

    const cartItem = await ctx.db.get(args.cartItemId);
    if (!cartItem || cartItem.userId !== user._id) {
      throw new Error("Cart item not found");
    }

    await ctx.db.delete(args.cartItemId);
  },
});

// Update cart item quantity
export const updateCartQuantity = mutation({
  args: {
    cartItemId: v.id("cart"),
    quantity: v.number(),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user) throw new Error("Not authenticated");

    const cartItem = await ctx.db.get(args.cartItemId);
    if (!cartItem || cartItem.userId !== user._id) {
      throw new Error("Cart item not found");
    }

    if (args.quantity <= 0) {
      await ctx.db.delete(args.cartItemId);
    } else {
      await ctx.db.patch(args.cartItemId, { quantity: args.quantity });
    }
  },
});

// Clear cart
export const clearCart = mutation({
  args: {},
  handler: async (ctx) => {
    const user = await getCurrentUser(ctx);
    if (!user) throw new Error("Not authenticated");

    const cartItems = await ctx.db
      .query("cart")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .collect();

    for (const item of cartItems) {
      await ctx.db.delete(item._id);
    }
  },
});
