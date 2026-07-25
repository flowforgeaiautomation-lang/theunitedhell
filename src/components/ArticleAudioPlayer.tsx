import { useEffect, useRef, useState, useCallback } from "react";
import {
  Play, Pause, Square, SkipBack, SkipForward,
  Volume2, VolumeX, Gauge, X, ChevronUp, ChevronDown,
} from "lucide-react";

declare global {
  interface Window {
    puter?: any;
  }
}

const SPEEDS = [0.5, 0.75, 1, 1.25, 1.5, 1.75, 2];

export function ArticleAudioPlayer({ articleContentRef, articleTitle }: {
  articleContentRef: React.RefObject<HTMLElement | null>;
  articleTitle: string;
}) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [speed, setSpeed] = useState(1);
  const [volume, setVolume] = useState(1);
  const [muted, setMuted] = useState(false);
  const [voice, setVoice] = useState("");
  const [voices, setVoices] = useState<string[]>([]);
  const [expanded, setExpanded] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentSentenceIdx, setCurrentSentenceIdx] = useState(-1);
  const [sentences, setSentences] = useState<string[]>([]);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState("");

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const sentenceElsRef = useRef<HTMLElement[]>([]);

  // Load saved prefs
  useEffect(() => {
    const savedSpeed = parseFloat(localStorage.getItem("tuh-tts-speed") || "1");
    const savedVoice = localStorage.getItem("tuh-tts-voice") || "";
    const savedVolume = parseFloat(localStorage.getItem("tuh-tts-volume") || "1");
    if (savedSpeed) setSpeed(savedSpeed);
    if (savedVoice) setVoice(savedVoice);
    if (savedVolume !== undefined) setVolume(savedVolume);
  }, []);

  // Load Puter.js
  useEffect(() => {
    if (window.puter) return;
    const script = document.createElement("script");
    script.src = "https://js.puter.com/v2/";
    script.async = true;
    document.head.appendChild(script);
    script.onload = () => {
      try {
        const v = window.puter?.print?.() || [];
        if (Array.isArray(v)) setVoices(v.map((x: any) => x.name || String(x)));
      } catch {}
    };
  }, []);

  const extractSentences = useCallback(() => {
    const el = articleContentRef.current;
    if (!el) return [];
    const blocks = el.querySelectorAll("p, h2, h3, blockquote, li");
    const result: string[] = [];
    blocks.forEach((block) => {
      const text = block.textContent?.trim();
      if (!text || text.length < 5) return;
      const parts = text.match(/[^.!?]+[.!?]+|\S+$/g) || [text];
      parts.forEach((p) => {
        const s = p.trim();
        if (s.length > 2) result.push(s);
      });
    });
    return result;
  }, [articleContentRef]);

  const stop = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = "";
      audioRef.current = null;
    }
    setIsPlaying(false);
    setIsPaused(false);
    setCurrentTime(0);
    setDuration(0);
    setProgress(0);
    setCurrentSentenceIdx(-1);
    setLoading(false);
    sentenceElsRef.current.forEach((el) => el?.classList?.remove("tuh-tts-highlight"));
    sentenceElsRef.current = [];
  }, []);

  const generateAndPlay = useCallback(async (startIdx: number = 0) => {
    setError("");
    if (!window.puter) {
      setError("Audio service is still loading. Please try again in a moment.");
      return;
    }
    const allSentences = extractSentences();
    if (allSentences.length === 0) {
      setError("No readable content found.");
      return;
    }
    setSentences(allSentences);
    setLoading(true);

    const fullText = allSentences.slice(startIdx).join(" ");
    try {
      const audioBlob = await window.puter.txt2speech(fullText, {
        language: "en",
        voice: voice || undefined,
      });
      if (!audioBlob) throw new Error("No audio returned");
      const url = URL.createObjectURL(audioBlob instanceof Blob ? audioBlob : new Blob([audioBlob]));
      if (audioRef.current) { audioRef.current.pause(); audioRef.current.src = ""; }
      const audio = new Audio(url);
      audio.playbackRate = speed;
      audio.volume = muted ? 0 : volume;
      audioRef.current = audio;
      audio.addEventListener("loadedmetadata", () => setDuration(audio.duration));
      audio.addEventListener("timeupdate", () => {
        setCurrentTime(audio.currentTime);
        setProgress((audio.currentTime / (audio.duration || 1)) * 100);
      });
      audio.addEventListener("ended", () => {
        stop();
      });
      await audio.play();
      setIsPlaying(true);
      setIsPaused(false);
      highlightSentence(startIdx);
    } catch (e) {
      setError("Could not generate audio. Please try again.");
      console.error("TTS error:", e);
    } finally {
      setLoading(false);
    }
  }, [extractSentences, voice, speed, volume, muted, stop]);

  const highlightSentence = useCallback((idx: number) => {
    sentenceElsRef.current.forEach((el) => el?.classList?.remove("tuh-tts-highlight"));
    setCurrentSentenceIdx(idx);
    const el = articleContentRef.current;
    if (!el) return;
    const blocks = el.querySelectorAll("p, h2, h3, blockquote, li");
    let count = 0;
    blocks.forEach((block) => {
      const text = block.textContent?.trim();
      if (!text || text.length < 5) return;
      const parts = text.match(/[^.!?]+[.!?]+|\S+$/g) || [text];
      parts.forEach((p) => {
        const s = p.trim();
        if (s.length > 2) {
          if (count === idx) {
            (block as HTMLElement).classList.add("tuh-tts-highlight");
            sentenceElsRef.current = [block as HTMLElement];
            (block as HTMLElement).scrollIntoView({ behavior: "smooth", block: "center" });
          }
          count++;
        }
      });
    });
  }, [articleContentRef]);

  const togglePlay = useCallback(() => {
    if (isPlaying && !isPaused) {
      audioRef.current?.pause();
      setIsPaused(true);
    } else if (isPlaying && isPaused) {
      audioRef.current?.play();
      setIsPaused(false);
    } else {
      generateAndPlay(0);
    }
  }, [isPlaying, isPaused, generateAndPlay]);

  const skipForward = useCallback(() => {
    if (!audioRef.current) return;
    audioRef.current.currentTime = Math.min(audioRef.current.currentTime + 15, audioRef.current.duration || 0);
  }, []);

  const skipBackward = useCallback(() => {
    if (!audioRef.current) return;
    audioRef.current.currentTime = Math.max(audioRef.current.currentTime - 15, 0);
  }, []);

  const restart = useCallback(() => {
    if (audioRef.current) audioRef.current.currentTime = 0;
  }, []);

  const changeSpeed = useCallback((s: number) => {
    setSpeed(s);
    localStorage.setItem("tuh-tts-speed", String(s));
    if (audioRef.current) audioRef.current.playbackRate = s;
  }, []);

  const changeVolume = useCallback((v: number) => {
    setVolume(v);
    setMuted(v === 0);
    localStorage.setItem("tuh-tts-volume", String(v));
    if (audioRef.current) audioRef.current.volume = v;
  }, []);

  const toggleMute = useCallback(() => {
    const next = !muted;
    setMuted(next);
    if (audioRef.current) audioRef.current.volume = next ? 0 : volume;
  }, [muted, volume]);

  const changeVoice = useCallback((v: string) => {
    setVoice(v);
    localStorage.setItem("tuh-tts-voice", v);
  }, []);

  const seek = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!audioRef.current || !audioRef.current.duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const pct = (e.clientX - rect.left) / rect.width;
    audioRef.current.currentTime = pct * audioRef.current.duration;
  }, []);

  useEffect(() => () => stop(), [stop]);

  if (minimized && !isPlaying) return null;

  const fmtTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${String(sec).padStart(2, "0")}`;
  };

  return (
    <div className={`tuh-audio-player fixed bottom-0 left-0 right-0 z-50 border-t rule bg-background shadow-2xl transition-transform duration-300 ${minimized ? "translate-y-[calc(100%-3rem)]" : "translate-y-0"}`}>
      {/* Progress bar */}
      <div className="h-1 bg-foreground/10 cursor-pointer" onClick={seek}>
        <div className="h-full bg-foreground transition-[width] duration-200" style={{ width: `${progress}%` }} />
      </div>

      <div className="container-edit px-4 py-3">
        <div className="flex items-center gap-3 md:gap-4">
          {/* Title */}
          <div className="hidden md:block flex-1 min-w-0">
            <div className="text-xs uppercase tracking-widest text-muted-foreground">Listen</div>
            <div className="text-sm font-medium truncate">{articleTitle}</div>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-1 md:gap-2">
            <button onClick={restart} className="p-2 hover:bg-foreground/[0.08] rounded-sm" aria-label="Restart" title="Restart">
              <SkipBack className="h-4 w-4" />
            </button>
            <button
              onClick={togglePlay}
              disabled={loading}
              className="p-2.5 border rule rounded-full hover:bg-foreground hover:text-background transition disabled:opacity-50"
              aria-label={isPlaying && !isPaused ? "Pause" : "Play"}
            >
              {loading ? (
                <div className="h-4 w-4 border-2 border-foreground border-t-transparent rounded-full animate-spin" />
              ) : isPlaying && !isPaused ? (
                <Pause className="h-4 w-4" />
              ) : (
                <Play className="h-4 w-4" />
              )}
            </button>
            <button onClick={stop} className="p-2 hover:bg-foreground/[0.08] rounded-sm" aria-label="Stop" title="Stop">
              <Square className="h-4 w-4" />
            </button>
            <button onClick={skipForward} className="p-2 hover:bg-foreground/[0.08] rounded-sm" aria-label="Skip forward 15s" title="Skip forward 15s">
              <SkipForward className="h-4 w-4" />
            </button>
          </div>

          {/* Time */}
          <div className="hidden sm:flex items-center gap-1 text-xs tabular-nums text-muted-foreground">
            <span>{fmtTime(currentTime)}</span>
            <span>/</span>
            <span>{fmtTime(duration)}</span>
          </div>

          {/* Speed */}
          <div className="hidden md:flex items-center gap-1">
            <Gauge className="h-4 w-4 text-muted-foreground" />
            <select
              value={speed}
              onChange={(e) => changeSpeed(parseFloat(e.target.value))}
              className="bg-background border rule px-1 py-1 text-xs rounded-sm"
              aria-label="Playback speed"
            >
              {SPEEDS.map((s) => <option key={s} value={s}>{s}x</option>)}
            </select>
          </div>

          {/* Volume */}
          <div className="hidden lg:flex items-center gap-2">
            <button onClick={toggleMute} className="p-1 hover:bg-foreground/[0.08] rounded-sm" aria-label="Mute">
              {muted || volume === 0 ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
            </button>
            <input
              type="range"
              min={0}
              max={1}
              step={0.1}
              value={muted ? 0 : volume}
              onChange={(e) => changeVolume(parseFloat(e.target.value))}
              className="w-16 accent-foreground"
              aria-label="Volume"
            />
          </div>

          {/* Voice */}
          {voices.length > 0 && (
            <select
              value={voice}
              onChange={(e) => changeVoice(e.target.value)}
              className="hidden lg:block bg-background border rule px-2 py-1 text-xs rounded-sm max-w-32"
              aria-label="Voice"
            >
              <option value="">Default voice</option>
              {voices.map((v) => <option key={v} value={v}>{v}</option>)}
            </select>
          )}

          {/* Expand/minimize */}
          <button onClick={() => setMinimized(!minimized)} className="p-2 hover:bg-foreground/[0.08] rounded-sm" aria-label="Minimize">
            {minimized ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </button>
          <button onClick={() => setExpanded(!expanded)} className="p-2 hover:bg-foreground/[0.08] rounded-sm md:hidden" aria-label="More">
            <X className="h-4 w-4" />
          </button>
        </div>

        {error && (
          <div className="mt-2 text-xs text-red-500">{error}</div>
        )}

        {/* Current sentence indicator */}
        {isPlaying && currentSentenceIdx >= 0 && (
          <div className="mt-2 text-xs text-muted-foreground italic truncate hidden md:block">
            {sentences[currentSentenceIdx] || ""}
          </div>
        )}
      </div>
    </div>
  );
}
