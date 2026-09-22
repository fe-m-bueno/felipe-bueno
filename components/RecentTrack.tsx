"use client";

import { useEffect, useState, memo } from "react";
import { useTranslation } from "react-i18next";
import Image from "next/image";
import LiquidGlass from "./LiquidGlass";

type Track = {
  title: string;
  artist: string;
  image?: string;
};

function RecentTrackComponent() {
  const { t } = useTranslation();
  const [track, setTrack] = useState<Track | null>(null);

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    async function fetchTrack() {
      try {
        const res = await fetch("/api/lastfm", { signal: controller.signal });
        if (!res.ok) throw new Error("Erro ao buscar música");

        const data = await res.json();
        if (isMounted) {
          if (!data?.title || !data?.artist) {
            setTrack(null);
            return;
          }

          setTrack({
            title: data.title,
            artist: data.artist,
            image: data.image || undefined,
          });
        }
      } catch (error) {
        if (error instanceof Error && error.name !== 'AbortError') {
          console.error("Erro ao buscar música:", error);
        }
      }
    }

    fetchTrack();
    // Atualiza a cada 5 minutos
    const interval = setInterval(fetchTrack, 300000);

    return () => {
      isMounted = false;
      controller.abort();
      clearInterval(interval);
    };
  }, []);

  // Hide the whole block (heading included) until there is a track to show —
  // no empty card or spinner when Last.fm is unavailable.
  if (!track) return null;

  return (
    <div className="flex flex-col items-center justify-center mt-8">
      <h3 className="mt-6 ~text-xl/2xl font-semibold">
        {t("about.recentTrack")}
      </h3>
      <LiquidGlass variant="card" className="flex items-center space-x-4 p-4 !rounded-3xl mt-4">
        <div key={track.title} className="hero-fade-in flex items-center space-x-4">
          {track.image && (
            <Image
              src={track.image}
              alt={track.title}
              width={96}
              height={96}
              className="w-24 h-24 rounded-lg object-cover shadow-sm border dark:border-white/20 border-black/20"
              loading="lazy"
              unoptimized
            />
          )}
          <div>
            <h3 className="~text-base/xl font-semibold">{track.title}</h3>
            <p className="~text-sm/lg text-gray-600 dark:text-gray-300">
              {track.artist}
            </p>
          </div>
        </div>
      </LiquidGlass>
    </div>
  );
}

const RecentTrack = memo(RecentTrackComponent);
export default RecentTrack;
