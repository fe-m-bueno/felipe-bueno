"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

type Track = {
  title: string;
  artist: string;
  image?: string;
};

export default function RecentTrack() {
  const [track, setTrack] = useState<Track | null>(null);

  useEffect(() => {
    async function fetchTrack() {
      try {
        const res = await fetch("/api/lastfm");
        if (!res.ok) throw new Error("Erro ao buscar música");

        const data = await res.json();
        setTrack({
          title: data.title,
          artist: data.artist,
          image: data.image || "/placeholder-album.png",
        });
      } catch (error) {
        console.error("Erro ao buscar música:", error);
      }
    }

    fetchTrack();
    const interval = setInterval(fetchTrack, 300000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center space-x-4 p-4 bg-white/[3%] border dark:border-white/20 border-black/20  backdrop-blur-3xl rounded-3xl shadow-lg mt-4 ">
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
            <img
              src={track.image}
              alt={track.title}
              className="w-24 h-24 rounded-lg object-cover shadow-sm border dark:border-white/20 border-black/20"
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
    </div>
  );
}
