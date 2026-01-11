from fastapi import FastAPI
from .model_loader import load_model
from pydantic import BaseModel
import pandas as pd

#creates fastAPI application instance
app=FastAPI(
    title= "PCOS ML-Service",
    description="Serves PCOS predictions",
    version="1.0"
)

# @app.on_event("startup")
# def startup_event():
#     load_model()
#     print("Model loaded & ready")

# BaseModel  used to define input schemas
class PatientInput(BaseModel):
    skin_darkening: int
    hair_growth: int
    weight_gain: int
    cycle_type: int
    fast_food: int
    pimples: int
    weight: float
    bmi: float
    hair_loss: int
    waist: float
    age: int
    menstrual_days: int
    marriage_yrs: int

@app.get("/health")#every 5 minutes uptime robot pings ml/health route
def health():
    return {"status": "ok"}


@app.post("/predict")
def predict(input : PatientInput):
    bundle = load_model()
    model = bundle["model"]
    threshold = bundle["threshold"]

    selected_features = [
        "Skin_Darkening", "Hair_Growth", "Weight_Gain", "Cycle_Type",
        "Fast_Food", "Pimples", "Weight", "BMI", "Hair_Loss", "Waist",
        "Age", "Menstrual_Days", "Marriage_Years"
    ]

    # creating a row for table : values input. and col names are selected features
    features_df = pd.DataFrame([[
        input.skin_darkening,
        input.hair_growth,
        input.weight_gain,
        input.cycle_type,
        input.fast_food,
        input.pimples,
        input.weight,
        input.bmi,
        input.hair_loss,
        input.waist,
        input.age,
        input.menstrual_days,
        input.marriage_yrs
    ]], columns=selected_features)

    # predict_proba ->[P(no-pcos), P(pcos)]

    proba = float(model.predict_proba(features_df)[:, 1][0])
    risk_label = "high" if proba >= threshold else "low"

    return {
        "probability":proba,
        "risk_label":risk_label
    }
