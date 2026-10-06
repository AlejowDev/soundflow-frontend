import { createContext, ReactNode, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { setAudioModeAsync, useAudioPlayer, useAudioPlayerStatus } from 'expo-audio';
import { mediaUrl } from '../config/environment';
import { Song } from '../types';

interface PlayerContextValue {
  queue: Song[];
  current: Song | null;
  isPlaying: boolean;
  position: number;
  duration: number;
  setQueue: (songs: Song[]) => void;
  playSong: (song: Song) => void;
  togglePlay: () => void;
  next: () => void;
  previous: () => void;
  seek: (seconds: number) => void;
  stop: () => void;
  repeat: boolean;
  shuffle: boolean;
  toggleRepeat: () => void;
  toggleShuffle: () => void;
}

const PlayerContext = createContext<PlayerContextValue | null>(null);

/** Un único reproductor para toda la app: la música sigue sonando al cambiar de sección. */
export function PlayerProvider({ children }: { children: ReactNode }) {
  const player = useAudioPlayer(null, { updateInterval: 500 });
  const status = useAudioPlayerStatus(player);
  const [queue, setQueueState] = useState<Song[]>([]);
  const [index, setIndex] = useState(-1);
  const [repeat, setRepeat] = useState(false);
  const [shuffle, setShuffle] = useState(false);
  const queueRef = useRef<Song[]>([]);

  useEffect(() => {
    setAudioModeAsync({ playsInSilentMode: true }).catch(() => {});
  }, []);

  const playAt = useCallback(
    (i: number) => {
      const song = queueRef.current[i];
      if (!song) return;
      player.replace({ uri: mediaUrl(song.audioUrl), name: song.title });
      player.play();
      setIndex(i);
    },
    [player],
  );

  const setQueue = useCallback((songs: Song[]) => {
    queueRef.current = songs;
    setQueueState(songs);
  }, []);

  const playSong = useCallback(
    (song: Song) => playAt(queueRef.current.findIndex((s) => s.id === song.id)),
    [playAt],
  );

  const next = useCallback(() => {
    const len = queueRef.current.length;
    if (!len) return;
    if (shuffle && len > 1) {
      // Aleatorio: cualquier canción distinta de la actual.
      let i = index;
      while (i === index) i = Math.floor(Math.random() * len);
      playAt(i);
    } else {
      playAt((index + 1) % len);
    }
  }, [index, playAt, shuffle]);

  const previous = useCallback(() => {
    const len = queueRef.current.length;
    if (!len) return;
    // Como en Spotify: si ya avanzó unos segundos, "anterior" reinicia la canción.
    if (index >= 0 && player.currentTime > 3) player.seekTo(0);
    else playAt((index - 1 + len) % len);
  }, [index, playAt, player]);

  const togglePlay = useCallback(() => {
    if (index < 0) return playAt(0);
    if (player.playing) player.pause();
    else player.play();
  }, [index, playAt, player]);

  const seek = useCallback((seconds: number) => player.seekTo(seconds), [player]);

  const stop = useCallback(() => {
    player.pause();
    setIndex(-1);
  }, [player]);

  const toggleRepeat = useCallback(() => setRepeat((r) => !r), []);
  const toggleShuffle = useCallback(() => setShuffle((v) => !v), []);

  useEffect(() => {
    if (!status.didJustFinish) return;
    // Repetir: vuelve a sonar la misma canción; si no, pasa a la siguiente.
    if (repeat) {
      player.seekTo(0);
      player.play();
    } else {
      next();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status.didJustFinish]);

  return (
    <PlayerContext.Provider
      value={{
        queue,
        current: index >= 0 ? queue[index] ?? null : null,
        isPlaying: status.playing,
        position: status.currentTime,
        duration: status.duration,
        setQueue,
        playSong,
        togglePlay,
        next,
        previous,
        seek,
        stop,
        repeat,
        shuffle,
        toggleRepeat,
        toggleShuffle,
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
}

export function usePlayer() {
  const ctx = useContext(PlayerContext);
  if (!ctx) throw new Error('usePlayer debe usarse dentro de <PlayerProvider>');
  return ctx;
}
