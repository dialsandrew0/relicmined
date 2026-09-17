import { 
  Sparkles, 
  Palette, 
  Camera, 
  Clock, 
  Coins, 
  BookOpen, 
  Shield, 
  Crown,
  Layers
} from "lucide-react";

export interface NicheInfo {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  icon: any;
  color: string;
}

export interface PresetItem {
  id: string;
  nicheSlug: string;
  name: string;
  subtitle: string;
  image: string;
  result: {
    identity: string;
    condition: string;
    confidence: number;
    hidden_value: string;
    recommendations: string[];
    triage: {
      domain: string;
      specialists: string[];
    };
    strategy: {
      primary_route: string;
      value_range: string;
      playbook: string;
      confidence: number;
    };
  };
}

export const NICHES: NicheInfo[] = [
  {
    id: "generalgod",
    slug: "generalgod",
    name: "General / God Tier",
    tagline: "Universal High-Value Discovery Across All Categories",
    icon: Sparkles,
    color: "from-amber-500 to-yellow-600"
  },
  {
    id: "artperiod",
    slug: "artperiod",
    name: "Fine Art & Period Artifacts",
    tagline: "Oil Paintings, Bronzes, Sculptures & Classical Antiques",
    icon: Palette,
    color: "from-purple-500 to-indigo-600"
  },
  {
    id: "vintage_tech",
    slug: "vintage_tech",
    name: "Vintage Tech & Optics",
    tagline: "Rangefinder Cameras, Computing Relics & Precision Gear",
    icon: Camera,
    color: "from-blue-500 to-cyan-600"
  },
  {
    id: "horology",
    slug: "horology",
    name: "Horology & Fine Watches",
    tagline: "Vintage Rolex, Patek Philippe, Omega & Chronographs",
    icon: Clock,
    color: "from-emerald-500 to-teal-600"
  },
  {
    id: "jewelry_coins",
    slug: "jewelry_coins",
    name: "Jewelry, Metals & Coins",
    tagline: "Ancient Coins, Hallmarked Silver & Estate Gold Jewelry",
    icon: Coins,
    color: "from-yellow-500 to-amber-600"
  },
  {
    id: "comics_cards",
    slug: "comics_cards",
    name: "Comics & Trading Cards",
    tagline: "Graded Comic Books, Trading Cards & Pop Culture Relics",
    icon: Layers,
    color: "from-rose-500 to-red-600"
  },
  {
    id: "rare_books",
    slug: "rare_books",
    name: "Rare Books & Autographs",
    tagline: "First Editions, Illuminated Manuscripts & Letters",
    icon: BookOpen,
    color: "from-amber-600 to-orange-700"
  },
  {
    id: "militaria",
    slug: "militaria",
    name: "Militaria & Historical Relics",
    tagline: "Medals, Historical Arms, Field Equipment & Badges",
    icon: Shield,
    color: "from-zinc-500 to-stone-700"
  },
  {
    id: "luxury_apparel",
    slug: "luxury_apparel",
    name: "Luxury Goods & Fashion",
    tagline: "Vintage Hermès, Haute Couture & Fine Leatherwork",
    icon: Crown,
    color: "from-pink-500 to-rose-600"
  }
];

export function getNicheBySlug(slug: string): NicheInfo {
  const normalized = (slug || "").toLowerCase().replace(/\s+/g, "");
  if (normalized.includes("art") || normalized.includes("period")) return NICHES[1];
  if (normalized.includes("tech") || normalized.includes("camera") || normalized.includes("optics")) return NICHES[2];
  if (normalized.includes("watch") || normalized.includes("horology")) return NICHES[3];
  if (normalized.includes("coin") || normalized.includes("jewelry") || normalized.includes("silver")) return NICHES[4];
  if (normalized.includes("comic") || normalized.includes("card")) return NICHES[5];
  if (normalized.includes("book") || normalized.includes("manuscript")) return NICHES[6];
  if (normalized.includes("militaria") || normalized.includes("arms")) return NICHES[7];
  if (normalized.includes("luxury") || normalized.includes("fashion")) return NICHES[8];
  return NICHES[0]; // Default to General/God Tier
}

