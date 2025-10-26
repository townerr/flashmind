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
    studySession: v.object({
      topic: v.string(),
      totalCards: v.number(),
      completedCards: v.number(),
      correctAnswers: v.number(),
      cards: v.array(v.object({
        id: v.optional(v.string()),
        question: v.string(),
        answer: v.string(),
        answeredCorrect: v.optional(v.boolean()),
      })),
    }),
  },
  handler: async (ctx, args) => {
    const currentUserId = await getAuthUserId(ctx);
    if(!currentUserId) {
      throw new Error("User does not exist");
    }

    const currentUser = await ctx.db.get(currentUserId);
    if (currentUser?.isAnonymous) {
      throw new Error("Guests are not authorized to save a study session");
    }

    return await ctx.db.insert("studySessions", {
      userId: currentUserId,
      topic: args.studySession.topic,
      totalCards: args.studySession.totalCards,
      cards: args.studySession.cards,
      completedCards: args.studySession.completedCards,
      correctAnswers: args.studySession.correctAnswers,
    });
  },
});

export const getUserStudySessions = query({
  args: {},
  handler: async (ctx) => {
    const currentUserId = await getAuthUserId(ctx);
    if (currentUserId === null) {
      throw new Error("User not authenticated");
    }

    return await ctx.db.query("studySessions").withIndex("by_userId", (q) => q.eq("userId", currentUserId)).collect();
  },
});

export const deleteUserStudySession = mutation({
  args: {
    studySessionId: v.id("studySessions"),
  },
  handler: async (ctx, args) => {
    const currentUserId = await getAuthUserId(ctx);
    if (currentUserId === null) {
      throw new Error("User not authenticated");
    }

    const studySession = await ctx.db.get(args.studySessionId);
    if (!studySession) {
      throw new Error("Study session not found");
    }
    
    if (currentUserId !== studySession.userId) {
      throw new Error("User not authorized to delete this study session");
    }

    return await ctx.db.delete(args.studySessionId);
  },
});