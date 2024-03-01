import uvicorn
from fastapi import FastAPI
from uvicorn import *

app = FastAPI()


@app.get("/")
def estoy_funcionando():
    return "Estoy funcionando"

@app.get("/suma_basica/{a}+{b}")
def suma_basica(a: int, b: int):
    return a + b


@app.get("/resta_basica/{a}-{b}")
def suma_basica(a: int, b: int):
    return a - b


@app.get("/multiplicacion_basica/{a}*{b}")
def suma_basica(a: int, b: int):
    return a * b


@app.get("/division_basica/{a}:{b}")
def suma_basica(a: int, b: int):
    return a / b


@app.get("/exponente_basico/{a}**{b}")
def exponente_basico(a: int, b: int):
    return a ** b


@app.get("/porcentaje/{a}%")
def exponente_basico(a: int):
    return a / 100


uvicorn.run(app, host="127.0.0.1", port=7000)

