import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

// The schema is normally optional, but Convex Auth
// requires indexes defined on `authTables`.
// The schema provides more precise TypeScript types.
export default defineSchema({
  ...authTables,
  users: defineTable({
    name: v.optional(v.string()),
    username: v.optional(v.string()),
    image: v.optional(v.string()),
    email: v.optional(v.string()),
    emailVerificationTime: v.optional(v.number()),
    phone: v.optional(v.string()),
    phoneVerificationTime: v.optional(v.number()),
    isAnonymous: v.optional(v.boolean()),
  }).index("email", ["email"]),
  studySessions: defineTable({
    id: v.optional(v.id("studySessions")),
    userId: v.id("users"),
    topic: v.string(),
    totalCards: v.number(),
    cards: v.array(
      v.object({
        id: v.optional(v.string()),
        question: v.string(),
        answer: v.string(),
        answeredCorrect: v.optional(v.boolean()),
      }),
    ),
    completedCards: v.number(),
    correctAnswers: v.number(),
  }).index("by_userId", ["userId"]),
});
