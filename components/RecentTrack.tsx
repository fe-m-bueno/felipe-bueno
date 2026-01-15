"use client";

import { useEffect, useState, memo } from "react";
import { motion, AnimatePresence } from "motion/react";
import Image from "next/image";
import LiquidGlass from "./LiquidGlass";

type Track = {
  title: string;
  artist: string;
  image?: string;
};

function RecentTrackComponent() {
  const [track, setTrack] = useState<Track | null>(null);

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    async function fetchTrack() {
      try {
        const res = await fetch("/api/lastfm", { 
          signal: controller.signal,
          // Cache por 5 minutos no cliente
          next: { revalidate: 300 }
        });
        if (!res.ok) throw new Error("Erro ao buscar música");

        const data = await res.json();
        if (isMounted) {
          setTrack({
            title: data.title,
            artist: data.artist,
            image: data.image || "/placeholder-album.png",
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

  return (
    <LiquidGlass variant="card" className="flex items-center space-x-4 p-4 !rounded-3xl mt-4">
      <AnimatePresence mode="wait">
        {track && (
          <motion.div
            key={track.title}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center space-x-4"
          >
            <Image
              src={track.image || "/placeholder-album.png"}
              alt={track.title}
              width={96}
              height={96}
              className="w-24 h-24 rounded-lg object-cover shadow-sm border dark:border-white/20 border-black/20"
              loading="lazy"
              unoptimized={track.image?.startsWith('http')}
            />
            <div>
              <h3 className="~text-base/xl font-semibold">{track.title}</h3>
              <p className="~text-sm/lg text-gray-600 dark:text-gray-300">
                {track.artist}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </LiquidGlass>
  );
}

const RecentTrack = memo(RecentTrackComponent);
export default RecentTrack;
