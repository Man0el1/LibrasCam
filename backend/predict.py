from fastapi import FastAPI
import pickle
import numpy as np

app = FastAPI()

model_dictionary = pickle.load(open('./model.pickle', 'rb'))
model = model_dictionary['model']
