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
      cards: v.array(
        v.object({
          id: v.optional(v.string()),
          question: v.string(),
          answer: v.string(),
          answeredCorrect: v.optional(v.boolean()),
        }),
      ),
    }),
  },
  handler: async (ctx, args) => {
    const currentUserId = await getAuthUserId(ctx);
    if (!currentUserId) {
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

    return await ctx.db
      .query("studySessions")
      .withIndex("by_userId", (q) => q.eq("userId", currentUserId))
      .collect();
  },
});

export const updateUserStudySession = mutation({
  args: {
    sessionId: v.id("studySessions"),
    updates: v.object({
      topic: v.optional(v.string()),
      cards: v.optional(
        v.array(
          v.object({
            id: v.optional(v.string()),
            question: v.string(),
            answer: v.string(),
            answeredCorrect: v.optional(v.boolean()),
          }),
        ),
      ),
      completedCards: v.optional(v.number()),
      correctAnswers: v.optional(v.number()),
      isPublic: v.optional(v.boolean()),
    }),
  },
  handler: async (ctx, args) => {
    const currentUserId = await getAuthUserId(ctx);
    if (currentUserId === null) {
      throw new Error("User not authenticated");
    }

    const studySession = await ctx.db.get(args.sessionId);
    if (!studySession) {
      throw new Error("Study session not found");
    }

    if (currentUserId !== studySession.userId) {
      throw new Error("User not authorized to update this study session");
    }

    const updateData: any = {};
    if (args.updates.topic !== undefined) {
      updateData.topic = args.updates.topic;
    }
    if (args.updates.cards !== undefined) {
      updateData.cards = args.updates.cards;
    }
    if (args.updates.completedCards !== undefined) {
      updateData.completedCards = args.updates.completedCards;
    }
    if (args.updates.correctAnswers !== undefined) {
      updateData.correctAnswers = args.updates.correctAnswers;
    }
    if (args.updates.isPublic !== undefined) {
      updateData.isPublic = args.updates.isPublic;
    }

    return await ctx.db.patch(args.sessionId, updateData);
  },
});

export const toggleSessionPublic = mutation({
  args: {
    sessionId: v.id("studySessions"),
    isPublic: v.boolean(),
  },
  handler: async (ctx, args) => {
    const currentUserId = await getAuthUserId(ctx);
    if (currentUserId === null) {
      throw new Error("User not authenticated");
    }

    const studySession = await ctx.db.get(args.sessionId);
    if (!studySession) {
      throw new Error("Study session not found");
    }

    if (currentUserId !== studySession.userId) {
      throw new Error("User not authorized to update this study session");
    }

    return await ctx.db.patch(args.sessionId, { isPublic: args.isPublic });
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

export const getPublicStudySessions = query({
  args: {},
  handler: async (ctx) => {
    const publicSessions = await ctx.db
      .query("studySessions")
      .filter((q) => q.eq(q.field("isPublic"), true))
      .collect();

    // Fetch user data for each session
    const sessionsWithUsers = await Promise.all(
      publicSessions.map(async (session) => {
        const user = await ctx.db.get(session.userId);
        return {
          ...session,
          creatorName:
            user?.username || user?.name || user?.email || "Anonymous",
        };
      }),
    );

    return sessionsWithUsers;
  },
});

export const copyPublicDeck = mutation({
  args: {
    sessionId: v.id("studySessions"),
  },
  handler: async (ctx, args) => {
    const currentUserId = await getAuthUserId(ctx);
    if (!currentUserId) {
      throw new Error("User not authenticated");
    }

    const currentUser = await ctx.db.get(currentUserId);
    if (currentUser?.isAnonymous) {
      throw new Error("Guests are not authorized to copy a study session");
    }

    const originalSession = await ctx.db.get(args.sessionId);
    if (!originalSession) {
      throw new Error("Study session not found");
    }

    if (!originalSession.isPublic) {
      throw new Error("This deck is not public");
    }

    // Create a copy with reset progress
    return await ctx.db.insert("studySessions", {
      userId: currentUserId,
      topic: originalSession.topic,
      totalCards: originalSession.totalCards,
      cards: originalSession.cards.map((card) => ({
        id: card.id,
        question: card.question,
        answer: card.answer,
        // Reset progress
        answeredCorrect: undefined,
      })),
      completedCards: 0,
      correctAnswers: 0,
      isPublic: false, // Copied decks are private by default
    });
  },
});
