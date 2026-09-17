import React from "react";
import { BarChart3, TrendingUp, DollarSign, Clock, ExternalLink, ArrowUpRight, Zap, ShieldAlert } from "lucide-react";
import { AnalysisResult } from "../types";

interface ArbitrageRadarProps {
  analysis: AnalysisResult;
}

export const ArbitrageRadar: React.FC<ArbitrageRadarProps> = ({ analysis }) => {
  // Parse median estimate
  const matches = analysis.strategy.value_range.replace(/,/g, "").match(/\d+/g);
  let low = 1000;
  let high = 2000;
  if (matches && matches.length >= 2) {
    low = parseInt(matches[0], 10);
    high = parseInt(matches[1], 10);
  } else if (matches && matches.length === 1) {
    low = Math.round(parseInt(matches[0], 10) * 0.8);
    high = Math.round(parseInt(matches[0], 10) * 1.2);
  }
  const median = Math.round((low + high) / 2);

  const channels = [
    {
      name: "Premier Specialty Auction (Sotheby's / Heritage)",
      priceEstimate: `$${Math.round(high * 1.15).toLocaleString()} USD`,
      liquiditySpeed: "Slow (30-60 Days)",
      feePct: "15-20%",
      buyerTrust: "Highest (Institutional)",
      recommendation: "Best for Maximum Hammer Price",
      isPrimary: analysis.strategy.primary_route.toLowerCase().includes("sotheby") || analysis.strategy.primary_route.toLowerCase().includes("heritage") || analysis.strategy.primary_route.toLowerCase().includes("christie")
    },
    {
      name: "Dedicated Niche Marketplace (Chrono24 / VCoins / Heritage)",
      priceEstimate: `$${Math.round(median * 1.05).toLocaleString()} USD`,
      liquiditySpeed: "Medium (7-14 Days)",
      feePct: "6.5-12%",
      buyerTrust: "High (Specialist Purists)",
      recommendation: "Best Balance of Speed & Price",
      isPrimary: !analysis.strategy.primary_route.toLowerCase().includes("sotheby") && !analysis.strategy.primary_route.toLowerCase().includes("ebay")
    },
    {
      name: "Global Open Market (eBay Buy-It-Now w/ Best Offer)",
      priceEstimate: `$${Math.round(median * 0.95).toLocaleString()} USD`,
      liquiditySpeed: "Fast (1-5 Days)",
      feePct: "13.25%",
      buyerTrust: "Moderate (Escrow Protected)",
      recommendation: "Fastest Cash Turnover",
      isPrimary: analysis.strategy.primary_route.toLowerCase().includes("ebay")
    },
    {
      name: "Local Private Escrow / Collector Group",
      priceEstimate: `$${Math.round(median * 0.90).toLocaleString()} USD`,
      liquiditySpeed: "Immediate (1-2 Days)",
      feePct: "0% (Cash)",
      buyerTrust: "Direct Verification",
      recommendation: "Zero Fees / Instant Settlement",
      isPrimary: false
    }
  ];

  return (
    <div className="bg-gray-950 border-2 border-fuchsia-500 rounded-2xl p-6 pop-shadow-pink space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b-2 border-fuchsia-500/40 pb-4">
        <div>
          <div className="flex items-center gap-2 text-yellow-300 font-mono text-xs uppercase tracking-widest font-black">
            <BarChart3 className="w-4 h-4 text-cyan-400" />
            <span>CROSS-MARKETPLACE ARBITRAGE RADAR</span>
          </div>
          <h3 className="text-white font-display font-black text-xl mt-1 tracking-wide uppercase">
            REAL-TIME PLATFORM YIELD &amp; LIQUIDITY MATRIX
          </h3>
          <p className="text-xs text-cyan-300 mt-0.5 font-mono">
            Compare estimated payout, commission impact, and sale velocity across selling channels.
          </p>
        </div>

        <div className="px-4 py-2 bg-cyan-950 border-2 border-cyan-400 rounded-xl text-xs font-mono text-yellow-300 flex items-center gap-2 self-start sm:self-auto pop-shadow">
          <Zap className="w-4 h-4 text-fuchsia-400 animate-bounce" />
          <span>OPTIMAL ROUTE: <strong className="text-white font-black">{analysis.strategy.primary_route.split(" ")[0]}</strong></span>
        </div>
      </div>

      {/* Grid of Platforms */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {channels.map((chan, idx) => (
          <div
            key={idx}
            className={`p-4 rounded-xl border transition relative space-y-3 ${
              chan.isPrimary
                ? "bg-amber-500/10 border-amber-500/50 text-white"
                : "bg-gray-900/40 border-gray-800/80 text-gray-300 hover:border-gray-700"
            }`}
          >
            {chan.isPrimary && (
              <span className="absolute top-3 right-3 px-2 py-0.5 bg-amber-500 text-gray-950 font-mono font-bold text-[10px] uppercase rounded-md shadow-sm">
                PRIMARY ROUTE
              </span>
            )}

            <div className="pr-20">
              <h4 className="font-display font-bold text-sm text-white">{chan.name}</h4>
              <p className="text-[11px] text-amber-400 font-mono mt-0.5">{chan.recommendation}</p>
            </div>

            <div className="grid grid-cols-2 gap-2 font-mono text-xs pt-2 border-t border-gray-800/60">
              <div className="p-2 bg-gray-950/60 rounded-lg border border-gray-800/80">
                <span className="text-[10px] text-gray-400 uppercase">Yield Range</span>
                <p className="font-bold text-emerald-400 mt-0.5">{chan.priceEstimate}</p>
              </div>

              <div className="p-2 bg-gray-950/60 rounded-lg border border-gray-800/80">
                <span className="text-[10px] text-gray-400 uppercase">Sell Velocity</span>
                <p className="font-bold text-amber-300 mt-0.5">{chan.liquiditySpeed}</p>
              </div>
            </div>

            <div className="flex items-center justify-between text-[11px] text-gray-400 font-mono pt-1">
              <span>Commission: <strong className="text-rose-400">{chan.feePct}</strong></span>
              <span>Trust: <strong className="text-gray-200">{chan.buyerTrust}</strong></span>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
};
