import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

export const getCurrentUser = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) {
      return null;
    }
    return await ctx.db.get(userId);
  },
});

export const createUserStudySession = mutation({
  args: {
    userId: v.id("users"),
    studySession: v.object({
      topic: v.string(),
      totalCards: v.number(),
      cards: v.array(v.object({
        question: v.string(),
        answer: v.string(),
        answeredCorrect: v.optional(v.boolean()),
      })),
    }),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("studySessions", {
      userId: args.userId,
      topic: args.studySession.topic,
      totalCards: args.studySession.totalCards,
      cards: args.studySession.cards,
    });
  },
});

export const getUserStudySessions = query({
  args: {
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    return await ctx.db.query("studySessions").withIndex("by_userId", (q) => q.eq("userId", args.userId)).collect();
  },
});
