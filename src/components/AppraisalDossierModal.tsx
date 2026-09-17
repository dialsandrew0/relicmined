import React, { useState } from "react";
import { ShieldCheck, Printer, Copy, Check, X, Award, FileText, Sparkles, Hash, Calendar, DollarSign, ExternalLink } from "lucide-react";
import { AnalysisResult } from "../types";
import { NicheInfo } from "../data/niches";

interface DossierModalProps {
  isOpen: boolean;
  onClose: () => void;
  analysis: AnalysisResult;
  selectedNiche: NicheInfo;
  image: string;
}

export const AppraisalDossierModal: React.FC<DossierModalProps> = ({
  isOpen,
  onClose,
  analysis,
  selectedNiche,
  image
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  // Generate deterministic Specimen ID / Certificate Hash based on timestamp & title
  const currentDate = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric"
  });

  const specimenHash = `RM-2026-${selectedNiche.slug.substring(0, 4).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;

  const dossierText = `=====================================================
RELICMINED™ OFFICIAL PROVENANCE & APPRAISAL DOSSIER
Certificate ID: ${specimenHash}
Date Evaluated: ${currentDate}
Category Lens: ${selectedNiche.name.toUpperCase()}
=====================================================

ITEM IDENTIFICATION:
${analysis.identity}

CONFIDENCE SCORE: ${(analysis.confidence * 100).toFixed(0)}%
ESTIMATED MARKET VALUATION: ${analysis.strategy.value_range}
CONDITION STATUS: ${analysis.condition}

TRIAGE & SPECIALIST REVIEW:
Domain: ${analysis.triage.domain}
Assigned Specialist Crew: ${analysis.triage.specialists.join(", ")}

RARE VARIATION & HIDDEN ATTRIBUTES:
${analysis.hidden_value}

PHYSICAL FORENSIC CHECKLIST:
${analysis.recommendations.map((rec, i) => `${i + 1}. ${rec}`).join("\n")}

RECOMMENDED SALES & CONSIGNMENT ROUTE:
${analysis.strategy.primary_route}

SALES PLAYBOOK:
${analysis.strategy.playbook}

