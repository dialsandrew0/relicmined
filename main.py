import argparse
import json
from cv_pipeline.orchestrator import analyze_object
from opportunity_engine.strategy_generator import generate_strategy

def main():
    parser = argparse.ArgumentParser(
        description="RelicMined CLI - Run the full pipeline on a single image."
    )
    parser.add_argument("--image", required=True, help="Path to item photo (jpg/png)")
    args = parser.parse_args()

    print(f"Analyzing: {args.image}")
    result = analyze_object(args.image)
    strategy = generate_strategy(result)

    print("\n--- Object Analysis ---")
    print(json.dumps(result, indent=2))

    print("\n--- Sales Strategy ---")
    print(json.dumps(strategy, indent=2))

if __name__ == "__main__":
    main()
