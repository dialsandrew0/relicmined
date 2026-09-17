import React, { useState } from "react";
import { ShieldCheck, AlertTriangle, CheckCircle2, XCircle, Search, HelpCircle, Eye, RefreshCw } from "lucide-react";
import { AnalysisResult } from "../types";

interface ForensicInspectorProps {
  analysis: AnalysisResult;
  nicheName: string;
}

export const ForensicInspector: React.FC<ForensicInspectorProps> = ({
  analysis,
  nicheName
}) => {
  // Build dynamic physical tests based on recommendations & niche
  const initialTests = analysis.recommendations.map((rec, idx) => ({
    id: `test-${idx}`,
    title: `Forensic Physical Check #${idx + 1}`,
    description: rec,
    status: "pass" as "pass" | "fail" | "pending"
  }));

  // Add category-specific standard physical verification checkpoints
  const categoryExtras = [
    {
      id: "extra-uv",
      title: "Blacklight / UV Luminescence Test",
      description: "Inspect surface under 365nm UV light. Modern synthetic glues, paper optical brighteners, or acrylic touch-ups glow bright blue/white.",
      status: "pass" as const
    },
    {
      id: "extra-weight",
      title: "Micro-Gram Weight & Density Tolerance",
      description: "Weigh specimen on precision scale. Compare against published catalog tolerances (e.g., gold/silver purity or cast metal vs stamped metal).",
      status: "pass" as const
    },
    {
      id: "extra-engraving",
      title: "Engraving & Hallmark Tooling Stamp",
      description: "Inspect maker hallmarks, serial engravings, or mintmarks under 10x loupe for sharp pantograph depth vs soft cast rounded edges.",
      status: "pending" as const
    }
  ];

  const [tests, setTests] = useState([...initialTests, ...categoryExtras]);

  const setTestStatus = (id: string, status: "pass" | "fail" | "pending") => {
    setTests(prev => prev.map(t => t.id === id ? { ...t, status } : t));
  };

  // Compute live counterfeit risk meter
  const passedCount = tests.filter(t => t.status === "pass").length;
  const failedCount = tests.filter(t => t.status === "fail").length;
  const totalCount = tests.length;

  const authenticityScore = Math.round((passedCount / totalCount) * 100);

  return (
    <div className="bg-gray-950 border-2 border-cyan-400 rounded-2xl p-6 pop-shadow-cyan space-y-6">
      
      {/* Header & Risk Score Gauge */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b-2 border-cyan-400/40 pb-4">
        <div>
          <div className="flex items-center gap-2 text-cyan-300 font-mono text-xs uppercase tracking-widest font-black">
            <Search className="w-4 h-4 text-fuchsia-400" />
            <span>INTERACTIVE FORENSIC AUTHENTICITY RADAR</span>
          </div>
          <h3 className="text-white font-display font-black text-xl mt-1 tracking-wide uppercase">
            PHYSICAL COUNTERFEIT &amp; RESTORATION INSPECTOR
          </h3>
          <p className="text-xs text-yellow-300 mt-0.5 font-mono">
            Mark off physical tests under a 10x loupe or UV light to calculate your real-time Authenticity Index.
          </p>
        </div>

        {/* Live Authenticity Gauge */}
        <div className={`p-4 rounded-2xl border-2 flex items-center gap-3 pop-shadow ${
          failedCount > 0 
            ? "bg-rose-950/90 border-rose-500 text-rose-200" 
            : authenticityScore >= 80 
            ? "bg-fuchsia-950/90 border-fuchsia-400 text-yellow-300"
            : "bg-yellow-950/90 border-yellow-400 text-yellow-200"
        }`}>
          <div className="text-right font-mono">
            <div className="text-[10px] uppercase font-bold text-cyan-300">AUTHENTICITY INDEX</div>
            <div className="text-3xl font-black font-display tracking-tight">{authenticityScore}%</div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-black border-2 border-white flex items-center justify-center shrink-0 pop-shadow">
            {failedCount > 0 ? (
              <AlertTriangle className="w-6 h-6 text-rose-400 animate-bounce" />
            ) : (
              <ShieldCheck className="w-6 h-6 text-yellow-300" />
            )}
          </div>
        </div>
      </div>

      {/* Tests Checklist Grid */}
      <div className="space-y-3">
        {tests.map((test) => (
          <div
            key={test.id}
            className={`p-4 rounded-xl border transition flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
              test.status === "pass"
                ? "bg-emerald-950/10 border-emerald-500/20 text-gray-200"
                : test.status === "fail"
                ? "bg-rose-950/20 border-rose-500/40 text-rose-200"
                : "bg-gray-900/40 border-gray-800 text-gray-300"
            }`}
          >
            <div className="space-y-1 max-w-xl">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-amber-400 uppercase">
                  {test.title}
                </span>
                {test.status === "pass" && (
                  <span className="px-2 py-0.5 rounded bg-emerald-500/20 border border-emerald-500/30 text-[10px] font-mono text-emerald-400">
                    VERIFIED PASS
                  </span>
                )}
                {test.status === "fail" && (
                  <span className="px-2 py-0.5 rounded bg-rose-500/20 border border-rose-500/30 text-[10px] font-mono text-rose-400">
                    RED FLAG DETECTED
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-300 leading-relaxed">{test.description}</p>
            </div>

            {/* Radio / Toggle Controls */}
            <div className="flex items-center gap-1.5 shrink-0 self-start sm:self-center">
              <button
                onClick={() => setTestStatus(test.id, "pass")}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold uppercase transition flex items-center gap-1.5 ${
                  test.status === "pass"
                    ? "bg-emerald-500 text-gray-950 shadow-md"
                    : "bg-gray-900 text-gray-400 hover:text-emerald-400 border border-gray-800"
                }`}
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                Pass
              </button>

              <button
                onClick={() => setTestStatus(test.id, "pending")}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold uppercase transition ${
                  test.status === "pending"
                    ? "bg-amber-500 text-gray-950 shadow-md"
                    : "bg-gray-900 text-gray-400 hover:text-amber-400 border border-gray-800"
                }`}
              >
                Pending
              </button>

              <button
                onClick={() => setTestStatus(test.id, "fail")}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold uppercase transition flex items-center gap-1.5 ${
                  test.status === "fail"
                    ? "bg-rose-600 text-white shadow-md"
                    : "bg-gray-900 text-gray-400 hover:text-rose-400 border border-gray-800"
                }`}
              >
                <XCircle className="w-3.5 h-3.5" />
                Red Flag
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Advisory Message */}
      {failedCount > 0 ? (
        <div className="p-4 bg-rose-950/40 border border-rose-900/50 rounded-xl text-xs text-rose-200 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
          <div>
            <p className="font-bold">⚠️ Red Flag Warning</p>
            <p className="mt-1 leading-relaxed">
              One or more physical checkpoints failed. Avoid paying a high collector premium until a certified third-party appraiser or museum conservator reviews the item in person.
            </p>
          </div>
        </div>
      ) : (
        <div className="p-3.5 bg-gray-900/40 border border-gray-800 rounded-xl text-xs text-gray-400 font-mono flex items-center gap-2">
          <HelpCircle className="w-4 h-4 text-amber-400 shrink-0" />
          <span>Need advanced lab analysis? Export your Dossier to submit for X-ray fluorescence or carbon dating.</span>
        </div>
      )}

    </div>
  );
};