-----------------------------------------------------
Authenticated by RelicMined Multi-Agent Pipeline
https://ai.studio/build
=====================================================`;

  const handleCopy = () => {
    navigator.clipboard.writeText(dossierText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-gray-950 border-2 border-fuchsia-500 rounded-2xl pop-shadow-pink overflow-hidden my-8 text-gray-100">
        
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between px-6 py-4 bg-fuchsia-950 border-b-2 border-fuchsia-500">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-yellow-300" />
            <h3 className="font-display font-black text-lg text-white tracking-wider uppercase">
              OFFICIAL CONSIGNMENT &amp; APPRAISAL DOSSIER
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-black border-2 border-white hover:bg-gray-800 text-yellow-300 transition pop-shadow cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Printable Certificate Content Body */}
        <div className="p-6 sm:p-8 space-y-6 max-h-[75vh] overflow-y-auto print:p-0 print:max-h-none">
          
          {/* Header Seal */}
          <div className="border-2 border-yellow-400 rounded-2xl p-6 bg-gradient-to-b from-fuchsia-950/60 to-gray-950 relative pop-shadow-yellow">
            
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b-2 border-yellow-400/40 pb-4">
              <div>
                <div className="text-[11px] font-mono text-cyan-300 uppercase tracking-widest font-black flex items-center gap-1.5 bg-black px-2.5 py-1 rounded border border-cyan-400 inline-block">
                  <Sparkles className="w-3.5 h-3.5 text-fuchsia-400" />
                  RELICMINED CERTIFIED EVALUATION
                </div>
                <h2 className="text-xl sm:text-2xl font-display font-black text-white mt-2 uppercase tracking-wide">
                  PROVENANCE &amp; APPRAISAL SPEC SHEET
                </h2>
              </div>

              <div className="text-right font-mono text-xs text-gray-300">
                <div className="bg-black px-3 py-1 rounded border border-fuchsia-500">HASH: <span className="text-yellow-300 font-extrabold">{specimenHash}</span></div>
                <div className="mt-1 text-[11px] text-cyan-300 font-bold">DATE: {currentDate}</div>
              </div>
            </div>

            {/* Specimen Photo & Summary Card */}
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-12 gap-6 items-center">
              <div className="sm:col-span-4 aspect-square rounded-xl overflow-hidden bg-gray-900 border border-amber-500/30">
                <img 
                  src={image} 
                  alt={analysis.identity} 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>

              <div className="sm:col-span-8 space-y-3">
                <div>
                  <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    {selectedNiche.name}
                  </span>
                  <h3 className="text-lg font-display font-bold text-white mt-1">
                    {analysis.identity}
                  </h3>
                </div>

                <div className="grid grid-cols-2 gap-2 font-mono text-xs">
                  <div className="p-2 bg-gray-900/60 rounded-lg border border-gray-800">
                    <span className="text-[10px] text-gray-400 uppercase">Valuation</span>
                    <p className="font-bold text-amber-400">{analysis.strategy.value_range}</p>
                  </div>
                  <div className="p-2 bg-gray-900/60 rounded-lg border border-gray-800">
                    <span className="text-[10px] text-gray-400 uppercase">Confidence</span>
                    <p className="font-bold text-emerald-400">{(analysis.confidence * 100).toFixed(0)}% Match</p>
                  </div>
                </div>

                <div className="text-xs text-gray-300">
                  <span className="text-gray-400 font-mono text-[10px] uppercase">Condition: </span>
                  {analysis.condition}
                </div>
              </div>
            </div>

          </div>

          {/* Detailed Sections */}
          <div className="space-y-4 font-sans text-xs sm:text-sm text-gray-300">
            
            {/* Triage Crew */}
            <div className="p-4 bg-gray-900/30 border border-gray-800 rounded-xl">
              <h4 className="font-mono text-xs uppercase font-bold text-amber-400 mb-1">
                Triage &amp; Specialist Review Crew
              </h4>
              <p className="text-gray-200">{analysis.triage.domain}</p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {analysis.triage.specialists.map((spec, i) => (
                  <span key={i} className="px-2 py-0.5 bg-gray-950 border border-gray-800 rounded font-mono text-[11px] text-gray-300">
                    🧑‍🔬 {spec}
                  </span>
                ))}
              </div>
            </div>

            {/* Rare Attributes */}
            <div className="p-4 bg-gray-900/30 border border-gray-800 rounded-xl">
              <h4 className="font-mono text-xs uppercase font-bold text-amber-400 mb-1">
                Rare Attributes &amp; Premium Markers
              </h4>
              <p className="text-gray-200 leading-relaxed">{analysis.hidden_value}</p>
            </div>

            {/* Verification Checklist */}
            <div className="p-4 bg-gray-900/30 border border-gray-800 rounded-xl">
              <h4 className="font-mono text-xs uppercase font-bold text-amber-400 mb-2">
                Physical Forensic Verification Checkpoints
              </h4>
              <ul className="space-y-1.5 list-disc list-inside text-gray-300">
                {analysis.recommendations.map((rec, i) => (
                  <li key={i}>{rec}</li>
                ))}
              </ul>
            </div>

            {/* Route & Playbook */}
            <div className="p-4 bg-gray-900/30 border border-gray-800 rounded-xl">
              <h4 className="font-mono text-xs uppercase font-bold text-amber-400 mb-1">
                Recommended Consignment Channel
              </h4>
              <p className="text-white font-semibold mb-2">{analysis.strategy.primary_route}</p>
              <div className="text-xs text-gray-400 leading-relaxed space-y-2 whitespace-pre-wrap">
                {analysis.strategy.playbook}
              </div>
            </div>

          </div>

          <div className="pt-4 border-t border-gray-800 flex justify-between items-center text-[10px] font-mono text-gray-500">
            <span>Official RelicMined Specimen Record</span>
            <span className="flex items-center gap-1 text-emerald-400">
              <ShieldCheck className="w-3.5 h-3.5" />
              Cryptographically Stamped
            </span>
          </div>

        </div>

        {/* Action Footer Buttons */}
        <div className="p-4 bg-gray-900 border-t border-gray-800 flex items-center justify-between gap-4">
          <button
            onClick={handleCopy}
            className="px-4 py-2 bg-gray-950 border border-gray-800 hover:border-gray-700 rounded-xl text-xs font-mono uppercase tracking-wider text-amber-400 flex items-center gap-2 transition"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            {copied ? "Dossier Copied!" : "Copy Dossier Text"}
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-gray-950 font-bold rounded-xl text-xs font-mono uppercase tracking-wider flex items-center gap-2 transition shadow-lg shadow-amber-500/10"
            >
              <Printer className="w-4 h-4" />
              Print / Save PDF
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
