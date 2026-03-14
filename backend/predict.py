from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import pickle
import numpy as np

app = FastAPI()

origins = [
  "http://localhost:3000",
  "https://librascam.vercel.app"
]

app.add_middleware(
  CORSMiddleware,
  allow_origins=origins,
  allow_credentials=True,
  allow_methods=["*"],
  allow_headers=["*"],
)
class HandData(BaseModel):
  data: list

model_dictionary = pickle.load(open('./model.pickle', 'rb'))
model = model_dictionary['model']

@app.post("/predict")
def predict(hand: HandData):
  arr = np.array(hand.data).reshape(1, -1)
  prediction = model.predict(arr)[0]
  confidence = float(np.max(model.predict_proba(arr)))
  return {"letter": prediction, "confidence": confidence}
