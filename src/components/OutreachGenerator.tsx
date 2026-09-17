import React, { useState } from "react";
import { Mail, Copy, Check, Send, Sparkles, UserCheck, Building } from "lucide-react";
import { AnalysisResult } from "../types";
import { NicheInfo } from "../data/niches";

interface OutreachGeneratorProps {
  analysis: AnalysisResult;
  selectedNiche: NicheInfo;
}

export const OutreachGenerator: React.FC<OutreachGeneratorProps> = ({
  analysis,
  selectedNiche
}) => {
  const [recipientType, setRecipientType] = useState<"auction" | "curator" | "collector">("auction");
  const [copied, setCopied] = useState(false);

  const primaryRoute = analysis.strategy.primary_route;
  const targetValue = analysis.strategy.value_range;

  // Formulate pitch copy based on selected recipient type
  const generatePitch = () => {
    if (recipientType === "auction") {
      return `Subject: Consignment Evaluation Inquiry: ${analysis.identity} (${selectedNiche.name})

Dear Consignment & Specialist Department,

I am writing to inquire about placing a verified specimen into an upcoming auction:

ITEM IDENTIFICATION:
${analysis.identity}

VALUATION & CONDITION SUMMARY:
Estimated Market Target: ${targetValue}
Physical Condition: ${analysis.condition}
Primary Rarity Factors: ${analysis.hidden_value}

SPECIALIST TRIAGE & FORENSIC STATUS:
Domain: ${analysis.triage.domain}
Suggested Specialist Evaluation: ${analysis.triage.specialists.join(", ")}

This item has undergone high-resolution physical and forensic verification via the RelicMined multi-agent appraisal pipeline. We possess macro photo documentation, serial verification, and a complete appraisal dossier ready for your review.

Please advise on your upcoming auction catalog deadlines, seller's commission structures, and consignment submission procedures.

Warm regards,
RelicMined Registered Specimen Owner`;
    }

    if (recipientType === "curator") {
      return `Subject: Institutional Acquisition Inquiry: ${analysis.identity}

Dear Curator & Historical Archives Team,

I am reaching out regarding a significant historical specimen in the ${selectedNiche.name} domain that may be of research or acquisition interest to your institution:

SPECIMEN OVERVIEW:
${analysis.identity}

HISTORICAL & FORENSIC SIGNIFICANCE:
${analysis.hidden_value}
Condition Assessment: ${analysis.condition}

ESTIMATED INSTITUTIONAL VALUATION:
${targetValue}

We have compiled a formal RelicMined Provenance & Appraisal Dossier detailing its physical markers, condition status, and forensic checks. We would welcome the opportunity to share high-resolution images or discuss potential private placement or exhibition loan.

Respectfully submitted,
RelicMined Registered Specimen Owner`;
    }

    return `Subject: Private Offer Notice: ${analysis.identity}

Dear Collector,

I am contacting you directly as a specialist in ${selectedNiche.name} regarding a rare acquisition opportunity:

ITEM SPECIFICATION:
${analysis.identity}

KEY COLLECTOR HIGHLIGHTS:
• Valuation Range: ${targetValue}
• Condition: ${analysis.condition}
• Unique Rarity: ${analysis.hidden_value}

An official RelicMined Provenance & Appraisal Spec Sheet has been prepared for this item, confirming its authenticity indicators and condition score.

If you are currently expanding your collection in this category, I would be pleased to provide the full appraisal dossier and discuss private transfer terms.

Best regards,
RelicMined Registered Specimen Owner`;
  };

  const currentPitch = generatePitch();

  const handleCopy = () => {
    navigator.clipboard.writeText(currentPitch);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-gray-950 border-2 border-yellow-400 rounded-2xl p-6 pop-shadow-yellow space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b-2 border-yellow-400/40 pb-4">
        <div>
          <div className="flex items-center gap-2 text-yellow-300 font-mono text-xs uppercase tracking-widest font-black">
            <Mail className="w-4 h-4 text-fuchsia-400" />
            <span>SPECIALIST &amp; AUCTION HOUSE OUTREACH GENERATOR</span>
          </div>
          <h3 className="text-white font-display font-black text-xl mt-1 tracking-wide uppercase">
            INSTANT CURATOR &amp; AUCTION PITCH GENERATOR
          </h3>
          <p className="text-xs text-cyan-300 mt-0.5 font-mono">
            Auto-generate professional inquiry letters tailored for Sotheby's, Heritage, Christie's, or private collectors.
          </p>
        </div>

        <button
          onClick={handleCopy}
          className="px-5 py-2.5 bg-yellow-400 hover:bg-yellow-300 text-black font-extrabold rounded-xl text-xs font-mono uppercase tracking-wider flex items-center gap-2 transition pop-shadow cursor-pointer self-start sm:self-auto border-2 border-black"
        >
          {copied ? <Check className="w-4 h-4 text-black" /> : <Copy className="w-4 h-4 text-black" />}
          {copied ? "COPIED TO CLIPBOARD!" : "COPY EMAIL PITCH"}
        </button>
      </div>

      {/* Recipient Type Switcher */}
      <div className="grid grid-cols-3 gap-2">
        <button
          onClick={() => setRecipientType("auction")}
          className={`p-3 rounded-xl border text-left transition text-xs flex items-center gap-2.5 ${
            recipientType === "auction"
              ? "bg-amber-500/10 border-amber-500/50 text-amber-300 font-bold"
              : "bg-gray-900/40 border-gray-800 text-gray-400 hover:text-gray-200"
          }`}
        >
          <Building className="w-4 h-4 text-amber-400 shrink-0" />
          <div>
            <div className="text-xs">Auction House Director</div>
            <div className="text-[10px] text-gray-500 font-mono font-normal">Sotheby's / Heritage / Christie's</div>
          </div>
        </button>

        <button
          onClick={() => setRecipientType("curator")}
          className={`p-3 rounded-xl border text-left transition text-xs flex items-center gap-2.5 ${
            recipientType === "curator"
              ? "bg-amber-500/10 border-amber-500/50 text-amber-300 font-bold"
              : "bg-gray-900/40 border-gray-800 text-gray-400 hover:text-gray-200"
          }`}
        >
          <UserCheck className="w-4 h-4 text-amber-400 shrink-0" />
          <div>
            <div className="text-xs">Museum Curator</div>
            <div className="text-[10px] text-gray-500 font-mono font-normal">Archive &amp; Historical Loan</div>
          </div>
        </button>

        <button
          onClick={() => setRecipientType("collector")}
          className={`p-3 rounded-xl border text-left transition text-xs flex items-center gap-2.5 ${
            recipientType === "collector"
              ? "bg-amber-500/10 border-amber-500/50 text-amber-300 font-bold"
              : "bg-gray-900/40 border-gray-800 text-gray-400 hover:text-gray-200"
          }`}
        >
          <Send className="w-4 h-4 text-amber-400 shrink-0" />
          <div>
            <div className="text-xs">Private VIP Collector</div>
            <div className="text-[10px] text-gray-500 font-mono font-normal">Direct Escrow Offer</div>
          </div>
        </button>
      </div>

      {/* Generated Pitch Preview Box */}
      <div className="relative bg-gray-900/70 border border-gray-800 rounded-xl p-4 sm:p-5 font-mono text-xs text-gray-200 leading-relaxed overflow-x-auto whitespace-pre-wrap max-h-80 overflow-y-auto">
        {currentPitch}
      </div>

      <div className="p-3 bg-amber-500/5 border border-amber-500/10 rounded-xl text-[11px] text-amber-300 font-mono flex items-center gap-2">
        <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
        <span>Tip: Attach your downloaded Appraisal Dossier PDF to this email to double your response rate from auction heads.</span>
      </div>

    </div>
  );
};
