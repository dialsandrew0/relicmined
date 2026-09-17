import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Increase body limit to support large base64 image uploads
  app.use(express.json({ limit: "20mb" }));

  // API endpoint for object analysis
  app.post("/api/analyze", async (req, res) => {
    try {
      const { image, mimeType, niche } = req.body;

      if (!image || !mimeType) {
        return res.status(400).json({ error: "Missing image base64 data or mimeType" });
      }

      const activeNiche = niche || "General / God Tier";
      const apiKey = process.env.GEMINI_API_KEY;

      if (!apiKey) {
        console.warn("[RelicMined] GEMINI_API_KEY is missing. Running in DEMO mode.");
        // Return structured mock data mimicking a Vintage Leica M3 camera or specified niche
        return res.json({
          isDemo: true,
          result: {
            identity: `Vintage Leica M3 Rangefinder Camera (${activeNiche} Specimen)`,
            condition: "Excellent vintage condition, minor brassing on edges, clean viewfinder optics.",
            confidence: 0.95,
            hidden_value: "Equipped with a rare early-production Summicron 50mm f/2 lens (collapsible with red scale markings), worth a 30% collector premium.",
            recommendations: [
              "Inspect the shutter curtains for light leaks using a flashlight from the inside.",
              "Verify if the rangefinder alignment is accurate at infinity focus.",
              "Take detailed macro photos of the serial number on top of the plate."
            ],
            triage: {
              domain: `${activeNiche} & Precision Optics`,
              specialists: ["Curator & Historical Archivist", "Restoration Specialist", "Fine Art & Relic Auctioneer"]
            },
            strategy: {
              primary_route: "Sotheby's Fine Instruments or Specialty Auctions (e.g., Heritage, WestLicht)",
              value_range: "$2,800 - $4,200",
              playbook: "### 1. Optical & Structural Integrity\nEnsure lens elements or structural surfaces are professionally checked for microscopic wear. Preservation is vital.\n\n### 2. Forensic Photography\nDocument all engravings, serial numbers, and physical maker marks. These are key authenticity markers.\n\n### 3. High-Value Collector Outreach\nContact dedicated historical societies and high-end forums before listing publicly to generate competitive private offers.",
              confidence: 0.88
            }
          }
        });
      }

      // Initialize GoogleGenAI client with the key
      const ai = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build",
          },
        },
      });

      // Formulate the prompt tailored to the selected niche
      const promptText = `
        You are the RelicMined multi-agent pipeline (CV Orchestrator, Domain Triage Agent, and Opportunity Engine Strategy Generator).
        
        Selected Niche Category: "${activeNiche}".
        
        Analyze this image through the specialized lens of the "${activeNiche}" collectible and relic market.
        Perform God-tier identification, condition evaluation, hidden/rare attribute discovery, and sales strategy planning.
        Be extremely specific: identify brand, model, artist/creator, approximate year/era, materials, catalog numbers, and physical markers.
        If the item is not traditionally valuable, evaluate its potential market, repurposing, or collectible value to the best of your ability.
      `;

      // Fallback chain of robust computer vision models
      const modelsToTry = ["gemini-3.5-flash", "gemini-2.5-flash", "gemini-1.5-flash"];
      let lastError: any = null;
      let responseText: string | undefined = undefined;
      let modelUsed = "";

      // Helper function for sleeping between retries
      const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

      for (const modelName of modelsToTry) {
        console.log(`[RelicMined] Attempting analysis using model: ${modelName}`);
        let attempts = 3;

        for (let attempt = 1; attempt <= attempts; attempt++) {
          try {
            const response = await ai.models.generateContent({
              model: modelName,
              contents: {
                parts: [
                  {
                    inlineData: {
                      data: image,
                      mimeType: mimeType,
                    },
                  },
                  {
                    text: promptText,
                  },
                ],
              },
              config: {
                responseMimeType: "application/json",
                responseSchema: {
                  type: Type.OBJECT,
                  properties: {
                    identity: { type: Type.STRING, description: "Specific identification: brand, model, approximate year or century of origin, make." },
                    condition: { type: Type.STRING, description: "Detailed visual condition assessment (wear, scratches, patina, completeness, conservation status)." },
                    confidence: { type: Type.NUMBER, description: "Identification confidence score from 0.0 to 1.0 based on visual markers." },
                    hidden_value: { type: Type.STRING, description: "Any rare variations, specific serial marks, specific production features, or markings that could command premium value." },
                    recommendations: {
                      type: Type.ARRAY,
                      items: { type: Type.STRING },
                      description: "2-3 recommendations for physical or forensic verification."
                    },
                    triage: {
                      type: Type.OBJECT,
                      properties: {
                        domain: { type: Type.STRING, description: "The collectible/antique domain classification." },
                        specialists: {
                          type: Type.ARRAY,
                          items: { type: Type.STRING },
                          description: "Key specialist domains or appraisers recommended to examine the item."
                        }
                      },
                      required: ["domain", "specialists"]
                    },
                    strategy: {
                      type: Type.OBJECT,
                      properties: {
                        primary_route: { type: Type.STRING, description: "The optimal sales platform, auction venue, or marketplace." },
                        value_range: { type: Type.STRING, description: "Estimated market value range (e.g., $1,500 - $2,200) based on condition." },
                        playbook: { type: Type.STRING, description: "Step-by-step playbook in clear, actionable paragraphs (using markdown formatting) to maximize sale price, list properly, and handle transactions securely." },
                        confidence: { type: Type.NUMBER, description: "Valuation confidence score from 0.0 to 1.0." }
                      },
                      required: ["primary_route", "value_range", "playbook", "confidence"]
                    }
                  },
                  required: ["identity", "condition", "confidence", "hidden_value", "recommendations", "triage", "strategy"]
                },
              },
            });

            responseText = response.text;
            if (responseText) {
              modelUsed = modelName;
              break; // Success! Break out of the attempt loop
            }
          } catch (err: any) {
            lastError = err;
            const errMsg = err.message || JSON.stringify(err);
            console.warn(`[RelicMined Warning] Attempt ${attempt} of ${attempts} with ${modelName} failed. Error: ${errMsg}`);

            // If it's a 503 (unavailable) or 429 (rate limit/quota), or if we suspect a transient issue, sleep and retry
            const isTransient = errMsg.includes("503") || 
                                errMsg.includes("429") || 
                                errMsg.toUpperCase().includes("UNAVAILABLE") || 
                                errMsg.toUpperCase().includes("RESOURCE_EXHAUSTED") ||
                                errMsg.toUpperCase().includes("SPIKES IN DEMAND") ||
                                errMsg.toUpperCase().includes("TIMEOUT");

            if (isTransient && attempt < attempts) {
              const backoffTime = attempt * 2000;
              console.log(`[RelicMined] Detected transient error. Retrying model ${modelName} in ${backoffTime}ms...`);
              await sleep(backoffTime);
            } else {
              // Not transient or exhausted attempts: exit this attempt loop to fall back to the next model
              console.log(`[RelicMined] Moving on from model ${modelName} due to non-transient error or exhausted attempts.`);
              break;
            }
          }
        }

        if (responseText) {
          console.log(`[RelicMined] Successfully completed analysis using model: ${modelUsed}`);
          break; // Successfully got response, stop trying other models
        }
      }

      if (!responseText) {
        throw new Error(
          `All available Gemini models are currently experiencing high demand or returned errors. Last error: ${
            lastError?.message || JSON.stringify(lastError)
          }`
        );
      }

      const parsedResult = JSON.parse(responseText.trim());
      return res.json({ isDemo: false, result: parsedResult });

    } catch (error: any) {
      console.error("[RelicMined Error] during analysis:", error);
      return res.status(500).json({ error: error.message || "Failed to analyze image with Gemini." });
    }
  });

  // Vite middleware setup for Development, otherwise serve static dist in Production
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[RelicMined] Server running on http://localhost:${PORT} (${process.env.NODE_ENV || "development"} mode)`);
  });
}

startServer();
