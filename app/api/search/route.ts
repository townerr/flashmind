import { NextRequest, NextResponse } from "next/server";
import { Format, SafeSearchLevel, SearXNGClient } from "@eleven-am/searxng-sdk";

const searx = new SearXNGClient(process.env.SEARXNG_URL!);

export async function POST(request: NextRequest) {
  try {
    const { query } = await request.json();

    if (!query || typeof query !== "string") {
      return NextResponse.json(
        { error: "Query parameter is required" },
        { status: 400 }
      );
    }

    const results = await searx
      .setSafeSearch(SafeSearchLevel.MODERATE)
      .setPage(1)
      .setFormat(Format.JSON)
      .setEngines(["google"])
      .search(query);

    return NextResponse.json(results);
  } catch (error) {
    console.error("Error searching with SearXNG:", error);
    console.error("Error details:", error instanceof Error ? error.message : String(error));
    console.error("Error stack:", error instanceof Error ? error.stack : "No stack trace");
    return NextResponse.json(
      { error: "Failed to perform search", details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}

