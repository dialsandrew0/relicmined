import React, { useRef, useState, useEffect } from "react";
import { Camera, RefreshCw, AlertCircle, Sparkles, SwitchCamera, Zap } from "lucide-react";
import { NicheInfo } from "../data/niches";

interface CameraScannerProps {
  selectedNiche: NicheInfo;
  onCapture: (base64Image: string, mimeType: string) => void;
  onFallbackToFile: () => void;
}

export const CameraScanner: React.FC<CameraScannerProps> = ({
  selectedNiche,
  onCapture,
  onFallbackToFile
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [stream, setStream] = useState<MediaStream | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<"environment" | "user">("environment");
  const [isInitializing, setIsInitializing] = useState(true);

  const startCamera = async (facing: "environment" | "user") => {
    setIsInitializing(true);
    setCameraError(null);

    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
    }

    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error("Camera API is not supported in this browser environment.");
      }

      const newStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: facing,
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        }
      });

      setStream(newStream);
      if (videoRef.current) {
        videoRef.current.srcObject = newStream;
      }
    } catch (err: any) {
      console.warn("Camera init error:", err);
      setCameraError(
        err.message || "Unable to access camera device. Please grant permissions or switch to file upload."
      );
    } finally {
      setIsInitializing(false);
    }
  };

  useEffect(() => {
    startCamera(facingMode);

    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [facingMode]);

  const toggleCamera = () => {
    const newFacing = facingMode === "environment" ? "user" : "environment";
    setFacingMode(newFacing);
  };

  const handleSnap = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;

    canvas.width = video.videoWidth || 1280;
    canvas.height = video.videoHeight || 720;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    const fullBase64 = canvas.toDataURL("image/jpeg", 0.92);
    const parts = fullBase64.split(",");
    const rawBase64 = parts[1];
    const mimeType = "image/jpeg";

    onCapture(rawBase64, mimeType);
  };

  return (
    <div className="relative w-full rounded-2xl overflow-hidden border-2 border-fuchsia-500 bg-gray-950 pop-shadow-pink">
      {/* Hidden Canvas for Frame Capture */}
      <canvas ref={canvasRef} className="hidden" />

      {/* Video Viewport Container with Scanlines */}
      <div className="relative aspect-[4/3] sm:aspect-[16/10] w-full bg-black flex items-center justify-center overflow-hidden scanline-box">
        {/* Camera Stream */}
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className={`w-full h-full object-cover transition-opacity duration-300 ${
            stream && !isInitializing ? "opacity-100" : "opacity-0"
          }`}
        />

        {/* Loading Spinner during Camera Startup */}
        {isInitializing && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-950 text-cyan-400 gap-3">
            <RefreshCw className="w-8 h-8 animate-spin text-fuchsia-400" />
            <span className="text-xs font-mono uppercase tracking-widest text-cyan-300 font-bold bg-fuchsia-950/60 px-3 py-1 rounded-full border border-fuchsia-500">
              ⚡ INITIALIZING 90S RETRO RETICLE...
            </span>
          </div>
        )}

        {/* Camera Access Error Fallback */}
        {cameraError && !isInitializing && (
          <div className="absolute inset-0 p-6 bg-gray-950/95 flex flex-col items-center justify-center text-center max-w-md mx-auto z-20">
            <div className="w-12 h-12 rounded-2xl bg-fuchsia-950 border-2 border-fuchsia-500 text-fuchsia-400 flex items-center justify-center mb-3 pop-shadow-yellow">
              <AlertCircle className="w-6 h-6" />
            </div>
            <h4 className="font-display font-extrabold text-white text-lg mb-1 tracking-wider uppercase">
              CAMERA VIEWPORT BLOCKED
            </h4>
            <p className="text-xs text-cyan-200 leading-relaxed mb-5 font-mono">
              {cameraError}
            </p>
            <button
              onClick={onFallbackToFile}
              className="px-5 py-2.5 bg-yellow-400 hover:bg-yellow-300 text-black font-extrabold rounded-xl text-xs font-mono uppercase tracking-wider pop-shadow transition transform hover:-translate-y-0.5 cursor-pointer"
            >
              🚀 SWITCH TO PHOTO UPLOAD
            </button>
          </div>
        )}

        {/* HUD Overlay Layer when Stream Active */}
        {stream && !cameraError && !isInitializing && (
          <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-4 sm:p-6 z-20">
            {/* Top HUD Bar */}
            <div className="flex items-center justify-between">
              <div className="px-3 py-1.5 rounded-xl bg-fuchsia-950/90 border-2 border-fuchsia-400 text-cyan-300 font-mono text-[11px] font-bold flex items-center gap-2 pop-shadow">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping"></span>
                <span>LENS: {selectedNiche.name.toUpperCase()}</span>
              </div>

              <div className="px-3 py-1.5 rounded-xl bg-cyan-950/90 border-2 border-cyan-400 text-yellow-300 font-mono text-[10px] font-black uppercase tracking-wider pop-shadow">
                RETRO-VISION 4K ULTRA
              </div>
            </div>

            {/* Scanning Viewfinder Frame & Animated Laser */}
            <div className="relative my-auto w-full max-w-sm aspect-square mx-auto rounded-3xl border-2 border-cyan-400/60 p-2 flex items-center justify-center">
              {/* Corner brackets */}
              <div className="absolute -top-1.5 -left-1.5 w-7 h-7 border-t-4 border-l-4 border-fuchsia-400 rounded-tl-lg"></div>
              <div className="absolute -top-1.5 -right-1.5 w-7 h-7 border-t-4 border-r-4 border-fuchsia-400 rounded-tr-lg"></div>
              <div className="absolute -bottom-1.5 -left-1.5 w-7 h-7 border-b-4 border-l-4 border-fuchsia-400 rounded-bl-lg"></div>
              <div className="absolute -bottom-1.5 -right-1.5 w-7 h-7 border-b-4 border-r-4 border-fuchsia-400 rounded-br-lg"></div>

              {/* Center Crosshair */}
              <div className="w-6 h-6 border-2 border-yellow-400 rounded-full flex items-center justify-center">
                <div className="w-1.5 h-1.5 bg-fuchsia-400 rounded-full animate-ping"></div>
              </div>

              {/* Animated Horizontal Laser Beam */}
              <div className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-fuchsia-400 to-transparent shadow-[0_0_16px_#ff007f] animate-[bounce_1.5s_infinite]"></div>
            </div>

            {/* Bottom HUD info */}
            <div className="flex items-center justify-between text-[11px] font-mono font-bold text-yellow-300 bg-black/90 px-3.5 py-2 rounded-xl border-2 border-fuchsia-500 pop-shadow">
              <span className="flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-fuchsia-400" />
                CENTER SPECIMEN FOR 90S POP ANALYSIS
              </span>
              <span className="text-cyan-400 font-black">MACRO ACTIVE</span>
            </div>
          </div>
        )}
      </div>

      {/* Camera Control Footer Bar */}
      {stream && !cameraError && (
        <div className="p-4 bg-gray-950 border-t-2 border-fuchsia-500 flex items-center justify-between gap-3">
          <button
            onClick={toggleCamera}
            className="p-3 bg-gray-900 hover:bg-gray-800 border-2 border-cyan-400 rounded-xl text-cyan-300 transition flex items-center gap-2 text-xs font-mono font-bold pop-shadow cursor-pointer"
            title="Flip Camera"
          >
            <SwitchCamera className="w-4 h-4 text-fuchsia-400" />
            <span className="hidden sm:inline">FLIP</span>
          </button>

          {/* Trigger Capture Button */}
          <button
            onClick={handleSnap}
            className="px-6 py-3.5 bg-gradient-to-r from-fuchsia-500 via-purple-600 to-cyan-500 hover:from-fuchsia-600 hover:to-cyan-600 text-white font-black rounded-xl pop-shadow-yellow flex items-center gap-3 transition transform active:scale-95 font-display text-sm uppercase tracking-wider cursor-pointer border-2 border-white"
          >
            <Camera className="w-5 h-5 text-yellow-300" />
            <span>SCAN SPECIMEN NOW</span>
          </button>

          <button
            onClick={onFallbackToFile}
            className="p-3 bg-gray-900 hover:bg-gray-800 border-2 border-yellow-400 rounded-xl text-yellow-300 transition text-xs font-mono font-bold pop-shadow cursor-pointer"
            title="Switch to Upload"
          >
            UPLOAD
          </button>
        </div>
      )}
    </div>
  );
};
