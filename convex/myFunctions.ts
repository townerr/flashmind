import { query} from "./_generated/server";

export const getCurrentUserId = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (identity === null) {
      return null; // User is not authenticated
    }
    return identity;
  },
});