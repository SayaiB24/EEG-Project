from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import pandas as pd
import numpy as np
import joblib
import os

app = FastAPI(title="IMHMA EEG Diagnostic Edge Server")

# Enable Cross-Origin Resource Sharing (CORS) so your frontend website can talk to it
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Change to your specific frontend URL in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load your pre-trained pipeline tools globally
try:
    lgb_binary = joblib.load('eeg_binary_screener_model.pkl')
    scaler_coh = joblib.load('eeg_coherence_scaler.pkl')
    pca = joblib.load('eeg_coherence_pca.pkl')
    print("🧠 Diagnostic pipeline successfully bound to server memory.")
except FileNotFoundError:
    print("⚠️ Error: Missing .pkl pipeline files in the server directory.")

DATASET_PATH = "EEG.machinelearing_data_BRMH.csv"

class DiagnosticRequest(BaseModel):
    participant_id: str
    overall_score_pct: float

@app.post("/api/diagnose")
def run_eeg_pipeline(request: DiagnosticRequest):
    if not os.path.exists(DATASET_PATH):
        raise HTTPException(status_code=500, detail="Reference EEG dataset repository missing.")
    
    # 1. READ DATASET POOL FOR SIMULATION
    df_pool = pd.read_csv(DATASET_PATH)
    
    # Clean typos as done during training phase
    df_pool["specific.disorder"] = df_pool["specific.disorder"].replace(
        {"Obsessive compulsitve disorder": "Obsessive compulsive disorder"}
    ) # 
    
    # 2. MATCH SIMULATED BIOMARKER SIGNATURE
    # If IMHMA survey indicates stress/mood traits (>25%), pull an anonymized patient row; otherwise, a control.
    if request.overall_score_pct > 25.0:
        sample_pool = df_pool[df_pool['main.disorder'] != 'Healthy control'] # [cite: 1032]
    else:
        sample_pool = df_pool[df_pool['main.disorder'] == 'Healthy control'] # [cite: 1032]
        
    if sample_pool.empty:
        sample_pool = df_pool

    # Extract exactly 1 random row to simulate a streaming input channel configuration
    mock_eeg_row = sample_pool.sample(n=1).copy()
    
    # 3. PIPELINE PREPROCESSING & COMPUTATION
    try:
        mock_eeg_row["sex"] = mock_eeg_row["sex"].map({"M": 1, "F": 0}) # 
        mock_eeg_row["education"] = mock_eeg_row["education"].fillna(df_pool["education"].median()) # 
        mock_eeg_row["IQ"] = mock_eeg_row["IQ"].fillna(df_pool["IQ"].median()) # 

        # Calculate Frontal Brainwave Ratios (Clinical Domain Feature Engineering)
        frontal_electrodes = ["FP1", "FP2", "F3", "F4", "Fz", "F7", "F8"] # 
        
        theta_cols = [c for c in mock_eeg_row.columns if "AB." in c and ".theta." in c and any(e in c for e in frontal_electrodes)] # 
        beta_cols  = [c for c in mock_eeg_row.columns if "AB." in c and ".beta."  in c and any(e in c for e in frontal_electrodes)] # 
        alpha_cols = [c for c in mock_eeg_row.columns if "AB." in c and ".alpha." in c and any(e in c for e in frontal_electrodes)] # 

        # Handle potential zero-division dynamically via a small epsilon value (1e-6)
        mock_eeg_row["Ratio_Theta_Beta"]  = mock_eeg_row[theta_cols].mean(axis=1) / (mock_eeg_row[beta_cols].mean(axis=1) + 1e-6) # 
        mock_eeg_row["Ratio_Theta_Alpha"] = mock_eeg_row[theta_cols].mean(axis=1) / (mock_eeg_row[alpha_cols].mean(axis=1) + 1e-6) # 
        mock_eeg_row["Ratio_Alpha_Beta"]  = mock_eeg_row[alpha_cols].mean(axis=1) / (mock_eeg_row[beta_cols].mean(axis=1) + 1e-6) # 

        # Segregate feature sets
        metadata_cols = ["sex", "age", "education", "IQ"] # 
        ratio_cols = ["Ratio_Theta_Beta", "Ratio_Theta_Alpha", "Ratio_Alpha_Beta"] # 
        ab_cols = [c for c in mock_eeg_row.columns if "AB." in c] # 
        coh_cols = [c for c in mock_eeg_row.columns if "COH." in c] # 

        X_base = mock_eeg_row[metadata_cols + ratio_cols + ab_cols].copy().reset_index(drop=True) # 

        # 4. BLIND RE-SCALING & NETWORK COHERENCE COMPRESSION
        coh_scaled = scaler_coh.transform(mock_eeg_row[coh_cols]) # 
        coh_pca_array = pca.transform(coh_scaled) # 
        
        df_pca = pd.DataFrame(coh_pca_array, columns=[f"COH_PCA_{i}" for i in range(coh_pca_array.shape[1])]) # 
        X_final = pd.concat([X_base, df_pca], axis=1) # 

        # 5. EXECUTE DIAGNOSTIC INFERENCE
        prediction = lgb_binary.predict(X_final)[0] # 
        probability = lgb_binary.predict_proba(X_final)[0, 1] # 
        
        return {
            "participant_id": request.participant_id,
            "status": "Success",
            "biomarkers": {
                "theta_beta_ratio": round(float(mock_eeg_row["Ratio_Theta_Beta"].iloc[0]), 3),
                "theta_alpha_ratio": round(float(mock_eeg_row["Ratio_Theta_Alpha"].iloc[0]), 3)
            },
            "analysis": {
                "cortical_risk_score": round(float(probability) * 100, 2),
                "classification_label": "Clinical Variance Detected" if prediction == 1 else "Healthy Baseline Clear"
            }
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Inference Engine Critical Error: {str(e)}")