import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { getCurrentUser } from "./users";

// Get items for swiping (exclude already swiped items)
export const getSwipeItems = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user) return [];

    const limit = args.limit || 20;

    // Get user's swipe history
    const swipes = await ctx.db
      .query("swipes")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .collect();

    const swipedItemIds = new Set(swipes.map((s) => s.itemId));

    // Get items not yet swiped
    const allItems = await ctx.db.query("items").collect();
    const unswipedItems = allItems
      .filter((item) => !swipedItemIds.has(item._id))
      .slice(0, limit);

    return unswipedItems;
  },
});

// Get all items
export const getAllItems = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("items").collect();
  },
});

// Get item by ID
export const getItemById = query({
  args: { itemId: v.id("items") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.itemId);
  },
});

// Record a swipe
export const recordSwipe = mutation({
  args: {
    itemId: v.id("items"),
    action: v.union(v.literal("left"), v.literal("right")),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user) throw new Error("Not authenticated");

    // Check if already swiped
    const existing = await ctx.db
      .query("swipes")
      .withIndex("by_user_and_item", (q) =>
        q.eq("userId", user._id).eq("itemId", args.itemId)
      )
      .unique();

    if (existing) {
      // Update existing swipe
      await ctx.db.patch(existing._id, { action: args.action });
      return existing._id;
    }

    // Create new swipe
    return await ctx.db.insert("swipes", {
      userId: user._id,
      itemId: args.itemId,
      action: args.action,
    });
  },
});

// Add sample items (for testing)
export const addSampleItems = mutation({
  args: {},
  handler: async (ctx) => {
    const sampleItems = [
      {
        name: "Classic Black T-Shirt",
        type: "shirt",
        color: "black",
        pattern: "plain",
        imageUrl: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500",
        price: 29.99,
        brand: "StyleCo",
        description: "Comfortable cotton t-shirt",
        sizes: ["S", "M", "L", "XL"],
        tags: ["casual", "basic", "everyday"],
      },
      {
        name: "Blue Denim Jeans",
        type: "pants",
        color: "blue",
        pattern: "plain",
        imageUrl: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=500",
        price: 79.99,
        brand: "DenimPro",
        description: "Classic fit denim jeans",
        sizes: ["28", "30", "32", "34", "36"],
        tags: ["casual", "denim", "classic"],
      },
      {
        name: "White Sneakers",
        type: "shoes",
        color: "white",
        pattern: "plain",
        imageUrl: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=500",
        price: 89.99,
        brand: "FootFlex",
        description: "Comfortable white sneakers",
        sizes: ["7", "8", "9", "10", "11"],
        tags: ["casual", "sneakers", "comfortable"],
      },
      {
        name: "Red Hoodie",
        type: "shirt",
        color: "red",
        pattern: "plain",
        imageUrl: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=500",
        price: 59.99,
        brand: "CozyWear",
        description: "Warm and cozy hoodie",
        sizes: ["S", "M", "L", "XL"],
        tags: ["casual", "warm", "hoodie"],
      },
      {
        name: "Striped Summer Dress",
        type: "dress",
        color: "multicolor",
        pattern: "striped",
        imageUrl: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=500",
        price: 69.99,
        brand: "SummerStyle",
        description: "Light and breezy summer dress",
        sizes: ["XS", "S", "M", "L"],
        tags: ["summer", "casual", "dress"],
      },
      {
        name: "Black Leather Jacket",
        type: "jacket",
        color: "black",
        pattern: "plain",
        imageUrl: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500",
        price: 199.99,
        brand: "LeatherLux",
        description: "Premium leather jacket",
        sizes: ["S", "M", "L", "XL"],
        tags: ["formal", "leather", "jacket"],
      },
    ];

    for (const item of sampleItems) {
      await ctx.db.insert("items", item);
    }

    return { success: true, count: sampleItems.length };
  },
});

// Get similar items based on type, tags, and style
export const getSimilarItems = query({
  args: { itemId: v.id("items"), limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const item = await ctx.db.get(args.itemId);
    if (!item) return [];

    const limit = args.limit || 10;

    // Get all items of the same type
    const allItems = await ctx.db
      .query("items")
      .withIndex("by_type", (q) => q.eq("type", item.type))
      .collect();

    // Filter out the current item and score by similarity
    const scoredItems = allItems
      .filter((i) => i._id !== item._id)
      .map((i) => {
        let score = 0;
        // Same type already matched
        score += 10;
        // Check tag overlap
        const tagOverlap = i.tags.filter((tag) => item.tags.includes(tag)).length;
        score += tagOverlap * 5;
        // Different color is good for variety
        if (i.color !== item.color) score += 3;
        // Similar price range
        const priceDiff = Math.abs(i.price - item.price);
        if (priceDiff < 20) score += 5;
        else if (priceDiff < 50) score += 2;

        return { item: i, score };
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map((s) => s.item);

    return scoredItems;
  },
});

// Get complementary item recommendations
export const getRecommendations = query({
  args: { itemId: v.id("items"), limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const item = await ctx.db.get(args.itemId);
    if (!item) return [];

    const limit = args.limit || 5;

    // Define complementary types
    const complementaryTypes: Record<string, string[]> = {
      shirt: ["pants", "shoes", "accessories", "jacket"],
      pants: ["shirt", "shoes", "accessories", "jacket"],
      dress: ["shoes", "accessories"],
      shoes: ["shirt", "pants", "dress", "accessories"],
      jacket: ["shirt", "pants", "shoes"],
      accessories: ["shirt", "pants", "dress", "shoes"],
    };

    const targetTypes = complementaryTypes[item.type] || [];
    if (targetTypes.length === 0) return [];

    // Get all items
    const allItems = await ctx.db.query("items").collect();

    // Filter and score complementary items
    const scoredItems = allItems
      .filter((i) => targetTypes.includes(i.type))
      .map((i) => {
        let score = 0;
        // Check if tags suggest good pairing
        const casualTags = ["casual", "everyday", "basic"];
        const formalTags = ["formal", "elegant", "professional"];
        
        const itemIsCasual = item.tags.some((t) => casualTags.includes(t));
        const itemIsFormal = item.tags.some((t) => formalTags.includes(t));
        const targetIsCasual = i.tags.some((t) => casualTags.includes(t));
        const targetIsFormal = i.tags.some((t) => formalTags.includes(t));

        if ((itemIsCasual && targetIsCasual) || (itemIsFormal && targetIsFormal)) {
          score += 10;
        }

        // Similar price range suggests good pairing
        const priceDiff = Math.abs(i.price - item.price);
        if (priceDiff < 30) score += 5;
        else if (priceDiff < 60) score += 2;

        // Color coordination (simple logic)
        const neutralColors = ["black", "white", "gray", "beige"];
        if (neutralColors.includes(i.color) || neutralColors.includes(item.color)) {
          score += 3;
        }

        return { item: i, score };
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map((s) => s.item);

    return scoredItems;
  },
});

// Record swipe patterns for AI learning
export const recordSwipePattern = mutation({
  args: {
    itemId: v.id("items"),
    action: v.union(v.literal("left"), v.literal("right")),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user) throw new Error("Not authenticated");

    const item = await ctx.db.get(args.itemId);
    if (!item) return;

    // For now, just record the swipe (future: aggregate patterns)
    // This data can be used later for ML-based recommendations
    return { success: true, pattern: { type: item.type, color: item.color, action: args.action } };
  },
});