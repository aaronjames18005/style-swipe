import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { getCurrentUser } from "./users";

// Get user's wardrobe
export const getWardrobe = query({
  args: {},
  handler: async (ctx) => {
    const user = await getCurrentUser(ctx);
    if (!user) return [];

    return await ctx.db
      .query("wardrobe")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .collect();
  },
});

// Add item to wardrobe
export const addToWardrobe = mutation({
  args: {
    name: v.optional(v.string()),
    type: v.string(),
    color: v.string(),
    pattern: v.string(),
    imageUrl: v.string(),
    storageId: v.optional(v.id("_storage")),
    tags: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user) throw new Error("Not authenticated");

    return await ctx.db.insert("wardrobe", {
      userId: user._id,
      ...args,
    });
  },
});

// Remove from wardrobe
export const removeFromWardrobe = mutation({
  args: { wardrobeItemId: v.id("wardrobe") },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user) throw new Error("Not authenticated");

    const item = await ctx.db.get(args.wardrobeItemId);
    if (!item || item.userId !== user._id) {
      throw new Error("Wardrobe item not found");
    }

    await ctx.db.delete(args.wardrobeItemId);
  },
});

// Generate upload URL for wardrobe image
export const generateUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    return await ctx.storage.generateUploadUrl();
  },
});
