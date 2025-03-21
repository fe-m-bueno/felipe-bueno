import { NextResponse } from "next/server";

export async function GET() {
  const LASTFM_URL = "http://ws.audioscrobbler.com/2.0/";
  const API_KEY = process.env.LAST_FM_API_KEY;
  const USERNAME = process.env.LAST_FM_USER;

  if (!API_KEY || !USERNAME) {
    console.error(
      "LastFM API key or username not found in environment variables"
    );
    return NextResponse.json(
      { error: "API configuration error" },
      { status: 500 }
    );
  }
  try {
    const url = `${LASTFM_URL}?method=user.getrecenttracks&user=${USERNAME}&api_key=${API_KEY}&format=json&limit=1`;
    const res = await fetch(url, {
      next: { revalidate: 60 },
    });

    if (!res.ok) {
      console.error("Failed to fetch LastFM data:", res.status, res.statusText);
      return NextResponse.json(
        { error: "Failed to fetch LastFM data" },
        { status: res.status }
      );
    }

    const data = await res.json();
    const track = data?.recenttracks?.track?.[0];

    if (!track) {
      console.error("No track data found in LastFM response");
      return NextResponse.json(
        { error: "No track data found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      title: track.name,
      artist: track.artist["#text"],
      album: track.album["#text"] || "Unknown Album",
      image: track.image?.[2]?.["#text"] || null,
    });
  } catch (error) {
    console.error("Error fetching LastFM data:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
