import React, { useState, useRef, useEffect } from "react";
import { 
  UploadCloud, 
  Search, 
  DollarSign, 
  Award, 
  Sparkles, 
  ShieldCheck, 
  Users, 
  CheckCircle2, 
  RefreshCw, 
  ArrowRight, 
  HelpCircle,
  AlertCircle,
  TrendingUp,
  Camera,
  Layers,
  ChevronDown,
  Calculator,
  FileText,
  BarChart3,
  Mail,
  Printer
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { NICHES, getNicheBySlug, SAMPLE_PRESETS, NicheInfo, PresetItem } from "./data/niches";
import { CameraScanner } from "./components/CameraScanner";
import { FlipCalculator } from "./components/FlipCalculator";
import { AppraisalDossierModal } from "./components/AppraisalDossierModal";
import { ForensicInspector } from "./components/ForensicInspector";
import { OutreachGenerator } from "./components/OutreachGenerator";
import { ArbitrageRadar } from "./components/ArbitrageRadar";
import { AnalysisResult } from "./types";

export default function App() {
  // State for active niche, default to URL query param if present
  const [selectedNiche, setSelectedNiche] = useState<NicheInfo>(NICHES[0]);
  const [scanMode, setScanMode] = useState<"camera" | "upload">("camera");
  const [image, setImage] = useState<string | null>(null);
  const [mimeType, setMimeType] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [isDemo, setIsDemo] = useState(false);
  const [activeTab, setActiveTab] = useState<"identity" | "hidden" | "strategy">("identity");
  const [mainSection, setMainSection] = useState<"overview" | "flip" | "forensic" | "outreach" | "arbitrage">("overview");
  const [isDossierOpen, setIsDossierOpen] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [nicheDropdownOpen, setNicheDropdownOpen] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync with URL query parameter on mount and when changed
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const nicheParam = params.get("niche") || params.get("niche_id");
    if (nicheParam) {
      const matched = getNicheBySlug(nicheParam);
      setSelectedNiche(matched);
    }
  }, []);

  const handleSelectNiche = (niche: NicheInfo) => {
    setSelectedNiche(niche);
    setNicheDropdownOpen(false);
    // Update browser URL query parameter seamlessly
    const newUrl = `${window.location.pathname}?niche=${niche.slug}`;
    window.history.replaceState(null, "", newUrl);
  };

  // Status ticker generator
  const runTicker = () => {
    const statuses = [
      `📸 Extracting visual features through ${selectedNiche.name} lens...`,
      "👁️ Running high-resolution computer vision algorithms...",
      `🕵️ Triaging specimen to ${selectedNiche.name} specialist networks...`,
      "📊 Querying historical sales records & catalog valuation index...",
      "✍️ Synthesizing tailored sales strategy playbook..."
    ];
    let currentIndex = 0;
    setStatusMessage(statuses[0]);

    const interval = setInterval(() => {
      currentIndex++;
      if (currentIndex < statuses.length) {
        setStatusMessage(statuses[currentIndex]);
      } else {
        clearInterval(interval);
      }
    }, 1800);

    return () => clearInterval(interval);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const processFile = (file: File) => {
    setError(null);
    if (!file.type.startsWith("image/")) {
      setError("Please upload a valid image file (PNG, JPG, JPEG).");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target && event.target.result) {
        const fullBase64 = event.target.result as string;
        const parts = fullBase64.split(",");
        const rawBase64 = parts[1];
        const extractedMimeType = parts[0].split(";")[0].split(":")[1];

        setImage(fullBase64);
        setMimeType(extractedMimeType);
        triggerAnalysis(rawBase64, extractedMimeType);
      }
    };
    reader.readAsDataURL(file);
  };

  const triggerAnalysis = async (rawBase64: string, mime: string) => {
    setAnalyzing(true);
    setAnalysis(null);
    const stopTicker = runTicker();

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          image: rawBase64,
          mimeType: mime,
          niche: selectedNiche.name
        }),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || "Failed to analyze image.");
      }

      const data = await response.json();
      setAnalysis(data.result);
      setIsDemo(data.isDemo);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "An unexpected error occurred during analysis.");
    } finally {
      stopTicker();
      setAnalyzing(false);
    }
  };

  const handleCameraCapture = (rawBase64: string, mime: string) => {
    setImage(`data:${mime};base64,${rawBase64}`);
    setMimeType(mime);
    triggerAnalysis(rawBase64, mime);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const loadPreset = (preset: PresetItem) => {
    setError(null);
    setImage(preset.image);
    setMimeType("image/jpeg");
    setAnalyzing(true);
    setAnalysis(null);
    
    // Automatically switch active niche to match preset if available
    const matchedNiche = NICHES.find((n) => n.slug === preset.nicheSlug);
    if (matchedNiche) {
      handleSelectNiche(matchedNiche);
    }

    const stopTicker = runTicker();
    setTimeout(() => {
      stopTicker();
      setAnalysis(preset.result);
      setIsDemo(false);
      setAnalyzing(false);
    }, 3200);
  };

  const resetScanner = () => {
    setImage(null);
    setMimeType(null);
    setAnalysis(null);
    setError(null);
  };

  const NicheIcon = selectedNiche.icon;

  return (
    <div className="min-h-screen flex flex-col justify-between font-sans bg-[#0c0814] text-gray-100 bg-pop-grid">
      {/* Top Header / App Branding */}
      <header className="border-b-2 border-fuchsia-500 bg-[#120b24]/95 backdrop-blur sticky top-0 z-50 px-4 sm:px-6 py-3.5 pop-shadow-pink">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-fuchsia-500 via-purple-600 to-cyan-400 flex items-center justify-center pop-shadow-yellow border-2 border-white">
              <Search className="w-6 h-6 text-yellow-300 font-extrabold stroke-[3]" />
            </div>
            <div>
              <h1 className="font-display font-black text-xl leading-none tracking-wider text-white uppercase flex items-center gap-2">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-400 via-yellow-300 to-cyan-300">RELICMINED</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-fuchsia-950 border-2 border-fuchsia-400 text-yellow-300 font-mono font-bold pop-shadow">
                  90S POP RETRO
                </span>
              </h1>
              <p className="text-[11px] text-cyan-300 font-mono font-bold tracking-widest mt-0.5">EXCAVATOR &amp; FLIPPER TERMINAL</p>
            </div>
          </div>

          {/* Right Header Status / Active Niche Selector Dropdown */}
          <div className="flex items-center gap-3">
            {/* Niche Selector Pill */}
            <div className="relative">
              <button
                onClick={() => setNicheDropdownOpen(!nicheDropdownOpen)}
                className="px-4 py-2 rounded-xl bg-fuchsia-950 border-2 border-fuchsia-400 hover:border-yellow-300 transition font-mono text-xs text-yellow-300 flex items-center gap-2 pop-shadow cursor-pointer font-extrabold"
              >
                <NicheIcon className="w-4 h-4 text-cyan-300" />
                <span className="font-extrabold hidden sm:inline">{selectedNiche.name}</span>
                <span className="font-extrabold sm:hidden">{selectedNiche.name.split("/")[0]}</span>
                <ChevronDown className="w-4 h-4 text-fuchsia-400" />
              </button>

              {/* Dropdown Menu */}
              {nicheDropdownOpen && (
                <div className="absolute right-0 mt-2 w-72 bg-gray-950 border-2 border-fuchsia-500 rounded-2xl pop-shadow-yellow p-2 z-50 max-h-96 overflow-y-auto">
                  <div className="px-3 py-2 text-[10px] font-mono uppercase tracking-widest text-cyan-300 font-bold border-b-2 border-fuchsia-500/50 mb-1">
                    SELECT EVALUATION LENS
                  </div>
                  {NICHES.map((niche) => {
                    const IconComponent = niche.icon;
                    const isSelected = niche.id === selectedNiche.id;
                    return (
                      <button
                        key={niche.id}
                        onClick={() => handleSelectNiche(niche)}
                        className={`w-full p-2.5 rounded-xl text-left flex items-start gap-3 transition font-mono ${
                          isSelected
                            ? "bg-fuchsia-950 border-2 border-yellow-300 text-yellow-300 font-bold pop-shadow"
                            : "hover:bg-gray-900 text-gray-300"
                        }`}
                      >
                        <IconComponent className={`w-4 h-4 mt-0.5 shrink-0 ${isSelected ? "text-yellow-300" : "text-cyan-400"}`} />
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-bold leading-tight truncate">{niche.name}</p>
                          <p className="text-[10px] text-gray-400 mt-0.5 line-clamp-1">{niche.tagline}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            <span className="hidden md:flex items-center gap-2 text-[11px] bg-cyan-950/90 border-2 border-cyan-400 px-3.5 py-1.5 rounded-xl font-mono text-yellow-300 font-extrabold pop-shadow">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping"></span>
              90S ORCHESTRATOR ONLINE
            </span>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-8">
        
        {/* Niche Ribbon Bar */}
        <div className="mb-8 overflow-x-auto pb-2 scrollbar-none">
          <div className="flex items-center gap-2.5 min-w-max">
            {NICHES.map((niche) => {
              const IconComp = niche.icon;
              const isSelected = niche.id === selectedNiche.id;
              return (
                <button
                  key={niche.id}
                  onClick={() => handleSelectNiche(niche)}
                  className={`px-4 py-2.5 rounded-xl text-xs font-mono font-extrabold transition flex items-center gap-2 border-2 cursor-pointer ${
                    isSelected
                      ? "bg-fuchsia-500 border-yellow-300 text-black pop-shadow-yellow transform -translate-y-0.5"
                      : "bg-[#120b24] hover:bg-gray-900 border-fuchsia-500/50 text-cyan-300 hover:text-white"
                  }`}
                >
                  <IconComp className={`w-4 h-4 ${isSelected ? "text-black" : "text-fuchsia-400"}`} />
                  <span>{niche.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Workspace Headline (if no image yet) */}
        {!image && !analyzing && (
          <div className="max-w-3xl mx-auto text-center mb-8">
            <motion.div 
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-fuchsia-950 border-2 border-fuchsia-400 text-yellow-300 text-xs mb-4 font-mono font-black uppercase tracking-wider pop-shadow-pink"
            >
              <Sparkles className="w-4 h-4 text-cyan-300" />
              ⚡ 90S POP LENS: {selectedNiche.name}
            </motion.div>
            
            <h2 className="text-3xl sm:text-5xl font-display font-black tracking-wide mb-3 uppercase text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-400 via-yellow-300 to-cyan-300 drop-shadow-[0_2px_10px_rgba(255,0,127,0.4)]">
              SCAN &amp; EXCAVATE HIDDEN VALUE
            </h2>
            <p className="text-cyan-200 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto font-mono">
              Scan any artifact using your live camera feed or upload a photo. The pipeline applies spatial neural vision and specialist agent triage.
            </p>
          </div>
        )}

        {/* Core Workspace Grid */}
        <div className="max-w-6xl mx-auto">
          {error && (
            <div className="mb-6 bg-rose-950/40 border border-rose-900/50 p-4 rounded-xl flex items-start gap-3 text-rose-200">
              <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="font-semibold text-sm">Operation Error</p>
                <p className="text-xs text-rose-300 mt-1">{error}</p>
                {image && mimeType && (
                  <button
                    onClick={() => {
                      const rawBase64 = image.split(",")[1];
                      if (rawBase64) {
                        setError(null);
                        triggerAnalysis(rawBase64, mimeType);
                      }
                    }}
                    className="mt-3 px-3 py-1.5 bg-rose-900/60 hover:bg-rose-900 border border-rose-800/50 rounded-lg text-xs font-mono font-bold uppercase tracking-wider text-rose-200 flex items-center gap-2 transition cursor-pointer"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    Retry Scanning Specimen
                  </button>
                )}
              </div>
            </div>
          )}

          <AnimatePresence mode="wait">
            {/* 1. Scanner & Specimen Input Mode */}
            {!image && !analyzing && (
              <motion.div
                key="scanner-view"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
              >
                {/* Scanner Mode Switcher (Camera vs File Upload) */}
                <div className="mb-6 flex justify-center">
                  <div className="bg-[#120b24] p-1.5 rounded-2xl border-2 border-fuchsia-500 flex items-center gap-2 relative pop-shadow-pink">
                    <button
                      onClick={() => setScanMode("camera")}
                      className={`relative z-10 px-5 py-2.5 rounded-xl text-xs font-mono font-black uppercase tracking-wider transition flex items-center gap-2 cursor-pointer ${
                        scanMode === "camera"
                          ? "text-black font-extrabold"
                          : "text-cyan-300 hover:text-white"
                      }`}
                    >
                      <Camera className="w-4 h-4" />
                      Live Camera Scan
                      {scanMode === "camera" && (
                        <motion.div
                          layoutId="scanModePill"
                          className="absolute inset-0 bg-yellow-400 rounded-xl -z-10 border-2 border-black pop-shadow"
                          transition={{ type: "spring", stiffness: 380, damping: 30 }}
                        />
                      )}
                    </button>
                    <button
                      onClick={() => setScanMode("upload")}
                      className={`relative z-10 px-5 py-2.5 rounded-xl text-xs font-mono font-black uppercase tracking-wider transition flex items-center gap-2 cursor-pointer ${
                        scanMode === "upload"
                          ? "text-black font-extrabold"
                          : "text-cyan-300 hover:text-white"
                      }`}
                    >
                      <UploadCloud className="w-4 h-4" />
                      Upload Photo
                      {scanMode === "upload" && (
                        <motion.div
                          layoutId="scanModePill"
                          className="absolute inset-0 bg-yellow-400 rounded-xl -z-10 border-2 border-black pop-shadow"
                          transition={{ type: "spring", stiffness: 380, damping: 30 }}
                        />
                      )}
                    </button>
                  </div>
                </div>

                {/* Active Scanner Area (Camera vs Upload) */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                  {/* Left / Main Column: Active Scanner Viewport */}
                  <div className="lg:col-span-8">
                    <AnimatePresence mode="wait">
                      {scanMode === "camera" ? (
                        <motion.div
                          key="camera-mode"
                          initial={{ opacity: 0, scale: 0.98 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.98 }}
                          transition={{ duration: 0.2 }}
                        >
                          <CameraScanner
                            selectedNiche={selectedNiche}
                            onCapture={handleCameraCapture}
                            onFallbackToFile={() => setScanMode("upload")}
                          />
                        </motion.div>
                      ) : (
                        <motion.div
                          key="upload-mode"
                          initial={{ opacity: 0, scale: 0.98 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.98 }}
                          transition={{ duration: 0.2 }}
                          className={`relative h-[380px] border-4 border-dashed rounded-3xl flex flex-col items-center justify-center transition-all cursor-pointer pop-shadow-cyan ${
                            dragActive 
                              ? "border-yellow-300 bg-fuchsia-950/40" 
                              : "border-cyan-400 bg-gray-950/80 hover:border-yellow-300 hover:bg-fuchsia-950/20"
                          }`}
                          onDragEnter={handleDrag}
                          onDragLeave={handleDrag}
                          onDragOver={handleDrag}
                          onDrop={handleDrop}
                          onClick={() => fileInputRef.current?.click()}
                        >
                          <input 
                            ref={fileInputRef}
                            type="file" 
                            className="hidden" 
                            accept="image/*" 
                            onChange={handleFileChange}
                          />

                          <div className="p-4 rounded-2xl bg-fuchsia-950 border-2 border-fuchsia-400 text-yellow-300 mb-4 pop-shadow-pink">
                            <UploadCloud className="w-8 h-8" />
                          </div>
                          
                          <h3 className="font-display font-black text-xl text-white mb-1 text-center px-4 uppercase tracking-wide">
                            DRAG &amp; DROP SPECIMEN PHOTO
                          </h3>
                          <p className="text-xs text-cyan-200 text-center px-6 max-w-sm mb-5 font-mono">
                            High-resolution PNG, JPG, or JPEG. Works best with flat lighting and clear contrast.
                          </p>
                          
                          <button className="px-6 py-3 bg-yellow-400 hover:bg-yellow-300 text-black font-extrabold rounded-xl transition pop-shadow border-2 border-black flex items-center gap-2 text-xs font-mono uppercase tracking-wider cursor-pointer">
                            <span>SELECT PHOTO FILE</span>
                            <ArrowRight className="w-4 h-4 text-black" />
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Right Column: Curated Preset Artifacts */}
                  <div className="lg:col-span-4 bg-[#120b24] border-2 border-fuchsia-500 rounded-2xl p-5 flex flex-col justify-between pop-shadow-pink">
                    <div>
                      <div className="flex items-center gap-2 text-yellow-300 mb-3">
                        <Layers className="w-4 h-4 text-cyan-300" />
                        <span className="text-[11px] font-mono font-extrabold tracking-widest uppercase">BENCHMARK SPECIMENS</span>
                      </div>
                      <h4 className="text-white font-display font-black text-lg mb-1 uppercase tracking-wider">EXPLORE PRESET RELICS</h4>
                      <p className="text-xs text-cyan-200 leading-relaxed mb-4 font-mono">
                        Click any specimen below to view how the multi-agent pipeline analyzes physical attributes and compiles sales playbooks.
                      </p>

                      <div className="space-y-3">
                        {SAMPLE_PRESETS.map((preset) => (
                          <button
                            key={preset.id}
                            onClick={() => loadPreset(preset)}
                            className="w-full p-2.5 rounded-xl bg-gray-950 hover:bg-fuchsia-950/60 border-2 border-cyan-400 hover:border-yellow-300 transition flex items-center gap-3 text-left group pop-shadow cursor-pointer"
                          >
                            <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-900 border-2 border-white shrink-0 relative">
                              <img 
                                src={preset.image} 
                                alt={preset.name}
                                className="w-full h-full object-cover group-hover:scale-105 transition duration-300" 
                                referrerPolicy="no-referrer"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-extrabold text-white truncate group-hover:text-yellow-300 transition font-display">
                                {preset.name}
                              </p>
                              <p className="text-[10px] text-cyan-300 font-mono mt-0.5 truncate">{preset.subtitle}</p>
                              <p className="text-[10px] text-fuchsia-400 font-mono font-extrabold mt-0.5">{preset.result.strategy.value_range}</p>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="mt-5 pt-4 border-t-2 border-fuchsia-500/50 text-[10px] text-cyan-300 font-mono flex items-center gap-2">
                      <Sparkles className="w-3.5 h-3.5 text-yellow-300 shrink-0" />
                      <span>90s Pop Specimen Sandbox Engine</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* 2. Loading / Analyzing State */}
            {analyzing && (
              <motion.div 
                key="analyzing-view"
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.97 }}
                transition={{ duration: 0.3 }}
                className="max-w-xl mx-auto py-12 text-center"
              >
                <div className="relative w-28 h-28 mx-auto mb-8">
                  <div className="absolute inset-0 rounded-full bg-amber-500/20 blur-xl animate-pulse"></div>
                  <div className="absolute inset-0 rounded-full border-4 border-gray-800"></div>
                  <div className="absolute inset-0 rounded-full border-4 border-t-amber-500 border-r-amber-500 animate-spin"></div>
                  <div className="absolute inset-4 rounded-full bg-gray-950 border border-gray-800 flex items-center justify-center">
                    <Search className="w-8 h-8 text-amber-400 animate-bounce" />
                  </div>
                </div>

                <h3 className="font-display text-2xl font-bold text-white mb-2 tracking-wide">
                  Excavating Specimen Intelligence
                </h3>
                
                <div className="bg-gray-900/60 border border-gray-800 px-6 py-4 rounded-xl max-w-md mx-auto mb-4 shadow-lg">
                  <p className="text-xs font-mono text-amber-400 font-semibold min-h-[18px]">
                    {statusMessage}
                  </p>
                </div>

                <p className="text-[11px] text-gray-500 max-w-sm mx-auto leading-relaxed font-mono">
                  Multi-agent orchestration active: CV Feature Extraction -&gt; Domain Triage -&gt; Valuation Indexing.
                </p>
              </motion.div>
            )}

            {/* 3. Main Results Dashboard */}
            {analysis && image && !analyzing && (
              <motion.div 
                key="results-dashboard"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.35, ease: "easeOut" }}
                className="space-y-8"
              >
                {/* Demo Notice Banner if active */}
                {isDemo && (
                  <div className="bg-gradient-to-r from-amber-500/10 to-yellow-600/10 border border-amber-500/30 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400 shrink-0">
                        <AlertCircle className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-display font-semibold text-sm text-amber-400">DEMO MODE ACTIVE</p>
                        <p className="text-xs text-gray-400 mt-0.5">
                          No active <code className="font-mono text-amber-300">GEMINI_API_KEY</code> detected in Secrets. Displaying detailed sandbox analysis for {selectedNiche.name}. Add your key to enable live vision scan.
                        </p>
                      </div>
                    </div>
                    <div className="text-xs text-gray-500 font-mono whitespace-nowrap bg-gray-950 px-3 py-1.5 rounded-lg border border-gray-800">
                      SETTINGS &gt; SECRETS
                    </div>
                  </div>
                )}

                {/* Action Ribbon: Back & Dossier CTA */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-gray-900/40 border border-gray-800 p-4 rounded-2xl shadow-lg">
                  <p className="text-xs text-gray-300 font-mono flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    EXCAVATION ACTIVE UNDER LENS: <span className="text-amber-400 font-bold">{selectedNiche.name.toUpperCase()}</span>
                  </p>

                  <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                    <button 
                      onClick={() => setIsDossierOpen(true)}
                      className="flex-1 sm:flex-none px-4 py-2 bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-600 hover:to-yellow-700 text-gray-950 font-bold rounded-xl text-xs font-mono uppercase tracking-wider flex items-center justify-center gap-2 transition shadow-lg shadow-amber-500/10 cursor-pointer"
                    >
                      <Award className="w-4 h-4" />
                      Generate Official Appraisal Dossier (PDF)
                    </button>

                    <button 
                      onClick={resetScanner}
                      className="px-3.5 py-2 bg-gray-950 border border-gray-800 hover:border-gray-700 hover:bg-gray-900 rounded-xl text-xs font-mono uppercase tracking-wider text-gray-300 hover:text-white flex items-center justify-center gap-1.5 transition cursor-pointer"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      Scan Another
                    </button>
                  </div>
                </div>

                {/* God-Tier Feature Module Switcher Tabs */}
                <div className="flex flex-wrap gap-2 p-1.5 bg-gray-950 border border-gray-800 rounded-2xl text-xs font-mono font-bold">
                  <button
                    onClick={() => setMainSection("overview")}
                    className={`flex-1 min-w-[120px] py-2.5 px-3 rounded-xl transition flex items-center justify-center gap-2 ${
                      mainSection === "overview"
                        ? "bg-amber-500 text-gray-950 shadow-md"
                        : "text-gray-400 hover:text-white hover:bg-gray-900"
                    }`}
                  >
                    <Search className="w-3.5 h-3.5" />
                    Overview &amp; Analysis
                  </button>

                  <button
                    onClick={() => setMainSection("flip")}
                    className={`flex-1 min-w-[120px] py-2.5 px-3 rounded-xl transition flex items-center justify-center gap-2 ${
                      mainSection === "flip"
                        ? "bg-amber-500 text-gray-950 shadow-md"
                        : "text-gray-400 hover:text-white hover:bg-gray-900"
                    }`}
                  >
                    <Calculator className="w-3.5 h-3.5" />
                    Flip &amp; Margin Modeler
                  </button>

                  <button
                    onClick={() => setMainSection("forensic")}
                    className={`flex-1 min-w-[120px] py-2.5 px-3 rounded-xl transition flex items-center justify-center gap-2 ${
                      mainSection === "forensic"
                        ? "bg-amber-500 text-gray-950 shadow-md"
                        : "text-gray-400 hover:text-white hover:bg-gray-900"
                    }`}
                  >
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Forensic Radar
                  </button>

                  <button
                    onClick={() => setMainSection("arbitrage")}
                    className={`flex-1 min-w-[120px] py-2.5 px-3 rounded-xl transition flex items-center justify-center gap-2 ${
                      mainSection === "arbitrage"
                        ? "bg-amber-500 text-gray-950 shadow-md"
                        : "text-gray-400 hover:text-white hover:bg-gray-900"
                    }`}
                  >
                    <BarChart3 className="w-3.5 h-3.5" />
                    Cross-Market Arbitrage
                  </button>

                  <button
                    onClick={() => setMainSection("outreach")}
                    className={`flex-1 min-w-[120px] py-2.5 px-3 rounded-xl transition flex items-center justify-center gap-2 ${
                      mainSection === "outreach"
                        ? "bg-amber-500 text-gray-950 shadow-md"
                        : "text-gray-400 hover:text-white hover:bg-gray-900"
                    }`}
                  >
                    <Mail className="w-3.5 h-3.5" />
                    Curator Email Pitch
                  </button>
                </div>

                {/* Conditional Rendering of Selected Feature Module */}
                {mainSection === "flip" && (
                  <FlipCalculator 
                    valueRangeText={analysis.strategy.value_range}
                    nicheName={selectedNiche.name}
                    itemTitle={analysis.identity}
                  />
                )}

                {mainSection === "forensic" && (
                  <ForensicInspector 
                    analysis={analysis}
                    nicheName={selectedNiche.name}
                  />
                )}

                {mainSection === "arbitrage" && (
                  <ArbitrageRadar 
                    analysis={analysis}
                  />
                )}

                {mainSection === "outreach" && (
                  <OutreachGenerator 
                    analysis={analysis}
                    selectedNiche={selectedNiche}
                  />
                )}

                {mainSection === "overview" && (
                  <div className="space-y-8">
                    {/* Top Overview: Splitted Card */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                      {/* Visual Specimen Photo (Left Column) */}
                      <div className="lg:col-span-5 flex flex-col justify-between bg-gray-950 border border-gray-800/80 rounded-2xl p-4 shadow-xl">
                        <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-gray-900 border border-gray-800 flex items-center justify-center">
                          <img 
                            src={image} 
                            alt="Excavated Specimen" 
                            className="w-full h-full object-cover"
                            referrerPolicy="no-referrer"
                          />
                          <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-gray-950/80 backdrop-blur border border-gray-800 text-[10px] font-mono text-gray-400 tracking-wider">
                            SPECIMEN SCAN
                          </div>
                        </div>

                        {/* Specialist Network Triage Display */}
                        <div className="mt-4 pt-4 border-t border-gray-800/60">
                          <div className="flex items-center gap-2 text-amber-400 text-xs font-mono uppercase tracking-widest mb-3">
                            <Users className="w-3.5 h-3.5" />
                            Specialist Triage Crew
                          </div>
                          <div className="p-3 bg-gray-900/30 border border-gray-800/60 rounded-xl">
                            <p className="text-[10px] text-gray-500 uppercase tracking-wider font-mono">Assigned Domain</p>
                            <p className="text-sm font-semibold text-white mt-0.5">{analysis.triage.domain}</p>
                            
                            <div className="mt-3 flex flex-wrap gap-1.5">
                              {analysis.triage.specialists.map((specialist, i) => (
                                <span 
                                  key={i} 
                                  className="text-[10px] bg-gray-950 text-gray-300 px-2.5 py-1 rounded-md border border-gray-800 font-mono"
                                >
                                  🧑‍🔬 {specialist}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Quantitative Value Metrics (Right Column) */}
                      <div className="lg:col-span-7 flex flex-col justify-between">
                        <div className="space-y-6">
                          <div>
                            <span className="text-[10px] font-mono tracking-widest text-amber-500 uppercase font-bold bg-amber-500/10 border border-amber-500/20 px-3 py-1 rounded-full">
                              {selectedNiche.name} Specimen
                            </span>
                            <h2 className="text-2xl md:text-3xl font-display font-bold text-white tracking-tight mt-3">
                              {analysis.identity}
                            </h2>
                          </div>

                          {/* Metric Cards */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {/* Price Evaluation */}
                            <div className="bg-gradient-to-br from-amber-950/30 to-gray-900/50 border border-amber-900/30 rounded-2xl p-5 relative overflow-hidden">
                              <div className="absolute right-3 top-3 w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-400">
                                <DollarSign className="w-5 h-5" />
                              </div>
                              <p className="text-[11px] text-gray-400 uppercase tracking-wider font-mono">Estimated Valuation</p>
                              <p className="text-2xl font-bold font-display text-white mt-2">
                                {analysis.strategy.value_range}
                              </p>
                              <p className="text-[10px] text-amber-500 font-mono mt-1 flex items-center gap-1">
                                <TrendingUp className="w-3 h-3" />
                                Optimal Target Value Range
                              </p>
                            </div>

                            {/* Confidence Gauge */}
                            <div className="bg-gray-900/30 border border-gray-800 rounded-2xl p-5 relative overflow-hidden">
                              <div className="absolute right-3 top-3 w-10 h-10 rounded-lg bg-gray-950 border border-gray-800 flex items-center justify-center text-emerald-400">
                                <ShieldCheck className="w-5 h-5" />
                              </div>
                              <p className="text-[11px] text-gray-400 uppercase tracking-wider font-mono">Identification Trust</p>
                              <p className="text-2xl font-bold font-display text-white mt-2">
                                {(analysis.confidence * 100).toFixed(0)}%
                              </p>
                              
                              <div className="w-full bg-gray-950 rounded-full h-1.5 mt-2.5 overflow-hidden border border-gray-800">
                                <div 
                                  className="bg-emerald-500 h-1.5 rounded-full transition-all duration-1000" 
                                  style={{ width: `${analysis.confidence * 100}%` }}
                                ></div>
                              </div>
                            </div>
                          </div>

                          {/* Direct Platform Advice */}
                          <div className="bg-gray-900/20 border border-gray-800 rounded-xl p-4">
                            <p className="text-[11px] text-gray-400 uppercase tracking-wider font-mono">Strategic Sales Route</p>
                            <p className="text-sm font-semibold text-amber-400 mt-1 flex items-center gap-2">
                              <ArrowRight className="w-4 h-4 shrink-0 text-amber-500" />
                              {analysis.strategy.primary_route}
                            </p>
                          </div>

                          {/* Bullet Info */}
                          <div className="bg-gray-900/20 border border-gray-800 p-4 rounded-xl flex items-start gap-3">
                            <Award className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                            <div>
                              <p className="text-[11px] uppercase tracking-wider font-mono text-gray-400">Condition Assessment</p>
                              <p className="text-xs sm:text-sm text-gray-200 mt-1 leading-relaxed">{analysis.condition}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Detailed Reports Grid with Animated Tab Switching */}
                    <div className="border-t border-gray-800 pt-8">
                      <div className="bg-gray-950 border border-gray-800/80 rounded-2xl overflow-hidden shadow-xl">
                        
                        {/* Tab Switches with Animated Indicator */}
                        <div className="flex border-b border-gray-800 bg-gray-900/40">
                          <button
                            onClick={() => setActiveTab("identity")}
                            className={`relative flex-1 py-3.5 px-3 text-[11px] sm:text-xs font-mono font-bold uppercase tracking-wider transition ${
                              activeTab === "identity" 
                                ? "text-amber-400 bg-gray-950/40" 
                                : "text-gray-400 hover:text-white"
                            }`}
                          >
                            🔬 Forensics &amp; Checks
                            {activeTab === "identity" && (
                              <motion.div
                                layoutId="activeTabUnderline"
                                className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-500"
                                transition={{ type: "spring", stiffness: 400, damping: 35 }}
                              />
                            )}
                          </button>
                          <button
                            onClick={() => setActiveTab("hidden")}
                            className={`relative flex-1 py-3.5 px-3 text-[11px] sm:text-xs font-mono font-bold uppercase tracking-wider transition ${
                              activeTab === "hidden" 
                                ? "text-amber-400 bg-gray-950/40" 
                                : "text-gray-400 hover:text-white"
                            }`}
                          >
                            💎 Rare Premium Attributes
                            {activeTab === "hidden" && (
                              <motion.div
                                layoutId="activeTabUnderline"
                                className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-500"
                                transition={{ type: "spring", stiffness: 400, damping: 35 }}
                              />
                            )}
                          </button>
                          <button
                            onClick={() => setActiveTab("strategy")}
                            className={`relative flex-1 py-3.5 px-3 text-[11px] sm:text-xs font-mono font-bold uppercase tracking-wider transition ${
                              activeTab === "strategy" 
                                ? "text-amber-400 bg-gray-950/40" 
                                : "text-gray-400 hover:text-white"
                            }`}
                          >
                            📈 Sales Playbook
                            {activeTab === "strategy" && (
                              <motion.div
                                layoutId="activeTabUnderline"
                                className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-500"
                                transition={{ type: "spring", stiffness: 400, damping: 35 }}
                              />
                            )}
                          </button>
                        </div>

                        {/* Animated Tab Body Content */}
                        <div className="p-6 md:p-8 min-h-[260px]">
                          <AnimatePresence mode="wait">
                            {activeTab === "identity" && (
                              <motion.div
                                key="tab-identity"
                                initial={{ opacity: 0, x: 12 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -12 }}
                                transition={{ duration: 0.2 }}
                                className="space-y-6"
                              >
                                <div>
                                  <h3 className="font-display font-bold text-lg sm:text-xl text-white mb-1">Forensic Verification Steps</h3>
                                  <p className="text-xs sm:text-sm text-gray-400 leading-relaxed">
                                    Recommended physical verification tests before submitting for public listing or high-tier auction:
                                  </p>
                                </div>

                                <div className="grid grid-cols-1 gap-3">
                                  {analysis.recommendations.map((rec, i) => (
                                    <div 
                                      key={i} 
                                      className="p-4 bg-gray-900/20 border border-gray-800/80 rounded-xl flex items-start gap-3.5"
                                    >
                                      <div className="w-6 h-6 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center font-mono text-xs text-amber-400 shrink-0 mt-0.5">
                                        {i + 1}
                                      </div>
                                      <p className="text-xs sm:text-sm text-gray-200 leading-relaxed">{rec}</p>
                                    </div>
                                  ))}
                                </div>
                              </motion.div>
                            )}

                            {activeTab === "hidden" && (
                              <motion.div
                                key="tab-hidden"
                                initial={{ opacity: 0, x: 12 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -12 }}
                                transition={{ duration: 0.2 }}
                                className="space-y-6"
                              >
                                <div className="bg-gradient-to-r from-amber-500/10 to-transparent p-5 sm:p-6 rounded-2xl border border-amber-500/20">
                                  <div className="flex items-center gap-3 mb-3">
                                    <Sparkles className="w-5 h-5 text-amber-400" />
                                    <h3 className="font-display font-bold text-base sm:text-lg text-white">Rare Variation Discovery</h3>
                                  </div>
                                  
                                  <p className="text-gray-200 text-sm sm:text-base leading-relaxed">
                                    {analysis.hidden_value}
                                  </p>
                                  
                                  <div className="mt-4 pt-4 border-t border-amber-500/10 flex items-start gap-2.5">
                                    <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                                    <p className="text-xs text-amber-300 font-mono">
                                      Valuation multiplier: Highlight this specific variation in your listing title &amp; macro photos.
                                    </p>
                                  </div>
                                </div>

                                <div className="p-4 bg-gray-900/30 rounded-xl border border-gray-800">
                                  <h4 className="font-display font-bold text-xs sm:text-sm text-white mb-1">Preservation Guidance</h4>
                                  <p className="text-xs text-gray-400 leading-relaxed">
                                    Avoid aggressive polishing, synthetic cleaners, or surface restoration. Original patina preservation is critical for collector value.
                                  </p>
                                </div>
                              </motion.div>
                            )}

                            {activeTab === "strategy" && (
                              <motion.div
                                key="tab-strategy"
                                initial={{ opacity: 0, x: 12 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -12 }}
                                transition={{ duration: 0.2 }}
                                className="space-y-6"
                              >
                                <div className="flex items-center justify-between">
                                  <div>
                                    <h3 className="font-display font-bold text-lg sm:text-xl text-white">Actionable Sales Playbook</h3>
                                    <p className="text-xs sm:text-sm text-gray-400">Step-by-step listing strategy tailored for the {selectedNiche.name} marketplace.</p>
                                  </div>
                                  <div className="px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-[10px] font-mono text-emerald-400 flex items-center gap-1.5 whitespace-nowrap">
                                    <CheckCircle2 className="w-3.5 h-3.5" />
                                    SECURE PLAYBOOK
                                  </div>
                                </div>

                                <div className="p-5 sm:p-6 bg-gray-950 border border-gray-800/80 rounded-2xl text-gray-300 space-y-4">
                                  {analysis.strategy.playbook.split("\n\n").map((block, index) => {
                                    if (block.startsWith("###")) {
                                      const headerText = block.replace("###", "").trim();
                                      return (
                                        <h4 key={index} className="font-display font-bold text-sm sm:text-base text-amber-400 mt-4 first:mt-0">
                                          {headerText}
                                        </h4>
                                      );
                                    }
                                    return (
                                      <p key={index} className="text-xs sm:text-sm leading-relaxed text-gray-300 whitespace-pre-wrap">
                                        {block}
                                      </p>
                                    );
                                  })}
                                </div>

                                <div className="p-4 bg-amber-500/5 border border-amber-500/10 rounded-xl flex items-center justify-between gap-4">
                                  <div className="flex items-center gap-2.5">
                                    <TrendingUp className="w-4 h-4 text-amber-400" />
                                    <span className="text-xs font-mono text-gray-400">Strategy Confidence Score</span>
                                  </div>
                                  <span className="text-sm font-bold font-mono text-amber-400">
                                    {(analysis.strategy.confidence * 100).toFixed(0)}%
                                  </span>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* Official Appraisal & Consignment Dossier Modal */}
      {analysis && image && (
        <AppraisalDossierModal 
          isOpen={isDossierOpen}
          onClose={() => setIsDossierOpen(false)}
          analysis={analysis}
          selectedNiche={selectedNiche}
          image={image}
        />
      )}

      {/* Footer */}
      <footer className="border-t border-gray-900 bg-gray-950/50 py-6 px-4 sm:px-6 text-center text-xs text-gray-500 font-mono">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© 2026 RelicMined • Intelligence Excavated</p>
          <p className="flex items-center gap-2">
            <span>Scan Engine Online</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            <span>Cloud Studio Workspace</span>
          </p>
        </div>
      </footer>
    </div>
  );
}
