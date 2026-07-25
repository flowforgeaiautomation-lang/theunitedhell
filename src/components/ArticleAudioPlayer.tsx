import { useEffect, useRef, useState, useCallback } from "react";
import {
  Play, Pause, Square, SkipBack, SkipForward,
  Volume2, VolumeX, Gauge, ChevronUp, ChevronDown,
} from "lucide-react";

const SPEEDS = [0.5, 0.75, 1, 1.25, 1.5, 1.75, 2];

type VoiceOption = { name: string; lang: string };

export function ArticleAudioPlayer({ articleContentRef, articleTitle }: {
  articleContentRef: React.RefObject<HTMLElement | null>;
  articleTitle: string;
}) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [volume, setVolume] = useState(1);
  const [muted, setMuted] = useState(false);
  const [voiceURI, setVoiceURI] = useState("");
  const [voices, setVoices] = useState<VoiceOption[]>([]);
  const [minimized, setMinimized] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentIdx, setCurrentIdx] = useState(-1);
  const [sentences, setSentences] = useState<string[]>([]);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState("");

  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const highlightElsRef = useRef<HTMLElement[]>([]);

  // Load saved prefs
  useEffect(() => {
    const savedSpeed = parseFloat(localStorage.getItem("tuh-tts-speed") || "1");
    const savedVoice = localStorage.getItem("tuh-tts-voice") || "";
    const savedVolume = parseFloat(localStorage.getItem("tuh-tts-volume") || "1");
    if (savedSpeed) setSpeed(savedSpeed);
    if (savedVoice) setVoiceURI(savedVoice);
    if (!isNaN(savedVolume)) setVolume(savedVolume);
  }, []);

  // Load voices (browser speechSynthesis)
  useEffect(() => {
    function loadVoices() {
      const v = window.speechSynthesis?.getVoices() || [];
      const opts = v
        .filter((voice) => voice.lang.startsWith("en"))
        .map((voice) => ({ name: voice.name, lang: voice.lang, uri: (voice as any).voiceURI }));
      setVoices(opts);
    }
    loadVoices();
    window.speechSynthesis?.addEventListener?.("voiceschanged", loadVoices);
    return () => window.speechSynthesis?.removeEventListener?.("voiceschanged", loadVoices);
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

  const clearHighlights = useCallback(() => {
    highlightElsRef.current.forEach((el) => el?.classList?.remove("tuh-tts-highlight"));
    highlightElsRef.current = [];
  }, []);

  const stop = useCallback(() => {
    window.speechSynthesis?.cancel();
    utteranceRef.current = null;
    setIsPlaying(false);
    setIsPaused(false);
    setProgress(0);
    setCurrentIdx(-1);
    setLoading(false);
    clearHighlights();
  }, [clearHighlights]);

  const highlightSentence = useCallback((idx: number) => {
    clearHighlights();
    setCurrentIdx(idx);
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
            highlightElsRef.current = [block as HTMLElement];
            (block as HTMLElement).scrollIntoView({ behavior: "smooth", block: "center" });
          }
          count++;
        }
      });
    });
  }, [articleContentRef, clearHighlights]);

  const speakFrom = useCallback((startIdx: number) => {
    const allSentences = extractSentences();
    if (allSentences.length === 0) {
      setError("No readable content found.");
      return;
    }
    setSentences(allSentences);

    window.speechSynthesis?.cancel();
    clearHighlights();

    let idx = startIdx;
    const speakNext = () => {
      if (idx >= allSentences.length) {
        stop();
        return;
      }
      const text = allSentences[idx];
      const utter = new SpeechSynthesisUtterance(text);
      utter.rate = speed;
      utter.volume = muted ? 0 : volume;
      utter.lang = "en-US";

      const allVoices = window.speechSynthesis?.getVoices() || [];
      const selected = allVoices.find((v) => (v as any).voiceURI === voiceURI);
      if (selected) utter.voice = selected;

      utter.onstart = () => {
        setIsPlaying(true);
        setIsPaused(false);
        setLoading(false);
        highlightSentence(idx);
      };
      utter.onend = () => {
        idx++;
        setProgress((idx / allSentences.length) * 100);
        speakNext();
      };
      utter.onerror = (e) => {
        if ((e as any).error !== "canceled" && (e as any).error !== "interrupted") {
          setError("Audio playback error. Try again.");
        }
        setIsPlaying(false);
        setLoading(false);
      };

      utteranceRef.current = utter;
      window.speechSynthesis?.speak(utter);
    };

    setLoading(true);
    setError("");
    speakNext();
  }, [extractSentences, speed, volume, muted, voiceURI, highlightSentence, clearHighlights, stop]);

  const togglePlay = useCallback(() => {
    if (isPlaying && !isPaused) {
      window.speechSynthesis?.pause();
      setIsPaused(true);
    } else if (isPlaying && isPaused) {
      window.speechSynthesis?.resume();
      setIsPaused(false);
    } else {
      speakFrom(0);
    }
  }, [isPlaying, isPaused, speakFrom]);

  const skipForward = useCallback(() => {
    if (!sentences.length) return;
    const nextIdx = Math.min(currentIdx + 1, sentences.length - 1);
    window.speechSynthesis?.cancel();
    speakFrom(nextIdx);
  }, [currentIdx, sentences.length, speakFrom]);

  const skipBackward = useCallback(() => {
    if (!sentences.length) return;
    const prevIdx = Math.max(currentIdx - 1, 0);
    window.speechSynthesis?.cancel();
    speakFrom(prevIdx);
  }, [currentIdx, speakFrom]);

  const changeSpeed = useCallback((s: number) => {
    setSpeed(s);
    localStorage.setItem("tuh-tts-speed", String(s));
    if (utteranceRef.current) {
      // Can't change rate mid-utterance; restart from current position
      window.speechSynthesis?.cancel();
      speakFrom(currentIdx >= 0 ? currentIdx : 0);
    }
  }, [currentIdx, speakFrom]);

  const changeVolume = useCallback((v: number) => {
    setVolume(v);
    setMuted(v === 0);
    localStorage.setItem("tuh-tts-volume", String(v));
  }, []);

  const toggleMute = useCallback(() => {
    const next = !muted;
    setMuted(next);
    if (utteranceRef.current) {
      // Restart from current position with new volume
      window.speechSynthesis?.cancel();
      speakFrom(currentIdx >= 0 ? currentIdx : 0);
    }
  }, [muted, currentIdx, speakFrom]);

  const changeVoice = useCallback((uri: string) => {
    setVoiceURI(uri);
    localStorage.setItem("tuh-tts-voice", uri);
    if (isPlaying) {
      window.speechSynthesis?.cancel();
      speakFrom(currentIdx >= 0 ? currentIdx : 0);
    }
  }, [isPlaying, currentIdx, speakFrom]);

  useEffect(() => () => stop(), [stop]);

  if (minimized && !isPlaying) return null;

  const fmtPct = Math.round(progress);

  return (
    <div className={`tuh-audio-player fixed bottom-0 left-0 right-0 z-50 border-t rule bg-background shadow-2xl transition-transform duration-300 ${minimized ? "translate-y-[calc(100%-3rem)]" : "translate-y-0"}`}>
      <div className="h-1 bg-foreground/10">
        <div className="h-full bg-foreground transition-[width] duration-200" style={{ width: `${progress}%` }} />
      </div>

      <div className="container-edit px-4 py-3">
        <div className="flex items-center gap-3 md:gap-4">
          <div className="hidden md:block flex-1 min-w-0">
            <div className="text-xs uppercase tracking-widest text-muted-foreground">Listen</div>
            <div className="text-sm font-medium truncate">{articleTitle}</div>
          </div>

          <div className="flex items-center gap-1 md:gap-2">
            <button onClick={skipBackward} disabled={!isPlaying} className="p-2 hover:bg-foreground/[0.08] rounded-sm disabled:opacity-30" aria-label="Previous sentence" title="Previous sentence">
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
            <button onClick={skipForward} disabled={!isPlaying} className="p-2 hover:bg-foreground/[0.08] rounded-sm disabled:opacity-30" aria-label="Next sentence" title="Next sentence">
              <SkipForward className="h-4 w-4" />
            </button>
          </div>

          <div className="hidden sm:flex items-center gap-1 text-xs tabular-nums text-muted-foreground">
            <span>{currentIdx >= 0 ? currentIdx + 1 : 0}</span>
            <span>/</span>
            <span>{sentences.length}</span>
          </div>

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

          {voices.length > 0 && (
            <select
              value={voiceURI}
              onChange={(e) => changeVoice(e.target.value)}
              className="hidden lg:block bg-background border rule px-2 py-1 text-xs rounded-sm max-w-40"
              aria-label="Voice"
            >
              <option value="">Default voice</option>
              {voices.map((v) => <option key={v.name} value={v.name}>{v.name}</option>)}
            </select>
          )}

          <button onClick={() => setMinimized(!minimized)} className="p-2 hover:bg-foreground/[0.08] rounded-sm" aria-label="Minimize">
            {minimized ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </button>
        </div>

        {error && (
          <div className="mt-2 text-xs text-red-500">{error}</div>
        )}

        {isPlaying && currentIdx >= 0 && (
          <div className="mt-2 text-xs text-muted-foreground italic truncate hidden md:block">
            {sentences[currentIdx] || ""}
          </div>
        )}

        {isPlaying && (
          <div className="mt-1 text-[10px] text-muted-foreground/60 hidden sm:block">{fmtPct}% complete</div>
        )}
      </div>
    </div>
  );
}
