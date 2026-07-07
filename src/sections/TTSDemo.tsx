import { useState, useEffect, useRef, useCallback } from "react";
import { Play, Pause, Square, Volume2, Languages, Mic2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useScrollReveal } from "@/hooks/use-scroll-reveal";

// ============== 预设文本示例 ==============

const PRESETS = [
  {
    lang: "zh-CN",
    label: "中文",
    text: "挠荔枝 Knowledge 是一款 iOS 有声阅读器。支持 PDF、EPUB、Word、网页等九种格式导入，十八种语言智能朗读，让您随时随地用耳朵阅读。",
  },
  {
    lang: "en-US",
    label: "English",
    text: "The future of reading is here. Import any document, and let artificial intelligence transform it into an audiobook you can enjoy anytime, anywhere.",
  },
  {
    lang: "ja-JP",
    label: "日本語",
    text: "耳で読む、新しい読書体験。PDFやウェブページをインポートするだけで、AIが読み上げてくれます。",
  },
  {
    lang: "ko-KR",
    label: "한국어",
    text: "귀로 읽는 새로운 방법. 문서를 가져오기만 하면 AI가 읽어줍니다. 언제 어디서나 지식을 흡수하세요.",
  },
  {
    lang: "fr-FR",
    label: "Français",
    text: "L'avenir de la lecture est ici. Importez n'importe quel document et laissez l'intelligence artificielle le transformer en livre audio.",
  },
];

// ============== 组件 ==============

// 高音质声音关键词（macOS/Windows 上质量更好的声音）
const VOICE_QUALITY_HINTS = ["premium", "enhanced", "natural", "neural", "samantha", "karen", "moira", "tessa", "daniel", "alex", "ting-ting", "mei-jia", "yuna", "audrey", "aurelie"];

