import {
  createContext,
  type RefObject,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  AudioLines,
  ChevronDown,
  ChevronUp,
  Pause,
  Play,
  Shuffle,
  SkipBack,
  SkipForward,
  X,
} from "lucide-react";
import clsx from "clsx";
import musicData from "~/data/music.json";

export type MusicTrack = (typeof musicData)[number];

type PlayMode = "shuffle" | "sequence";

type MusicPlayerContextValue = {
  tracks: MusicTrack[];
  currentTrack: MusicTrack | null;
  isPlaying: boolean;
  showMini: boolean;
  showFull: boolean;
  mode: PlayMode;
  playTrack: (track: MusicTrack) => void;
  togglePlay: () => void;
  playNext: () => void;
  playPrevious: () => void;
  openMini: () => void;
  closeMini: () => void;
  toggleFull: () => void;
  setMode: (mode: PlayMode) => void;
};

const MusicPlayerContext = createContext<MusicPlayerContextValue | null>(null);

const STORAGE_KEY = "music-player-state";

export function MusicPlayerProvider({ children }: { children: React.ReactNode }) {
  const tracks = useMemo(() => musicData as MusicTrack[], []);
  const [currentTrackId, setCurrentTrackId] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showMini, setShowMini] = useState(false);
  const [showFull, setShowFull] = useState(false);
  const [mode, setMode] = useState<PlayMode>("shuffle");
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [playbackError, setPlaybackError] = useState<string | null>(null);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const dataArrayRef = useRef<Uint8Array | null>(null);

  const currentTrack = useMemo(
    () => tracks.find((track) => track.id === currentTrackId) ?? null,
    [tracks, currentTrackId],
  );

  useEffect(() => {
    if (typeof window === "undefined") return;
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    try {
      const parsed = JSON.parse(raw) as {
        currentTrackId?: string;
        history?: string[];
        historyIndex?: number;
        mode?: PlayMode;
      };
      if (parsed.currentTrackId) setCurrentTrackId(parsed.currentTrackId);
      if (parsed.history) setHistory(parsed.history);
      if (typeof parsed.historyIndex === "number") {
        setHistoryIndex(parsed.historyIndex);
      }
      if (parsed.mode) setMode(parsed.mode);
      if (parsed.currentTrackId) setShowMini(true);
    } catch (error) {
      console.warn("Failed to restore music player state.");
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        currentTrackId,
        history,
        historyIndex,
        mode,
      }),
    );
  }, [currentTrackId, history, historyIndex, mode]);

  useEffect(() => {
    if (typeof document === "undefined") return;
    document.documentElement.style.setProperty(
      "--player-offset",
      showMini && !showFull ? "16rem" : "0px",
    );
  }, [showMini, showFull]);

  const ensureAudioContext = () => {
    if (!audioRef.current) return;
    if (!audioContextRef.current) {
      try {
        const context = new AudioContext();
        const source = context.createMediaElementSource(audioRef.current);
        const analyser = context.createAnalyser();
        analyser.fftSize = 256;
        const bufferLength = analyser.frequencyBinCount;
        dataArrayRef.current = new Uint8Array(bufferLength);
        source.connect(analyser);
        analyser.connect(context.destination);
        audioContextRef.current = context;
        analyserRef.current = analyser;
      } catch (error) {
        console.warn("Audio visualizer unavailable.", error);
      }
    }

    if (audioContextRef.current?.state === "suspended") {
      void audioContextRef.current.resume();
    }
  };

  const startPlayback = (track: MusicTrack) => {
    if (!track.previewUrl || !audioRef.current) return;
    setPlaybackError(null);
    ensureAudioContext();
    audioRef.current.src = track.previewUrl;
    audioRef.current.load();
    audioRef.current
      .play()
      .then(() => setIsPlaying(true))
      .catch((error) => {
        setIsPlaying(false);
        setPlaybackError("Audio playback failed. Check preview URL access.");
        console.warn("Playback error", error);
      });
  };

  const playTrack = (track: MusicTrack) => {
    if (!track.previewUrl) return;
    if (currentTrackId === track.id) {
      togglePlay();
      return;
    }
    setCurrentTrackId(track.id);
    setHistory((prev) => {
      const next = [...prev, track.id];
      setHistoryIndex(next.length - 1);
      return next.slice(-100);
    });
    startPlayback(track);
    setShowMini(true);
  };

  const playPrevious = () => {
    if (historyIndex > 0) {
      const previousId = history[historyIndex - 1];
      const previousTrack = tracks.find((track) => track.id === previousId);
      if (previousTrack) {
        setHistoryIndex(historyIndex - 1);
        setCurrentTrackId(previousId);
        startPlayback(previousTrack);
        return;
      }
    }
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
    }
  };

  const playNext = () => {
    if (historyIndex >= 0 && historyIndex < history.length - 1) {
      const nextId = history[historyIndex + 1];
      const nextTrack = tracks.find((track) => track.id === nextId);
      if (nextTrack) {
        setHistoryIndex(historyIndex + 1);
        setCurrentTrackId(nextId);
        startPlayback(nextTrack);
        return;
      }
    }

    const nextTrack =
      mode === "sequence"
        ? getNextSequentialTrack(tracks, currentTrackId)
        : getRandomTrack(tracks, currentTrackId);

    if (!nextTrack) return;
    setCurrentTrackId(nextTrack.id);
    setHistory((prev) => {
      const next = [...prev, nextTrack.id];
      setHistoryIndex(next.length - 1);
      return next.slice(-100);
    });
    startPlayback(nextTrack);
  };

  const togglePlay = () => {
    if (!currentTrack) return;
    if (!audioRef.current) return;
    ensureAudioContext();

    if (audioRef.current.paused) {
      audioRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch((error) => {
          setIsPlaying(false);
          setPlaybackError("Audio playback failed. Check preview URL access.");
          console.warn("Playback error", error);
        });
      setShowMini(true);
    } else {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  const openMini = () => setShowMini(true);
  const closeMini = () => setShowMini(false);
  const toggleFull = () => setShowFull((prev) => !prev);

  const value: MusicPlayerContextValue = {
    tracks,
    currentTrack,
    isPlaying,
    showMini,
    showFull,
    mode,
    playTrack,
    togglePlay,
    playNext,
    playPrevious,
    openMini,
    closeMini,
    toggleFull,
    setMode,
  };

  return (
    <MusicPlayerContext.Provider value={value}>
      {children}
      <MiniPlayer
        track={currentTrack}
        isPlaying={isPlaying}
        playbackError={playbackError}
        mode={mode}
        showMini={showMini}
        showFull={showFull}
        onClose={closeMini}
        onToggleFull={toggleFull}
        onTogglePlay={togglePlay}
        onNext={playNext}
        onPrev={playPrevious}
        onModeChange={setMode}
        analyserRef={analyserRef}
        dataArrayRef={dataArrayRef}
      />
      <FullPlayer
        track={currentTrack}
        isPlaying={isPlaying}
        playbackError={playbackError}
        mode={mode}
        open={showFull}
        onClose={toggleFull}
        onTogglePlay={togglePlay}
        onNext={playNext}
        onPrev={playPrevious}
        onModeChange={setMode}
        analyserRef={analyserRef}
        dataArrayRef={dataArrayRef}
      />
      <audio
        ref={audioRef}
        crossOrigin="anonymous"
        preload="auto"
        onEnded={() => playNext()}
        onPause={() => setIsPlaying(false)}
        onPlay={() => setIsPlaying(true)}
        onError={() => setPlaybackError("Audio source error.")}
      />
    </MusicPlayerContext.Provider>
  );
}

export function useMusicPlayer() {
  const context = useContext(MusicPlayerContext);
  if (!context) {
    throw new Error("useMusicPlayer must be used within MusicPlayerProvider.");
  }
  return context;
}

function MiniPlayer({
  track,
  isPlaying,
  playbackError,
  mode,
  showMini,
  showFull,
  onClose,
  onToggleFull,
  onTogglePlay,
  onNext,
  onPrev,
  onModeChange,
  analyserRef,
  dataArrayRef,
}: {
  track: MusicTrack | null;
  isPlaying: boolean;
  playbackError: string | null;
  mode: PlayMode;
  showMini: boolean;
  showFull: boolean;
  onClose: () => void;
  onToggleFull: () => void;
  onTogglePlay: () => void;
  onNext: () => void;
  onPrev: () => void;
  onModeChange: (mode: PlayMode) => void;
  analyserRef: RefObject<AnalyserNode | null>;
  dataArrayRef: RefObject<Uint8Array | null>;
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const isVisible = showMini && track && !showFull;

  useAudioVisualizer(
    canvasRef,
    analyserRef,
    dataArrayRef,
    {
      intensity: 0.55,
      color: "rgba(255,255,255,0.6)",
      glow: "rgba(255,120,80,0.25)",
    },
    isVisible,
  );

  return (
    <div
      className={clsx(
        "music-player fixed bottom-[150px] left-1/2 z-40 w-[min(92vw,980px)] -translate-x-1/2 rounded-[2rem] border border-white/10 bg-black/70 px-5 py-4 shadow-[0_30px_70px_-40px_rgba(0,0,0,0.9)] backdrop-blur transition duration-300",
        isVisible
          ? "translate-y-0 opacity-100"
          : "translate-y-24 opacity-0 pointer-events-none",
      )}
    >
      <div className="absolute inset-0 -z-10 rounded-[2rem] bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.12),transparent_55%)]" />
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-1 items-center gap-4">
          <div
            className="relative h-16 w-16 overflow-hidden rounded-2xl border border-white/10"
            style={{
              backgroundImage: track?.coverUrl
                ? undefined
                : track?.palette
                  ? `linear-gradient(140deg, ${track.palette[0]}, ${track.palette[1]})`
                  : "linear-gradient(140deg, rgba(255,255,255,0.2), rgba(255,255,255,0.05))",
            }}
          >
            {track?.coverUrl ? (
              <img
                src={track.coverUrl}
                alt={track.album}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-xs uppercase tracking-[0.2em] text-white/70">
                {(track?.title ?? "").slice(0, 3).toUpperCase()}
              </div>
            )}
          </div>
          <div className="space-y-1">
            <p className="text-[0.6rem] uppercase tracking-[0.3em] text-white/50">
              Now playing
            </p>
            <p className="text-sm font-semibold text-[color:var(--color-ink)]">
              {track?.title ?? ""}
            </p>
            <p className="text-xs text-white/60">
              {track ? `${track.artist} - ${track.album}` : ""}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => onModeChange(mode === "shuffle" ? "sequence" : "shuffle")}
            className={clsx(
              "pressable flex items-center gap-2 rounded-full border px-3 py-2 text-xs uppercase tracking-[0.22em] transition",
              mode === "shuffle"
                ? "border-[color:var(--color-brand)]/60 bg-[color:var(--color-brand)]/15 text-white"
                : "border-white/10 text-white/60 hover:border-white/40 hover:text-white",
            )}
          >
            <Shuffle size={14} />
            {mode === "shuffle" ? "Shuffle" : "Queue"}
          </button>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onPrev}
              className="pressable rounded-full border border-white/10 bg-white/5 p-2 text-white/70 hover:border-white/40 hover:text-white"
              aria-label="Previous"
            >
              <SkipBack size={16} />
            </button>
            <button
              type="button"
              onClick={onTogglePlay}
              className="pressable rounded-full border border-white/20 bg-white/10 p-3 text-white hover:border-white/40"
              aria-label={isPlaying ? "Pause" : "Play"}
            >
              {isPlaying ? <Pause size={18} /> : <Play size={18} />}
            </button>
            <button
              type="button"
              onClick={onNext}
              className="pressable rounded-full border border-white/10 bg-white/5 p-2 text-white/70 hover:border-white/40 hover:text-white"
              aria-label="Next"
            >
              <SkipForward size={16} />
            </button>
          </div>
          <button
            type="button"
            onClick={onToggleFull}
            className="pressable flex items-center gap-2 rounded-full border border-white/10 bg-black/40 px-3 py-2 text-xs uppercase tracking-[0.22em] text-white/60 transition hover:border-white/40 hover:text-white"
          >
            {showFull ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
            {showFull ? "Collapse" : "Expand"}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="pressable rounded-full border border-white/10 bg-black/40 p-2 text-white/60 transition hover:border-white/40 hover:text-white"
            aria-label="Hide player"
          >
            <X size={14} />
          </button>
        </div>
      </div>
      <div className="mt-4 flex items-center gap-3">
        <AudioLines size={16} className="text-white/60" />
        <canvas ref={canvasRef} className="h-6 w-full" />
      </div>
      {playbackError ? (
        <p className="mt-3 text-xs text-white/50">{playbackError}</p>
      ) : null}
    </div>
  );
}

function FullPlayer({
  track,
  isPlaying,
  playbackError,
  mode,
  open,
  onClose,
  onTogglePlay,
  onNext,
  onPrev,
  onModeChange,
  analyserRef,
  dataArrayRef,
}: {
  track: MusicTrack | null;
  isPlaying: boolean;
  playbackError: string | null;
  mode: PlayMode;
  open: boolean;
  onClose: () => void;
  onTogglePlay: () => void;
  onNext: () => void;
  onPrev: () => void;
  onModeChange: (mode: PlayMode) => void;
  analyserRef: RefObject<AnalyserNode | null>;
  dataArrayRef: RefObject<Uint8Array | null>;
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useAudioVisualizer(
    canvasRef,
    analyserRef,
    dataArrayRef,
    {
      intensity: 1,
      color: "rgba(255,255,255,0.9)",
      glow: "rgba(255,120,80,0.4)",
    },
    open,
  );

  return (
    <div
      className={clsx(
        "fixed inset-0 z-50 flex flex-col justify-between bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.1),transparent_55%)] px-8 py-10 backdrop-blur",
        open
          ? "pointer-events-auto opacity-100"
          : "pointer-events-none opacity-0",
      )}
    >
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(160deg,rgba(7,5,15,0.95),rgba(12,8,20,0.9))]" />
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <p className="text-xs uppercase tracking-[0.3em] text-white/50">
            Full Player
          </p>
          <h2 className="font-[var(--font-display)] text-3xl text-[color:var(--color-ink)]">
            {track?.title ?? ""}
          </h2>
          <p className="text-sm text-white/60">
            {track ? `${track.artist} - ${track.album}` : ""}
          </p>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="pressable flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs uppercase tracking-[0.28em] text-white/70 hover:border-white/40 hover:text-white"
        >
          <ChevronDown size={16} />
          Close
        </button>
      </div>

      <div className="flex flex-1 flex-col items-center justify-center gap-8">
        <div
          className="h-72 w-72 overflow-hidden rounded-[2.5rem] border border-white/10 shadow-[0_40px_80px_-50px_rgba(0,0,0,0.8)]"
          style={{
            backgroundImage: track?.coverUrl
              ? undefined
              : track?.palette
                ? `linear-gradient(140deg, ${track.palette[0]}, ${track.palette[1]})`
                : "linear-gradient(140deg, rgba(255,255,255,0.2), rgba(255,255,255,0.05))",
          }}
        >
          {track?.coverUrl ? (
            <img
              src={track.coverUrl}
              alt={track.album}
              className="h-full w-full object-cover"
            />
          ) : null}
        </div>
        <canvas ref={canvasRef} className="h-36 w-full max-w-3xl" />
      </div>

      <div className="flex flex-col items-center gap-4">
        <div className="flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => onModeChange(mode === "shuffle" ? "sequence" : "shuffle")}
            className={clsx(
              "pressable flex items-center gap-2 rounded-full border px-3 py-2 text-xs uppercase tracking-[0.22em] transition",
              mode === "shuffle"
                ? "border-[color:var(--color-brand)]/60 bg-[color:var(--color-brand)]/15 text-white"
                : "border-white/10 text-white/60 hover:border-white/40 hover:text-white",
            )}
          >
            <Shuffle size={14} />
            {mode === "shuffle" ? "Shuffle" : "Queue"}
          </button>
          <button
            type="button"
            onClick={onPrev}
            className="pressable rounded-full border border-white/10 bg-white/5 p-3 text-white/70 hover:border-white/40 hover:text-white"
            aria-label="Previous"
          >
            <SkipBack size={18} />
          </button>
          <button
            type="button"
            onClick={onTogglePlay}
            className="pressable rounded-full border border-white/20 bg-white/10 p-4 text-white hover:border-white/40"
            aria-label={isPlaying ? "Pause" : "Play"}
          >
            {isPlaying ? <Pause size={20} /> : <Play size={20} />}
          </button>
          <button
            type="button"
            onClick={onNext}
            className="pressable rounded-full border border-white/10 bg-white/5 p-3 text-white/70 hover:border-white/40 hover:text-white"
            aria-label="Next"
          >
            <SkipForward size={18} />
          </button>
        </div>
        {playbackError ? (
          <p className="text-xs text-white/50">{playbackError}</p>
        ) : null}
        <p className="text-xs uppercase tracking-[0.26em] text-white/50">
          {track?.genres?.[0] ?? ""}
        </p>
      </div>
    </div>
  );
}

function useAudioVisualizer(
  canvasRef: RefObject<HTMLCanvasElement | null>,
  analyserRef: RefObject<AnalyserNode | null>,
  dataArrayRef: RefObject<Uint8Array | null>,
  {
    intensity,
    color,
    glow,
  }: { intensity: number; color: string; glow: string },
  enabled: boolean,
) {
  useEffect(() => {
    if (!enabled) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext("2d");
    if (!context) return;

    let animationFrame = 0;

    const draw = () => {
      const analyser = analyserRef.current;
      const dataArray = dataArrayRef.current;

      const width = canvas.clientWidth;
      const height = canvas.clientHeight;

      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
      }

      context.clearRect(0, 0, width, height);

      if (analyser && dataArray) {
        analyser.getByteFrequencyData(dataArray);
        const barWidth = width / dataArray.length;
        for (let i = 0; i < dataArray.length; i += 1) {
          const value = dataArray[i] / 255;
          const barHeight = value * height * intensity;
          const x = i * barWidth;
          context.fillStyle = color;
          context.fillRect(x, height - barHeight, barWidth * 0.8, barHeight);
        }
      } else {
        context.fillStyle = color;
        context.globalAlpha = 0.3;
        context.fillRect(0, height * 0.6, width, height * 0.4);
        context.globalAlpha = 1;
      }

      context.shadowColor = glow;
      context.shadowBlur = 18;
      animationFrame = window.requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.cancelAnimationFrame(animationFrame);
    };
  }, [canvasRef, analyserRef, dataArrayRef, intensity, color, glow, enabled]);
}

function getRandomTrack(tracks: MusicTrack[], currentId: string | null) {
  const candidates = tracks.filter((track) => track.previewUrl);
  if (candidates.length === 0) return null;
  const pool = candidates.filter((track) => track.id !== currentId);
  return pool[Math.floor(Math.random() * pool.length)] ?? candidates[0];
}

function getNextSequentialTrack(
  tracks: MusicTrack[],
  currentId: string | null,
) {
  const playable = tracks.filter((track) => track.previewUrl);
  if (playable.length === 0) return null;
  if (!currentId) return playable[0];
  const index = playable.findIndex((track) => track.id === currentId);
  if (index === -1) return playable[0];
  return playable[(index + 1) % playable.length];
}
