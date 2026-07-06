import { NextResponse } from "next/server";
import { getContentfulSiteContent, type LocaleKey } from "@/lib/contentfulContent";

export const dynamic = "force-dynamic";

function parseLocale(value: string | null): LocaleKey {
  return value === "pt" ? "pt" : "en";
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const locale = parseLocale(searchParams.get("locale"));

  try {
    const content = await getContentfulSiteContent(locale);
    return NextResponse.json(content);
  } catch (error) {
    console.error("Failed to fetch Contentful content", error);
    return NextResponse.json(
      { error: "Failed to fetch Contentful content" },
      { status: 500 },
    );
  }
}
