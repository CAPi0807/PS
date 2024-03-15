import math
from fastapi import FastAPI
import numpy as np
from uvicorn import *
import json


from fastapi.middleware.cors import CORSMiddleware





#from myapp.api import api

"""json.dump(
  get_schema_from_app(api),
  open('openapi_schema.json', 'w')
)"""

app = FastAPI()
ans = 0


#---------------------------------------------CALCULADORA BÁSICA-------------------------------------------------
@app.get("/")
def estoy_funcionando():
    return "¿Cuál es el motivo de nuestra existencia?"


@app.get("/Ans")
def ans():
    global ans
    if type(ans) != int and type(ans) != float:
        return 0
    return ans


@app.get("/suma_basica/{a}+{b}")
def suma_basica(a: int, b: int):
    global ans
    ans = a + b
    return ans


@app.get("/resta_basica/{a}-{b}")
def suma_basica(a: int, b: int):
    global ans
    ans = a - b
    return ans


@app.get("/multiplicacion_basica/{a}*{b}")
def suma_basica(a: int, b: int):
    global ans
    ans = a * b
    return ans


@app.get("/division_basica/{a}÷{b}")
def suma_basica(a: int, b: int):
    global ans
    ans = a / b
    return ans


@app.get("/exponente_basico/{a}^{b}")
def exponente_basico(a: int, b: int):
    global ans
    ans = a ** b
    return ans


@app.get("/porcentaje/{a}%")
def porcentaje(a: int):
    global ans
    ans = a / 100
    return ans

#---------------------------------------------CALCULADORA CIENTÍFICA-------------------------------------------------

@app.get("/raiz_cuadrada/√{a}")
def raiz_cuadrada(a: int):
    global ans
    ans = math.sqrt(a)
    return ans


@app.get("/raiz/{a}√{b}")
def raiz_general(a: int, b: int):
    global ans
    ans = b**(1/a)
    return ans


@app.get("/seno/sin({a})")
def seno(a: int):
    global ans
    ans = math.sin(a)
    return ans


@app.get("/coseno/cos({a})")
def coseno(a: int):
    global ans
    ans = math.cos(a)
    return ans


@app.get("/tangente/tan({a})")
def tangente(a: int):
    global ans
    ans = math.tan(a)
    return ans


@app.get("/logaritmo/log({a}, {b})")
def logaritmo(a: int, b: int):
    global ans
    ans = math.log(a, b)
    return ans


@app.get("/pi")
def pi():
    return math.pi


@app.get("/e")
def e():
    return math.e


#---------------------------------------------Matrices-------------------------------------------------

"""
@app.get("/suma_matricial/")
def sumar_matrices(matriz1: list[list[int]], matriz2: list[list[int]]):
    matriz1_np = np.array(matriz1)
    matriz2_np = np.array(matriz2)
    resultado = matriz1_np + matriz2_np  # Suma de las dos matrices
    return resultado.tolist()  # Devuelve el resultado como JSON


#---------------------------------------------CONVERSIONES-------------------------------------------------

@app.get("/distancia/{conver}/{a}")
def distancia(a: float, conver: str):
    return {
        "m_a_km": lambda: a/1000,
        "km_a_m": lambda: a*1000,
        "m_a_cm": lambda: a * 100,
        "m_a_mm": lambda: a * 1000,
        "mm_a_m": lambda: a / 1000,
        "cm_a_m": lambda: a / 100,
        "mm_a_km": lambda: a / 1000000,
        "cm_a_km": lambda: a / 100000,
        "mm_a_cm": lambda: a / 10,
        "cm_a_mm": lambda: a * 10,
        "km_a_mm": lambda: a * 1000000,
        "km_a_cm": lambda: a * 100000
    }.get(conver, 0)()


@app.get("/volumen/{conver}/{a}")
def volumen(a: float, conver: str):
    return {
        "l_a_ml": lambda: a*1000,
        "l_a_cl": lambda: a*100,
        "l_a_dl": lambda: a * 10,
        "ml_a_l": lambda: a / 1000,
        "ml_a_dl": lambda: a / 100,
        "ml_a_cl": lambda: a / 10,
        "cl_a_l": lambda: a / 100,
        "cl_a_dl": lambda: a / 10,
        "cl_a_mm": lambda: a * 10,
        "dl_a_l": lambda: a / 10,
        "dl_a_cl": lambda: a * 10,
        "dl_a_ml": lambda: a * 100
    }.get(conver, 0)()


@app.get("/peso/{conver}/{a}")
def peso(a: float, conver: str):
    return {
        "g_a_mg": lambda: a*1000,
        "g_a_kg": lambda: a/1000,
        "mg_a_g": lambda: a * 1000,
        "mg_a_kg": lambda: a / 1000000,
        "kg_a_g": lambda: a * 1000,
        "kg_a_mg": lambda: a *1000000
    }.get(conver, 0)()


@app.get("/distancia_imperial/{conver}/{a}")
def distancia_imperial(a: float, conver: str):
    return {
        "pulgada_a_m": lambda: a*0.0254,
        "pie_a_m": lambda: a*0.3048,
        "yarda_a_m": lambda: a * 0.9144,
        "milla_a_m": lambda: a * 1609.34,
        "pulgada_a_km": lambda: a * 2.54e-5,
        "pie_a_km": lambda: a * 0.0003048,
        "yarda_a_km": lambda: a * 0.0009144,
        "milla_a_km": lambda: a * 1.60934,
        "m_a_pulgada": lambda: a * 39.3701,
        "m_a_pie": lambda: a * 3.28084,
        "m_a_yarda": lambda: a * 1.09361,
        "m_a_milla": lambda: a * 0.000621371,
        "km_a_pulgada": lambda: a * 39370.1,
        "km_a_pie": lambda: a * 3280.84,
        "km_a_yarda": lambda: a * 1093.61333,
        "km_a_milla": lambda: a * 0.621371
    }.get(conver, 0)()


@app.get("/peso_imperial/{conver}/{a}")
def peso_imperial(a: float, conver: str):
    return {
        "g_a_onza": lambda: a*0.035274,
        "g_a_libra": lambda: a*0.00220462,
        "mg_a_onza": lambda: a * 3.5274e-5,
        "mg_a_libra": lambda: a * 2.2046e-6,
        "kg_a_onza": lambda: a * 35.274,
        "kg_a_libra": lambda: a * 2.20462,
        "onza_a_g": lambda: a * 28.3495,
        "libra_a_g": lambda: a * 453.592,
        "onza_a_mg": lambda: a * 28349.5,
        "libra_mg": lambda: a * 453592,
        "onza_a_kg": lambda: a * 0.0283495,
        "libra_a_kg": lambda: a * 0.453592
    }.get(conver, 0)()

"""
#---------------------------------------------SERVIDOR-------------------------------------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:63342"],  # Agrega tu dominio
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
# Definir tu ruta raíz (root_path)
root_path = "/"

# Crear una instancia de Config con la ruta raíz
config = Config(app=app, host="127.0.0.1", port=8000, root_path=root_path)

# Crear una instancia de Server con la configuración
server = Server(config)

# Iniciar el servidor
#server.run()

