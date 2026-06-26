import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.decomposition import PCA
from sklearn.metrics import classification_report, accuracy_score, roc_curve, auc
from lightgbm import LGBMClassifier

# ==========================================
# 1. DATA LOADING & INITIAL CLEANING
# ==========================================
print("Loading and cleaning data...")
file_path = "EEG.machinelearing_data_BRMH.csv"  # <-- CHANGE THIS TO YOUR FILE PATH
df = pd.read_csv(file_path)

# Fix typos and drop junk columns
df["specific.disorder"] = df["specific.disorder"].replace({"Obsessive compulsitve disorder": "Obsessive compulsive disorder"})
df = df.drop(columns=["no.", "eeg.date", "Unnamed: 122"], errors="ignore")

# Impute missing values (Education and IQ) grouped by disorder
df["education"] = df.groupby("main.disorder")["education"].transform(lambda x: x.fillna(x.median()))
df["IQ"] = df.groupby("main.disorder")["IQ"].transform(lambda x: x.fillna(x.median()))

# Encode Sex (M -> 1, F -> 0)
df["sex"] = df["sex"].map({"M": 1, "F": 0})

# ==========================================
# 2. CREATE BINARY TARGET
# ==========================================
print("Creating Binary Target (0: Healthy, 1: Patient)...")
# 0 if Healthy control, 1 if any psychiatric disorder
df['is_patient'] = np.where(df['main.disorder'] == 'Healthy control', 0, 1)
y_binary = df['is_patient']

print(f"Total Patients: {np.sum(y_binary == 1)} | Total Healthy: {np.sum(y_binary == 0)}")

# ==========================================
# 3. FEATURE ENGINEERING: CLINICAL RATIOS
# ==========================================
print("Engineering clinical EEG biomarkers (Frontal Ratios)...")
frontal_electrodes = ["FP1", "FP2", "F3", "F4", "Fz", "F7", "F8"]

theta_cols = [c for c in df.columns if "AB." in c and ".theta." in c and any(e in c for e in frontal_electrodes)]
beta_cols  = [c for c in df.columns if "AB." in c and ".beta."  in c and any(e in c for e in frontal_electrodes)]
alpha_cols = [c for c in df.columns if "AB." in c and ".alpha." in c and any(e in c for e in frontal_electrodes)]

frontal_theta = df[theta_cols].mean(axis=1)
frontal_beta  = df[beta_cols].mean(axis=1)
frontal_alpha = df[alpha_cols].mean(axis=1)

df["Ratio_Theta_Beta"]  = frontal_theta / (frontal_beta + 1e-6)
df["Ratio_Theta_Alpha"] = frontal_theta / (frontal_alpha + 1e-6)
df["Ratio_Alpha_Beta"]  = frontal_alpha / (frontal_beta + 1e-6)

# ==========================================
# 4. FEATURE SEPARATION & TRAIN/TEST SPLIT
# ==========================================
print("Splitting dataset into 85% Train / 15% Test...")
metadata_cols = ["sex", "age", "education", "IQ"]
ratio_cols = ["Ratio_Theta_Beta", "Ratio_Theta_Alpha", "Ratio_Alpha_Beta"]
ab_cols = [c for c in df.columns if "AB." in c]
coh_cols = [c for c in df.columns if "COH." in c]

X_all = df[metadata_cols + ratio_cols + ab_cols + coh_cols]

# Stratified Split based on the binary target
X_train, X_test, y_train, y_test = train_test_split(
    X_all, y_binary, test_size=0.15, random_state=42, stratify=y_binary
)

# ==========================================
# 5. STRICT NETWORK COMPRESSION (NO LEAKAGE)
# ==========================================
print("Compressing Coherence features via blinded PCA...")
scaler_coh = StandardScaler()
pca = PCA(n_components=15, random_state=42)

# Fit ONLY on Train
coh_train_scaled = scaler_coh.fit_transform(X_train[coh_cols])
coh_train_pca = pca.fit_transform(coh_train_scaled)

# Transform ONLY on Test
coh_test_scaled = scaler_coh.transform(X_test[coh_cols])
coh_test_pca = pca.transform(coh_test_scaled)

# ==========================================
# 6. ASSEMBLE MATRICES
# ==========================================
def build_final_matrix(X_base, coh_pca_array):
    df_base = X_base[metadata_cols + ratio_cols + ab_cols].copy().reset_index(drop=True)
    df_pca = pd.DataFrame(coh_pca_array, columns=[f"COH_PCA_{i}" for i in range(coh_pca_array.shape[1])])
    return pd.concat([df_base, df_pca], axis=1)

X_train_final = build_final_matrix(X_train, coh_train_pca)
X_test_final  = build_final_matrix(X_test, coh_test_pca)

# ==========================================
# 7. MODEL TRAINING (LightGBM)
# ==========================================
print("\nTraining Binary LightGBM Screener...")
lgb_binary = LGBMClassifier(
    n_estimators=150,
    max_depth=4,              
    learning_rate=0.03,       
    class_weight='balanced',  # Crucial for the 850 vs 95 imbalance
    subsample=0.8,            
    colsample_bytree=0.8,     
    random_state=42,
    verbosity=-1,
    n_jobs=-1
)

lgb_binary.fit(X_train_final, y_train)

# ==========================================
# 8. EVALUATION & ROC CURVE
# ==========================================
print("\nEvaluating on Hidden Test Set...")
y_test_pred = lgb_binary.predict(X_test_final)
y_test_probs = lgb_binary.predict_proba(X_test_final)[:, 1] # Get probabilities for Class 1

final_accuracy = accuracy_score(y_test, y_test_pred)

print(f"\n{'='*50}")
print(f"BINARY SCREENING ACCURACY: {final_accuracy:.4f}")
print(f"{'='*50}\n")
print(classification_report(y_test, y_test_pred, target_names=["Healthy Control (0)", "Patient (1)"]))

# Generate ROC Curve
fpr, tpr, thresholds = roc_curve(y_test, y_test_probs)
roc_auc = auc(fpr, tpr)

plt.figure(figsize=(8, 6))
plt.plot(fpr, tpr, color='darkorange', lw=2, label=f'EEG Screener (AUC = {roc_auc:.3f})')
plt.plot([0, 1], [0, 1], color='navy', lw=2, linestyle='--', label='Random Guessing')
plt.xlim([0.0, 1.0])
plt.ylim([0.0, 1.05])
plt.xlabel('False Positive Rate (1 - Specificity)', fontsize=12)
plt.ylabel('True Positive Rate (Sensitivity)', fontsize=12)
plt.title('ROC Curve: Healthy vs. Psychiatric Patient', fontsize=14, fontweight='bold')
plt.legend(loc="lower right", fontsize=12)
plt.grid(True, alpha=0.3)
plt.show()
import joblib

print("\nSaving the complete diagnostic pipeline...")

# 1. Save the Model
joblib.dump(lgb_binary, 'eeg_binary_screener_model.pkl')

# 2. Save the Preprocessing Tools (Crucial!)
joblib.dump(scaler_coh, 'eeg_coherence_scaler.pkl')
joblib.dump(pca, 'eeg_coherence_pca.pkl')

print("Pipeline successfully saved to disk!")
print("Files created:")
print("- eeg_binary_screener_model.pkl")
print("- eeg_coherence_scaler.pkl")
print("- eeg_coherence_pca.pkl")