from pathlib import Path 
import joblib

MODEL_PATH = Path(__file__).resolve().parents[1]/"model"/"pcos_model.pkl"
model_bundle = None

def load_model():
    """
    Load Trained model bundle only once at startup
    """

    global model_bundle

    if model_bundle is None:
        print(f"Loading model from : {MODEL_PATH}")
        model_bundle = joblib.load(MODEL_PATH)
    return model_bundle


# Path -> helps build safe file paths
# joblib -> loads the saved ML model(.pkl file)
# __file__ -> current location ; parents[1] -> go one folder up,then to folder model and the file ->pcos_model.pkl
# model_bundle -> it will hold the trained logistic regression model and threshold value