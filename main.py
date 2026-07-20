import streamlit as st
from cv_pipeline.orchestrator import analyze_object
from opportunity_engine.strategy_generator import generate_strategy

st.title("RelicMined - Object Intelligence Platform")
uploaded_file = st.file_uploader("Upload photo of object", type=["jpg", "png"])

if uploaded_file:
    st.image(uploaded_file)
    result = analyze_object(uploaded_file)
    st.json(result)
    
    strategy = generate_strategy(result)
    st.subheader("Sales Strategy")
    st.write(strategy)