import pandas as pd
import numpy as np
import joblib

print("Loading Diagnostic Pipeline...")

# 1. Load the saved artifacts
try:
    lgb_binary = joblib.load('eeg_binary_screener_model.pkl')
    scaler_coh = joblib.load('eeg_coherence_scaler.pkl')
    pca = joblib.load('eeg_coherence_pca.pkl')
    print("Pipeline loaded successfully!\n")
except FileNotFoundError:
    print("Error: Could not find the .pkl files. Make sure they are in the same folder!")
    exit()

def preprocess_and_predict(file_path):
    print(f"Reading new patient data from: {file_path}")
    # Load the new data
    df_new = pd.read_csv(file_path)
    
    # Keep a copy of patient IDs if you have them (assuming 'no.' is the ID)
    patient_ids = df_new['no.'] if 'no.' in df_new.columns else df_new.index

    # 1. Basic Cleaning
    df_new["sex"] = df_new["sex"].map({"M": 1, "F": 0})
    df_new["education"] = df_new["education"].fillna(df_new["education"].median())
    df_new["IQ"] = df_new["IQ"].fillna(df_new["IQ"].median())

    # 2. Engineer the Clinical Ratios
    frontal_electrodes = ["FP1", "FP2", "F3", "F4", "Fz", "F7", "F8"]
    
    theta_cols = [c for c in df_new.columns if "AB." in c and ".theta." in c and any(e in c for e in frontal_electrodes)]
    beta_cols  = [c for c in df_new.columns if "AB." in c and ".beta."  in c and any(e in c for e in frontal_electrodes)]
    alpha_cols = [c for c in df_new.columns if "AB." in c and ".alpha." in c and any(e in c for e in frontal_electrodes)]

    df_new["Ratio_Theta_Beta"]  = df_new[theta_cols].mean(axis=1) / (df_new[beta_cols].mean(axis=1) + 1e-6)
    df_new["Ratio_Theta_Alpha"] = df_new[theta_cols].mean(axis=1) / (df_new[alpha_cols].mean(axis=1) + 1e-6)
    df_new["Ratio_Alpha_Beta"]  = df_new[alpha_cols].mean(axis=1) / (df_new[beta_cols].mean(axis=1) + 1e-6)

    # 3. Separate Features
    metadata_cols = ["sex", "age", "education", "IQ"]
    ratio_cols = ["Ratio_Theta_Beta", "Ratio_Theta_Alpha", "Ratio_Alpha_Beta"]
    ab_cols = [c for c in df_new.columns if "AB." in c]
    coh_cols = [c for c in df_new.columns if "COH." in c]

    X_base = df_new[metadata_cols + ratio_cols + ab_cols].copy().reset_index(drop=True)

    # 4. Apply Loaded Scaler and PCA (DO NOT use fit_transform here!)
    coh_scaled = scaler_coh.transform(df_new[coh_cols])
    coh_pca_array = pca.transform(coh_scaled)
    
    df_pca = pd.DataFrame(coh_pca_array, columns=[f"COH_PCA_{i}" for i in range(coh_pca_array.shape[1])])
    
    # 5. Assemble Final Matrix
    X_final = pd.concat([X_base, df_pca], axis=1)

    # 6. Make Predictions
    predictions = lgb_binary.predict(X_final)
    probabilities = lgb_binary.predict_proba(X_final)[:, 1] # Probability of being a Patient (Class 1)

    # 7. Format the Output
    results_df = pd.DataFrame({
        'Patient_ID': patient_ids,
        'Risk_Score': np.round(probabilities * 100, 2), # Convert to percentage
        'Diagnosis': ['Patient' if p == 1 else 'Healthy' for p in predictions]
    })
    
    return results_df

# ==========================================
# RUN THE TEST
# ==========================================
# Replace this with a small CSV containing a few rows of raw EEG data to test it
test_file = "path_to_your_new_patient_data.csv" 

try:
    final_results = preprocess_and_predict(test_file)
    print("\n--- Diagnostic Results ---")
    print(final_results.to_string(index=False))
except Exception as e:
    print(f"\nCould not run predictions. Make sure your CSV path is correct and contains the raw EEG columns.")
    print(f"Error details: {e}")