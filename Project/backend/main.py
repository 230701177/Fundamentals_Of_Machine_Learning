from fastapi import FastAPI
from pydantic import BaseModel
import joblib
import pandas as pd
from utils.scripts import LocationScore, climateSocre
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

app = FastAPI()

class ClaimInput(BaseModel):
    policyId: int
    incidentType: str
    damageEstimate: float
    policeReportFiled: bool
    hospitalReport: bool
    claimAmount: float
    claimDelayHours: int
    incidentTiming: str
    latitude: float
    longitude: float

def to_claim_input(data: ClaimInput) -> dict:
    return {
        "policyId": data.policyId,
        "IncidentType": data.incidentType,
        "DamageEstimate": data.damageEstimate,
        "PoliceReportFiled": data.policeReportFiled,
        "HospitalReport": data.hospitalReport,
        "ClaimAmount": data.claimAmount,
        "ClaimDelayHours": data.claimDelayHours,
    }

model = joblib.load("insurance_model.pkl")
columns = joblib.load("columns.pkl")
policy_df = pd.read_csv('policies_final.csv')

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def home():
    return {"message": "Backend Running"}

@app.post("/predict")
def predict(data: ClaimInput):
    try:
        claimInput = to_claim_input(data)
        df = pd.DataFrame([claimInput])
        merged_df = df.merge(policy_df, on='policyId')
        if not merged_df.empty:
            df['ClaimToCoverageRatio'] = merged_df['ClaimAmount'] / merged_df['CoverageAmount']
            df['DamageToClaimRatio'] = merged_df['ClaimAmount'] / merged_df['DamageEstimate']
            df['ClaimDelayRiskScore'] = merged_df['ClaimDelayHours'] / 240
            df['CoverageToPremiumRatio'] = merged_df['CoverageAmount'] / merged_df['PremiumAmount']
            df['ClaimHistoryRisk'] = merged_df['PreviousClaimsTotal'] / 20
            df['ClaimFrequencyLastYear'] = merged_df['ClaimFrequencyLastYear'] / 10
        else:
            df['ClaimToCoverageRatio'] = 0.5
            df['DamageToClaimRatio'] = 0.5
            df['ClaimDelayRiskScore'] = 0.1
            df['CoverageToPremiumRatio'] = 20.0
            df['ClaimHistoryRisk'] = 0.1
            df['ClaimFrequencyLastYear'] = 0.1
        df = pd.get_dummies(df, columns=['IncidentType'])
        df = df.reindex(columns=columns, fill_value=0)
        df['LocationRiskScore'] = LocationScore(data.latitude, data.longitude)
        df['ClimateConditionScore'] = climateSocre(data.latitude, data.longitude, data.incidentTiming)
        output = model.predict_proba(df)[0]
        return {
            'status': 'success',
            'data': {
                'approval_probability': float(output[1]),
                'rejection_probability': float(output[0]),
                'location_risk': float(df['LocationRiskScore'].iloc[0]),
                'climate_risk': float(df['ClimateConditionScore'].iloc[0])
            }
        }
    except Exception as e:
        print(f"Backend Prediction Error: {e}")
        return {
            'status': 'error',
            'message': str(e),
            'data': {
                'approval_probability': 0.5,
                'rejection_probability': 0.5,
                'location_risk': 0.25,
                'climate_risk': 0.15
            }
        }

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=5000, reload=True)