export const SAMPLE_PRESETS: PresetItem[] = [
  {
    id: "preset-leica",
    nicheSlug: "vintage_tech",
    name: "Vintage Leica M3 Rangefinder",
    subtitle: "Double Stroke (1954) w/ Summicron Lens",
    image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&q=80&w=800",
    result: {
      identity: "Vintage Leica M3 Rangefinder (Double Stroke, 1954)",
      condition: "Excellent physical condition, minor brassing on edges, bright viewfinder optics.",
      confidence: 0.95,
      hidden_value: "Fitted with a rare early-production Summicron 50mm f/2 collapsible lens featuring red-scale markings. Extremely desired by vintage optics purists.",
      recommendations: [
        "Inspect the horizontal shutter silk curtain for small pinholes using a bright backlight.",
        "Check that the rangefinder spot converges perfectly at infinity focus.",
        "Verify the serial number engraved on top plate to match first-batch production logs."
      ],
      triage: {
        domain: "Vintage Photography & Precision Optics",
        specialists: ["Leica Historical Society Archivist", "Classic Optical Restorer", "Collectible Camera Specialist"]
      },
      strategy: {
        primary_route: "Sotheby's Fine Instruments or WestLicht Specialty Camera Auctions",
        value_range: "$2,800 - $4,500 USD",
        playbook: "### 1. Highlight Provenance\nProvide any historical receipts or original leather case. Collectors pay a premium for complete sets.\n\n### 2. Microscopic Glass Inspection\nInclude clear photos looking straight through the glass under strong light to prove the lack of modern lens fungus.\n\n### 3. Escrow Protective Billing\nDue to high global camera fraud, ship with premium signature tracking and use escrow payment methods.",
        confidence: 0.92
      }
    }
  },
  {
    id: "preset-art-oil",
    nicheSlug: "artperiod",
    name: "18th C. Dutch Master Oil Painting",
    subtitle: "Luminist Seascape on Wooden Panel",
    image: "https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&q=80&w=800",
    result: {
      identity: "18th Century Dutch School Oil on Oak Panel (Attributed Circle of Ludolf Bakhuizen)",
      condition: "Very good conservator state. Stable craquelure pattern consistent with period oak panels. Original carved gilded frame.",
      confidence: 0.91,
      hidden_value: "Infrared reflectography reveals a monogram signature in lower left corner under old varnish layer, potentially lifting valuation into tier 1 Master status.",
      recommendations: [
        "Conduct UV light illumination test to confirm extent of historical overpainting.",
        "Examine panel joinery on reverse for period butterfly cleats.",
        "Obtain a certified dendrochronology analysis of the oak panel."
      ],
      triage: {
        domain: "Old Master Paintings & European Fine Art",
        specialists: ["Dutch Golden Age Curator", "Fine Art Conservator", "Sotheby's Old Masters Appraiser"]
      },
      strategy: {
        primary_route: "Bonhams or Christie's European Old Masters Evening Sale",
        value_range: "$8,500 - $14,000 USD",
        playbook: "### 1. Rarity & Craquelure Provenance\nHighlight the authentic age-related craquelure pattern under 20x magnification to prove non-synthetic origin.\n\n### 2. Consignment Negotiations\nRequest catalog cover placement in specialty Old Master auctions to maximize competitive bidding.\n\n### 3. Museum Inquiries\nReach out to regional maritime art museums prior to public auction to gauge institutional acquisition interest.",
        confidence: 0.89
      }
    }
  },
  {
    id: "preset-rolex",
    nicheSlug: "horology",
    name: "Rolex Submariner Ref. 5513",
    subtitle: "Maxi Dial (1978) w/ Ghost Bezel",
    image: "https://images.unsplash.com/photo-1547996160-81dfa63595aa?auto=format&fit=crop&q=80&w=800",
    result: {
      identity: "Vintage Rolex Submariner Ref. 5513 (Maxi Dial, circa 1978)",
      condition: "Good overall vintage condition. Original bezel insert has faded to a beautiful ghost gray patina. Case shows light honest wear.",
      confidence: 0.93,
      hidden_value: "Retains original tritium hour markers which have aged into an exquisite creamy pumpkin color. Hands are original and match the dial patina perfectly.",
      recommendations: [
        "Open caseback to check for cal. 1520 movement stamping and verify reference numbers inside the caseback.",
        "Avoid any polish or scratch-removal services, as unpolished cases preserve maximum antique watch value.",
        "Check tritium glow capability under UV light—original tritium should flare and fade rapidly."
      ],
      triage: {
        domain: "Horology & Luxury Timepieces",
        specialists: ["Vintage Rolex Historian", "Professional Watchmaker (WOSTEP-certified)", "Fine Watch Auction Appraiser"]
      },
      strategy: {
        primary_route: "Chrono24 Premium Seller, specialized forums (Vintage Rolex Market), or Sotheby's",
        value_range: "$11,500 - $14,000 USD",
        playbook: "### 1. Document No-Polish Status\nCollectors demand unpolished sharp chamfers. Take macro pictures of the case edges to demonstrate original bevels.\n\n### 2. Timegrapher Performance Proof\nShow a photo of the watch on a timegrapher showing amplitude and daily variance. It builds immense trust.\n\n### 3. Ghost Bezel Value Lift\nEnsure the description highlights the authentic 'ghost' bezel patina—do not replace it with a modern service insert.",
        confidence: 0.90
      }
    }
  },
  {
    id: "preset-coin",
    nicheSlug: "jewelry_coins",
    name: "Constantine I Bronze Follis Coin",
    subtitle: "Siscia Mint (318 AD) - Roman Empire",
    image: "https://images.unsplash.com/photo-1621972750749-0fbb1abb7736?auto=format&fit=crop&q=80&w=800",
    result: {
      identity: "Late Roman Bronze Follis Coin (Constantine I, Siscia Mint, 318 AD)",
      condition: "Very Fine (VF). Dark olive-green patina. Outstanding portrait details and complete reverse legend 'VIRTVS EXERCIT'.",
      confidence: 0.89,
      hidden_value: "Features an uncommon mintmark variation '.SIS*' in the exergue, identifying the fifth officina (workshop) of the Siscia mint.",
      recommendations: [
        "Examine the edge profile under 10x magnification to rule out cast modern counterfeits.",
        "Measure exact weight in grams (should be around 3.1g) and diameter (approx 19mm) to confirm authenticity.",
        "Store in an acid-free archival PVC-free coin flip to prevent bronze disease degradation."
      ],
      triage: {
        domain: "Ancient Numismatics & Archaeology",
        specialists: ["Roman Empire Numismatist", "Archaeological Metallurgist", "Ancient Coin Grading Specialist"]
      },
      strategy: {
        primary_route: "VCoins marketplace, MA-Shops, or specialized ancient auctions (e.g., CNG, Leu)",
        value_range: "$180 - $280 USD",
        playbook: "### 1. Professional Attribution\nProvide the standard RIC (Roman Imperial Coinage) catalog reference number: RIC VII Siscia 48.\n\n### 2. Clear Lighting Angles\nAncient coins need side-lit macro photos (axial lighting) to clearly define the emperor's facial features and letters.\n\n### 3. Legal Compliance\nEnsure you list the provenance (historical origin or purchase records) to comply with international cultural heritage rules.",
        confidence: 0.87
      }
    }
  },
  {
    id: "preset-comic",
    nicheSlug: "comics_cards",
    name: "Action Comics #1 Replica/Early Print",
    subtitle: "First Appearance of Superman (1938)",
    image: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&q=80&w=800",
    result: {
      identity: "Action Comics #1 (Golden Age DC Comics, June 1938)",
      condition: "Mid-Grade (CGC 4.0 Restored / Off-White Pages). Light spine stress, minor color touch.",
      confidence: 0.94,
      hidden_value: "Contains the historic first appearance of Superman by Jerry Siegel & Joe Shuster. Even early reprints or mid-grade originals command astronomical collector demand.",
      recommendations: [
        "Submit for professional encapsulation & grading by CGC (Certified Guaranty Company).",
        "Perform page-count audit to verify all 64 original interior pages and centerfold are present.",
        "Check for invisible restoration under blacklight."
      ],
      triage: {
        domain: "Golden Age Comics & Pop Culture Relics",
        specialists: ["CGC Senior Grader", "Pop Culture Archivist", "Heritage Auctions Comic Director"]
      },
      strategy: {
        primary_route: "Heritage Auctions Signature Comic & Pop Culture Event",
        value_range: "$150,000 - $450,000 USD",
        playbook: "### 1. Professional CGC Encapsulation\nNever sell ungraded Golden Age keys. CGC grading provides universal liquidity and buyer security.\n\n### 2. High-Profile Auction Marketing\nFeature in major comic collecting publications prior to premier Heritage or ComicConnect auctions.\n\n### 3. Insured Vault Storage\nKeep in climate-controlled UV-shielded vault storage with full maritime transport insurance.",
        confidence: 0.91
      }
    }
  }
];