export default function TTSDemo() {
  const [text, setText] = useState(PRESETS[0].text);
  const [selectedLang, setSelectedLang] = useState(PRESETS[0].lang);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [highlightIndex, setHighlightIndex] = useState(-1);
  const [supported, setSupported] = useState(true);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [filteredVoices, setFilteredVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoiceURI, setSelectedVoiceURI] = useState<string>("");
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const headerRef = useScrollReveal<HTMLDivElement>();
  const [waveKey, setWaveKey] = useState(0);

  // 加载声音列表（浏览器异步加载）
  useEffect(() => {
    const loadVoices = () => {
      const all = window.speechSynthesis.getVoices();
      if (all.length > 0) setVoices(all);
    };
    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
    return () => {
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, []);

  // 根据语言过滤声音，并自动选中最佳声音
  useEffect(() => {
    const langPrefix = selectedLang.split("-")[0];
    const matched = voices.filter(
      (v) => v.lang.startsWith(langPrefix) || v.lang === selectedLang
    );
    setFilteredVoices(matched);

    // 自动选音质最好的声音
    if (matched.length > 0) {
      const best = matched.find((v) =>
        VOICE_QUALITY_HINTS.some((hint) => v.name.toLowerCase().includes(hint))
      );
      setSelectedVoiceURI((best ?? matched[0]).voiceURI);
    }
  }, [selectedLang, voices]);

  // 检测浏览器支持
  useEffect(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      setSupported(false);
    }
  }, []);

  // 清理：组件卸载时停止朗读
  useEffect(() => {
    return () => {
      window.speechSynthesis?.cancel();
    };
  }, []);

  // 开始朗读
  const speak = useCallback(() => {
    if (!text.trim()) return;
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = selectedLang;
    utterance.rate = 1.0;

    // 使用用户选中的声音
    const voice = filteredVoices.find((v) => v.voiceURI === selectedVoiceURI);
    if (voice) utterance.voice = voice;

    // 实时高亮
    utterance.onboundary = (event) => {
      if (event.name === "word" || event.name === "sentence") {
        setHighlightIndex(event.charIndex);
      }
    };

    utterance.onend = () => {
      setIsSpeaking(false);
      setIsPaused(false);
      setHighlightIndex(-1);
    };

    utterance.onerror = () => {
      setIsSpeaking(false);
      setIsPaused(false);
      setHighlightIndex(-1);
    };

    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
    setIsSpeaking(true);
    setIsPaused(false);
    setWaveKey((k) => k + 1); // 触发波形重渲染
  }, [text, selectedLang, selectedVoiceURI, filteredVoices]);

  // 暂停/继续
  const togglePause = useCallback(() => {
    if (!window.speechSynthesis) return;
    if (isPaused) {
      window.speechSynthesis.resume();
      setIsPaused(false);
    } else {
      window.speechSynthesis.pause();
      setIsPaused(true);
    }
  }, [isPaused]);

  // 停止
  const stop = useCallback(() => {
    window.speechSynthesis?.cancel();
    setIsSpeaking(false);
    setIsPaused(false);
    setHighlightIndex(-1);
  }, []);

  // 切换预设
  const selectPreset = (preset: typeof PRESETS[number]) => {
    stop();
    setSelectedLang(preset.lang);
    setText(preset.text);
    setHighlightIndex(-1);
  };

  // 渲染高亮文本（逐字/逐词）
  const renderHighlightedText = () => {
    if (highlightIndex < 0) {
      return <span className="text-white/80">{text}</span>;
    }
    const before = text.slice(0, highlightIndex);
    const after = text.slice(highlightIndex);
    return (
      <>
        <span className="text-white/50">{before}</span>
        <span className="text-white font-semibold">{after}</span>
      </>
    );
  };

  if (!supported) {
    return (
      <section id="tts-demo" className="py-24 sm:py-32">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-white/60">您的浏览器不支持语音合成，请下载挠荔枝 App 体验完整功能。</p>
        </div>
      </section>
    );
  }

  return (
    <section id="tts-demo" className="py-24 sm:py-32 relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div ref={headerRef} className="reveal text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-6">
            <Volume2 className="h-4 w-4" />
            在线体验
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
            现在就<span className="text-primary">听一听</span>
          </h2>
          <p className="mt-4 text-lg text-white/60">
            选择一种语言，输入文字，立即体验语音朗读效果。
          </p>
        </div>

        {/* Demo Card */}
        <div
          ref={containerRef}
          className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl overflow-hidden shadow-2xl shadow-black/40"
        >
          {/* Language tabs */}
          <div className="flex items-center gap-1 px-4 pt-4 pb-2 overflow-x-auto scrollbar-none">
            <Languages className="h-4 w-4 text-white/40 shrink-0 mr-2" />
            {PRESETS.map((preset) => (
              <button
                key={preset.lang}
                onClick={() => selectPreset(preset)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                  selectedLang === preset.lang
                    ? "bg-primary text-white shadow-lg shadow-primary/30"
                    : "bg-white/5 text-white/60 hover:bg-white/10 hover:text-white/80"
                }`}
              >
                {preset.label}
              </button>
            ))}
          </div>

          {/* Voice selector */}
          {filteredVoices.length > 1 && (
            <div className="px-6 pb-2 flex items-center gap-2">
              <Mic2 className="h-4 w-4 text-white/40 shrink-0" />
              <select
                value={selectedVoiceURI}
                onChange={(e) => setSelectedVoiceURI(e.target.value)}
                className="flex-1 bg-white/5 border border-white/10 rounded-xl text-sm text-white/80 px-3 py-1.5 outline-none focus:border-primary/40 transition-colors cursor-pointer appearance-none"
                style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='white' stroke-opacity='0.4' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 10px center' }}
              >
                {filteredVoices.map((v) => (
                  <option key={v.voiceURI} value={v.voiceURI} className="bg-neutral-900 text-white">
                    {v.name} {v.localService ? "" : "☁️"}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Text area */}
          <div className="px-6 py-4">
            <textarea
              value={text}
              onChange={(e) => {
                setText(e.target.value);
                if (isSpeaking) stop();
              }}
              rows={4}
              className="w-full bg-transparent text-white/90 text-lg leading-relaxed resize-none outline-none placeholder:text-white/30 scrollbar-none"
              placeholder="输入你想朗读的文字..."
            />
          </div>

          {/* Highlighted preview (朗读时显示) */}
          {isSpeaking && (
            <div className="px-6 pb-2">
              <div className="p-4 rounded-2xl bg-primary/5 border border-primary/10">
                <p className="text-base leading-relaxed tracking-wide">
                  {renderHighlightedText()}
                </p>
              </div>
            </div>
          )}

          {/* Waveform + Controls */}
          <div className="px-6 pb-6 pt-2 flex items-center gap-4">
            {/* Play / Pause button */}
            {!isSpeaking ? (
              <Button
                onClick={speak}
                disabled={!text.trim()}
                className="h-12 w-12 rounded-full bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/30 transition-all hover:shadow-primary/50 hover:scale-105 p-0 disabled:opacity-40 disabled:cursor-not-allowed"
                aria-label="播放"
              >
                <Play className="h-5 w-5 fill-white ml-0.5" />
              </Button>
            ) : (
              <>
                <Button
                  onClick={togglePause}
                  className="h-12 w-12 rounded-full bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/30 transition-all p-0"
                  aria-label={isPaused ? "继续" : "暂停"}
                >
                  {isPaused ? (
                    <Play className="h-5 w-5 fill-white ml-0.5" />
                  ) : (
                    <Pause className="h-5 w-5" />
                  )}
                </Button>
                <Button
                  onClick={stop}
                  variant="ghost"
                  className="h-12 w-12 rounded-full hover:bg-white/10 text-white/70 p-0"
                  aria-label="停止"
                >
                  <Square className="h-4 w-4 fill-white/70" />
                </Button>
              </>
            )}

            {/* Waveform animation */}
            <div key={waveKey} className="flex items-end gap-0.5 h-8 flex-1 overflow-hidden">
              {Array.from({ length: 32 }, (_, i) => (
                <div
                  key={i}
                  className={`flex-1 rounded-full ${
                    isSpeaking && !isPaused
                      ? "bg-primary/60 animate-wave"
                      : "bg-white/10"
                  }`}
                  style={{
                    height: isSpeaking && !isPaused ? undefined : "4px",
                    animationDelay: `${i * 40}ms`,
                    animationDuration: `${300 + (i % 5) * 60}ms`,
                    minHeight: isSpeaking && !isPaused ? "4px" : undefined,
                  }}
                />
              ))}
            </div>
          </div>

          {/* Hint */}
          <div className="px-6 pb-5">
            <p className="text-xs text-white/30 text-center">
              使用浏览器内置语音引擎 · 挠荔枝 App 内支持更高品质的 AI 语音
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
