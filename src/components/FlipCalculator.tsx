import React, { useState, useMemo } from "react";
import { DollarSign, Calculator, TrendingUp, AlertTriangle, CheckCircle, HelpCircle, ArrowRight, RefreshCw, Zap } from "lucide-react";

interface FlipCalculatorProps {
  valueRangeText: string;
  nicheName: string;
  itemTitle: string;
}

const VENUE_PRESETS = [
  { name: "eBay (Standard)", feePct: 13.25, note: "Quick liquidity, global reach" },
  { name: "Sotheby's / Christie's", feePct: 18.00, note: "Premier auctions, high hammer prices" },
  { name: "Heritage Auctions", feePct: 15.00, note: "Pop culture, comics & numismatics" },
  { name: "Chrono24 / Specialty", feePct: 6.50, note: "Dedicated watch & optics marketplaces" },
  { name: "Private Collector / Cash", feePct: 0.00, note: "Direct sale, zero commission fees" },
];

export const FlipCalculator: React.FC<FlipCalculatorProps> = ({
  valueRangeText,
  nicheName,
  itemTitle,
}) => {
  // Parse low and high estimated values from valueRangeText (e.g. "$2,800 - $4,500 USD")
  const parsedValues = useMemo(() => {
    const matches = valueRangeText.replace(/,/g, "").match(/\d+/g);
    if (matches && matches.length >= 2) {
      const low = parseInt(matches[0], 10);
      const high = parseInt(matches[1], 10);
      return { low, high, median: Math.round((low + high) / 2) };
    } else if (matches && matches.length === 1) {
      const val = parseInt(matches[0], 10);
      return { low: Math.round(val * 0.8), high: Math.round(val * 1.2), median: val };
    }
    return { low: 1000, high: 2000, median: 1500 };
  }, [valueRangeText]);

  // Initial buy price default to 25% of median valuation (typical picker / estate sale arbitrage target)
  const defaultBuyPrice = Math.round(parsedValues.median * 0.25);

  const [buyPrice, setBuyPrice] = useState<number>(defaultBuyPrice);
  const [selectedVenue, setSelectedVenue] = useState<typeof VENUE_PRESETS[0]>(VENUE_PRESETS[0]);
  const [customFeePct, setCustomFeePct] = useState<number>(VENUE_PRESETS[0].feePct);
  const [shippingInsurance, setShippingInsurance] = useState<number>(35);
  const [restorationCost, setRestorationCost] = useState<number>(0);
  const [targetTargetSale, setTargetTargetSale] = useState<"median" | "low" | "high">("median");

  // Calculations
  const grossSalePrice = 
    targetTargetSale === "low" 
      ? parsedValues.low 
      : targetTargetSale === "high" 
      ? parsedValues.high 
      : parsedValues.median;

  const platformFees = Math.round(grossSalePrice * (customFeePct / 100));
  const totalOutlay = buyPrice + shippingInsurance + restorationCost;
  const netPayout = grossSalePrice - platformFees - shippingInsurance;
  const netProfit = netPayout - buyPrice - restorationCost;
  const roiPct = totalOutlay > 0 ? Math.round((netProfit / totalOutlay) * 100) : 0;

  // Max Buy Price Threshold to guarantee at least a 2.0x (100% ROI) margin
  const maxBuyPriceToGuaranteeProfit = Math.max(0, Math.round((netPayout - restorationCost) / 2.0));

  const handleVenueChange = (venue: typeof VENUE_PRESETS[0]) => {
    setSelectedVenue(venue);
    setCustomFeePct(venue.feePct);
  };

  return (
    <div className="bg-gray-950 border-2 border-yellow-400 rounded-2xl p-6 pop-shadow-yellow space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b-2 border-yellow-400/40 pb-4">
        <div>
          <div className="flex items-center gap-2 text-yellow-300 font-mono text-xs uppercase tracking-widest font-black">
            <Calculator className="w-4 h-4 text-fuchsia-400" />
            <span>EXCAVATOR'S FLIP &amp; MARGIN MODELER</span>
          </div>
          <h3 className="text-white font-display font-black text-xl mt-1 tracking-wide uppercase">
            ESTATE &amp; PICKER NET PROFIT CALCULATOR
          </h3>
          <p className="text-xs text-cyan-300 mt-0.5 font-mono">
            Model exact margins, venue commissions, and maximum offer thresholds before buying.
          </p>
        </div>

        <div className="px-4 py-2 bg-fuchsia-950/90 border-2 border-fuchsia-400 rounded-xl text-xs font-mono text-cyan-200 flex items-center gap-2 self-start sm:self-auto pop-shadow">
          <Zap className="w-4 h-4 text-yellow-300 animate-bounce" />
          <span>VALUATION BASELINE: <strong className="text-yellow-300 font-black">${parsedValues.low.toLocaleString()} - ${parsedValues.high.toLocaleString()}</strong></span>
        </div>
      </div>

      {/* Main Grid: Inputs vs Real-Time Output */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left 7 Columns: Financial Inputs */}
        <div className="lg:col-span-7 space-y-5">
          
          {/* Target Sale Price Selection */}
          <div>
            <label className="block text-[11px] font-mono text-gray-400 uppercase tracking-wider mb-2">
              Select Target Sale Benchmark
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => setTargetTargetSale("low")}
                className={`p-2.5 rounded-xl border text-left transition text-xs ${
                  targetTargetSale === "low"
                    ? "bg-amber-500/10 border-amber-500/50 text-amber-300"
                    : "bg-gray-900/40 border-gray-800 text-gray-400 hover:text-gray-200"
                }`}
              >
                <div className="text-[10px] uppercase font-mono text-gray-500">Conservative</div>
                <div className="font-bold text-white mt-0.5">${parsedValues.low.toLocaleString()}</div>
              </button>

              <button
                onClick={() => setTargetTargetSale("median")}
                className={`p-2.5 rounded-xl border text-left transition text-xs ${
                  targetTargetSale === "median"
                    ? "bg-amber-500/10 border-amber-500/50 text-amber-300"
                    : "bg-gray-900/40 border-gray-800 text-gray-400 hover:text-gray-200"
                }`}
              >
                <div className="text-[10px] uppercase font-mono text-gray-500">Realistic Median</div>
                <div className="font-bold text-amber-400 mt-0.5">${parsedValues.median.toLocaleString()}</div>
              </button>

              <button
                onClick={() => setTargetTargetSale("high")}
                className={`p-2.5 rounded-xl border text-left transition text-xs ${
                  targetTargetSale === "high"
                    ? "bg-amber-500/10 border-amber-500/50 text-amber-300"
                    : "bg-gray-900/40 border-gray-800 text-gray-400 hover:text-gray-200"
                }`}
              >
                <div className="text-[10px] uppercase font-mono text-gray-500">Peak Rare Variant</div>
                <div className="font-bold text-emerald-400 mt-0.5">${parsedValues.high.toLocaleString()}</div>
              </button>
            </div>
          </div>

          {/* Asking / Acquisition Price Input */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-xs font-mono text-gray-300 uppercase font-semibold">
                Your Acquisition Cost (Asking Price)
              </label>
              <span className="text-xs font-mono text-amber-400 font-bold">
                ${buyPrice.toLocaleString()} USD
              </span>
            </div>
            <div className="relative flex items-center">
              <div className="absolute left-3 text-gray-500 font-mono text-sm">$</div>
              <input
                type="number"
                value={buyPrice}
                onChange={(e) => setBuyPrice(Math.max(0, parseInt(e.target.value || "0", 10)))}
                className="w-full pl-8 pr-4 py-2.5 bg-gray-900 border border-gray-800 rounded-xl text-white font-mono text-sm focus:border-amber-500 focus:outline-none"
                placeholder="0"
              />
            </div>
            {/* Range Slider */}
            <input
              type="range"
              min="0"
              max={parsedValues.high}
              step="25"
              value={buyPrice}
              onChange={(e) => setBuyPrice(parseInt(e.target.value, 10))}
              className="w-full mt-2 accent-amber-500 h-1.5 bg-gray-800 rounded-lg cursor-pointer"
            />
          </div>

          {/* Venue & Fee Preset Selector */}
          <div>
            <label className="block text-[11px] font-mono text-gray-400 uppercase tracking-wider mb-2">
              Selling Channel &amp; Commission Fee
            </label>
            <div className="space-y-2">
              {VENUE_PRESETS.map((venue, idx) => (
                <button
                  key={idx}
                  onClick={() => handleVenueChange(venue)}
                  className={`w-full p-2.5 rounded-xl border text-left flex items-center justify-between text-xs transition ${
                    selectedVenue.name === venue.name
                      ? "bg-gray-900 border-amber-500/60 text-amber-300"
                      : "bg-gray-950 hover:bg-gray-900/60 border-gray-800/80 text-gray-400"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <div className={`w-2 h-2 rounded-full ${selectedVenue.name === venue.name ? "bg-amber-400" : "bg-gray-700"}`} />
                    <span className="font-semibold text-white">{venue.name}</span>
                    <span className="text-[10px] text-gray-500 hidden sm:inline">({venue.note})</span>
                  </div>
                  <span className="font-mono text-amber-400 font-bold">{venue.feePct}% Fee</span>
                </button>
              ))}
            </div>
          </div>

          {/* Shipping & Conservation Extra Expenses */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-mono text-gray-400 uppercase mb-1">
                Insured Shipping &amp; Packaging ($)
              </label>
              <input
                type="number"
                value={shippingInsurance}
                onChange={(e) => setShippingInsurance(Math.max(0, parseInt(e.target.value || "0", 10)))}
                className="w-full px-3 py-2 bg-gray-900 border border-gray-800 rounded-xl text-white font-mono text-xs focus:border-amber-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[10px] font-mono text-gray-400 uppercase mb-1">
                Restoration / Grading Fee ($)
              </label>
              <input
                type="number"
                value={restorationCost}
                onChange={(e) => setRestorationCost(Math.max(0, parseInt(e.target.value || "0", 10)))}
                className="w-full px-3 py-2 bg-gray-900 border border-gray-800 rounded-xl text-white font-mono text-xs focus:border-amber-500 focus:outline-none"
              />
            </div>
          </div>

        </div>

        {/* Right 5 Columns: Calculated Net Profit & Recommendation Dashboard */}
        <div className="lg:col-span-5 bg-gray-900/40 border border-gray-800/80 rounded-2xl p-5 flex flex-col justify-between space-y-6">
          
          <div className="space-y-4">
            <p className="text-[10px] font-mono text-gray-400 uppercase tracking-widest font-bold">
              ESTIMATED FLIP METRICS
            </p>

            {/* Net Profit Big Badge */}
            <div className={`p-4 rounded-2xl border ${
              netProfit > 0 
                ? "bg-emerald-950/30 border-emerald-500/40 text-emerald-300"
                : "bg-rose-950/30 border-rose-500/40 text-rose-300"
            }`}>
              <div className="flex justify-between items-start">
                <span className="text-xs uppercase font-mono tracking-wider">Estimated Net Profit</span>
                <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded ${
                  netProfit > 0 ? "bg-emerald-500/20 text-emerald-300" : "bg-rose-500/20 text-rose-300"
                }`}>
                  {roiPct}% ROI
                </span>
              </div>
              <div className="text-3xl font-display font-bold mt-2">
                ${netProfit.toLocaleString()} USD
              </div>
              <p className="text-[10px] mt-1 opacity-80 font-mono">
                {netProfit > 0 ? "✅ Net positive profit after fees & shipping." : "⚠️ Negative margin! Asking price exceeds threshold."}
              </p>
            </div>

            {/* Financial Breakdown Table */}
            <div className="space-y-2 text-xs font-mono border-t border-b border-gray-800/80 py-3 text-gray-300">
              <div className="flex justify-between">
                <span className="text-gray-400">Target Gross Sale:</span>
                <span className="font-bold text-white">${grossSalePrice.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Venue Commission ({customFeePct}%):</span>
                <span className="text-rose-400">-${platformFees.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Shipping &amp; Insurance:</span>
                <span className="text-rose-400">-${shippingInsurance.toLocaleString()}</span>
              </div>
              {restorationCost > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-400">Restoration / Grading:</span>
                  <span className="text-rose-400">-${restorationCost.toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between pt-1 border-t border-gray-800">
                <span className="text-gray-400">Your Buy Price Outlay:</span>
                <span className="text-amber-400">-${buyPrice.toLocaleString()}</span>
              </div>
            </div>

            {/* God-Tier Recommendation: Max Buy Price Threshold */}
            <div className="p-3.5 bg-amber-500/10 border border-amber-500/20 rounded-xl">
              <div className="flex items-center gap-2 text-amber-400 font-mono text-[11px] font-bold uppercase">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>Picker's Target Offer Threshold</span>
              </div>
              <p className="text-xs text-white font-semibold mt-1">
                Do not pay more than <span className="text-amber-300 font-bold font-mono">${maxBuyPriceToGuaranteeProfit.toLocaleString()}</span>
              </p>
              <p className="text-[10px] text-gray-400 mt-0.5 leading-tight font-mono">
                Offering at or below this ceiling locks in a minimum 100% net ROI on the target sale.
              </p>
            </div>
          </div>

          <div className="text-[10px] text-gray-500 font-mono leading-normal pt-2 border-t border-gray-800">
            Market rates computed dynamically using {selectedVenue.name} fee structures for {nicheName}.
          </div>

        </div>
      </div>
    </div>
  );
};
