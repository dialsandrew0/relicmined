import streamlit as st
import sys
import os

# Add root to path so we can import from cv_pipeline and opportunity_engine
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from cv_pipeline.orchestrator import analyze_object
from opportunity_engine.strategy_generator import generate_strategy

st.set_page_config(page_title="RelicMined", layout="wide", page_icon="🔍")

st.title("🔍 RelicMined – Intelligence Excavated")
st.write("Upload a photo of any object to get God Tier identification, valuation, and sales strategy.")

st.divider()

uploaded_file = st.file_uploader("Upload an item photo", type=["jpg", "jpeg", "png"])

if uploaded_file is not None:
    col1, col2 = st.columns([1, 2])

    with col1:
        st.image(uploaded_file, caption="Uploaded photo", use_column_width=True)

    with col2:
        with st.spinner("🤖 Running RelicMined pipeline..."):
            # Save to temp file for PIL to open
            temp_path = f"temp_{uploaded_file.name}"
            with open(temp_path, "wb") as f:
                f.write(uploaded_file.getbuffer())

            result = analyze_object(temp_path)
            strategy = generate_strategy(result)

            # Clean up temp file
            try:
                os.remove(temp_path)
            except OSError:
                pass

        st.subheader("🔎 Object Analysis")
        tab1, tab2, tab3 = st.tabs(["Identity & Condition", "Hidden Value", "Sales Strategy"])

        with tab1:
            st.metric("Identified Object", result.get("identity", "Unknown"))
            st.metric("Condition", result.get("condition", "Unknown"))
            st.metric("Confidence", f"{result.get('confidence', 0) * 100:.0f}%")
            if result.get("recommendations"):
                st.write("**Recommendations:**")
                for rec in result["recommendations"]:
                    st.write(f"- {rec}")

        with tab2:
            st.info(result.get("hidden_value", "No hidden value detected."))

        with tab3:
            st.metric("Primary Route", strategy.get("primary_route", "N/A"))
            st.metric("Value Range", strategy.get("value_range", "N/A"))
            st.metric("Confidence", f"{strategy.get('confidence', 0) * 100:.0f}%")
            if strategy.get("playbook"):
                st.write("**Playbook:**")
                st.write(strategy["playbook"])
else:
    st.info("⬆️ Upload a photo above to get started.")
