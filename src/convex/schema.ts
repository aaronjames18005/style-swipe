import { authTables } from "@convex-dev/auth/server";
import { defineSchema, defineTable } from "convex/server";
import { Infer, v } from "convex/values";

// default user roles. can add / remove based on the project as needed
export const ROLES = {
  ADMIN: "admin",
  USER: "user",
  MEMBER: "member",
} as const;

export const roleValidator = v.union(
  v.literal(ROLES.ADMIN),
  v.literal(ROLES.USER),
  v.literal(ROLES.MEMBER),
);
export type Role = Infer<typeof roleValidator>;

const schema = defineSchema(
  {
    // default auth tables using convex auth.
    ...authTables, // do not remove or modify

    // the users table is the default users table that is brought in by the authTables
    users: defineTable({
      name: v.optional(v.string()), // name of the user. do not remove
      image: v.optional(v.string()), // image of the user. do not remove
      email: v.optional(v.string()), // email of the user. do not remove
      emailVerificationTime: v.optional(v.number()), // email verification time. do not remove
      isAnonymous: v.optional(v.boolean()), // is the user anonymous. do not remove

      role: v.optional(roleValidator), // role of the user. do not remove
      
      // Fashion app specific fields
      preferences: v.optional(v.object({
        colors: v.array(v.string()),
        styles: v.array(v.string()),
        sizes: v.object({
          top: v.optional(v.string()),
          bottom: v.optional(v.string()),
          shoes: v.optional(v.string()),
        }),
      })),
    }).index("email", ["email"]), // index for the email. do not remove or modify

    // Clothing items in the store
    items: defineTable({
      name: v.string(),
      type: v.string(), // shirt, pants, dress, shoes, accessories
      color: v.string(),
      pattern: v.string(), // plain, striped, floral, etc
      imageUrl: v.string(),
      price: v.number(),
      brand: v.optional(v.string()),
      description: v.optional(v.string()),
      sizes: v.array(v.string()),
      tags: v.array(v.string()),
    })
      .index("by_type", ["type"])
      .index("by_color", ["color"]),

    // User swipe history
    swipes: defineTable({
      userId: v.id("users"),
      itemId: v.id("items"),
      action: v.union(v.literal("left"), v.literal("right")),
    })
      .index("by_user", ["userId"])
      .index("by_user_and_item", ["userId", "itemId"]),

    // User's wardrobe (uploaded items)
    wardrobe: defineTable({
      userId: v.id("users"),
      name: v.optional(v.string()),
      type: v.string(),
      color: v.string(),
      pattern: v.string(),
      imageUrl: v.string(),
      storageId: v.optional(v.id("_storage")),
      tags: v.array(v.string()),
    }).index("by_user", ["userId"]),

    // Shopping cart
    cart: defineTable({
      userId: v.id("users"),
      itemId: v.id("items"),
      quantity: v.number(),
      size: v.string(),
    })
      .index("by_user", ["userId"])
      .index("by_user_and_item", ["userId", "itemId"]),

    // Wishlist
    wishlist: defineTable({
      userId: v.id("users"),
      itemId: v.id("items"),
    })
      .index("by_user", ["userId"])
      .index("by_user_and_item", ["userId", "itemId"]),

    // Outfit recommendations
    outfits: defineTable({
      userId: v.id("users"),
      name: v.string(),
      baseItemId: v.id("items"),
      suggestedItemIds: v.array(v.id("items")),
      wardrobeItemIds: v.optional(v.array(v.id("wardrobe"))),
      saved: v.boolean(),
    }).index("by_user", ["userId"]),
  },
  {
    schemaValidation: false,
  },
);

export default schema;