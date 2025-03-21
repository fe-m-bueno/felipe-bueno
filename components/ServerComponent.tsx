export default async function LastFmTrack() {
  try {
    const res = await fetch(`http://localhost:3000/api/lastfm`, {
      cache: "default",
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch: ${res.status} ${res.statusText}`);
    }

    const data = await res.json();

    return (
      <div className="p-4 border rounded shadow-md flex flex-col items-center gap-2">
        <h2 className="text-lg font-semibold">Now Playing:</h2>
        <p>
          {data?.name} - {data?.artist}
        </p>
        {data?.image && (
          <img
            src={data.image}
            alt={`${data.name} album cover`}
            className="w-24 h-24 mt-2 rounded"
          />
        )}
      </div>
    );
  } catch (error) {
    console.error("Error fetching LastFM data:", error);
    return <div>Error fetching LastFM data</div>;
  }
}
