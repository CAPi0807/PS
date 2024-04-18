import math
from fastapi import FastAPI
import numpy as np
from uvicorn import *
import json
from fastapi.middleware.cors import CORSMiddleware
import base64

#from myapp.api import api

"""json.dump(
  get_schema_from_app(api),
  open('openapi_schema.json', 'w')
)"""

app = FastAPI()
ans = 0

# Configurar el middleware CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Permite solicitudes desde cualquier origen
    allow_credentials=True,
    allow_methods=["*"],  # Permite todos los métodos HTTP
    allow_headers=["*"],  # Permite todos los encabezados
)

#---------------------------------------------CALCULADORA BÁSICA-------------------------------------------------
@app.get("/")
def estoy_funcionando():
    return "Estoy funcionando"


@app.get("/Ans")
def ans():
    global ans
    if type(ans) != int and type(ans) != float:
        return 0
    return ans

@app.get("/eval/{a}")
def evaluar(a: str):
    a = base64.b64decode(a)
    return eval(a)


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
    if b == 0:
        return "Indeterminación"
    ans = a / b
    return ans


@app.get("/exponente_basico/{a}**{b}")
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
    if a < 0:
        return "Imposible"
    ans = math.sqrt(a)
    return ans


@app.get("/raiz/{b}√{a}")
def raiz_general(a: int, b: int):
    global ans
    ans = a**(1/b)
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

@app.get("/MCM/{a}")
def MCM(a: str):
    numeros = list(map(int, a.split('-')))  # Separar la cadena y convertir los números a enteros

    def mcd(x, y):
        while y:
            x, y = y, x % y
        return x

    def mcm(a, b):
        return abs(a * b) // mcd(a, b)

    resultado = numeros[0]  # Inicializar con el primer número de la lista
    for num in numeros[1:]:
        resultado = mcm(resultado, num)  # Calcular el mcm de los números en la lista

    return resultado

@app.get("/MCD/{a}")
def MCD(a):
    numeros = list(map(int, a.split('-')))  # Separar la cadena y convertir los números a enteros
    def mcd(x, y):
        while y:
            x, y = y, x % y
        return x

    resultado = numeros[0]  # Inicializar con el primer número de la lista
    for num in numeros[1:]:
        resultado = mcd(resultado, num)  # Calcular el mcd de los números en la lista

    return resultado

#---------------------------------------------Constantes-------------------------------------------------

@app.get("/pi")
def pi():
    return math.pi


@app.get("/e")
def e():
    return math.e


@app.get("/carga_electron")
def ce():
    return 1.60217E-19

@app.get("/plank")
def plank():
    return 6.626E-34

@app.get("/boltzmann")
def boltzmann():
    return 1.38E-23


@app.get("/luz")
def c():
    return 2.9979E8

@app.get("/g")
def g():
    return 9.80665

@app.get("/G")
def G():
    return 6.6742E-11

@app.get("/R_gases")
def R():
    return 8.314472E-31

@app.get("/Avogadro")
def Avogadro():
    return 6.0221415E23

@app.get("/cero_absoluto")
def Ok():
    return -273.15

@app.get("/radio_tierra")
def rTierra():
    return 6370000

@app.get("/masa_tierra")
def mTierra():
    return 5.98E24

@app.get("/sol_tierra")
def sol_tierra():
    return 1.5E11

@app.get("/luna_tierra")
def luna_tierra():
    return 3.84E8

@app.get("/radio_sol")
def radio_sol():
    return 6.96E8

@app.get("/radio_luna")
def radio_luna():
    return 1.94E6

@app.get("/orbita_tierra")
def orbita_tierra():
    return 1.50E11

@app.get("/masa_electron")
def me():
    return 9.1093897E-31

@app.get("/masa_proton")
def mp():
    return 1.6726231E-27

@app.get("/masa_neutron")
def mn():
    return 1.6749286E-27

#---------------------------------------------Matrices-------------------------------------------------

"""
@app.get("/suma_matricial/")
def sumar_matrices(matriz1: list[list[int]], matriz2: list[list[int]]):
    matriz1_np = np.array(matriz1)
    matriz2_np = np.array(matriz2)
    resultado = matriz1_np + matriz2_np  # Suma de las dos matrices
    return resultado.tolist()  # Devuelve el resultado como JSON
"""


#---------------------------------------------CONVERSIONES Magnitudes-------------------------------------------------

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


@app.get("/conversion/{conver}/{a}")
def conversion(a: float, conver: str):
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
        "km_a_cm": lambda: a * 100000,
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
        "dl_a_ml": lambda: a * 100,
        "g_a_mg": lambda: a*1000,
        "g_a_kg": lambda: a/1000,
        "mg_a_g": lambda: a * 1000,
        "mg_a_kg": lambda: a / 1000000,
        "kg_a_g": lambda: a * 1000,
        "kg_a_mg": lambda: a *1000000
    }.get(conver, 0)()


@app.get("/masa/{conver}/{a}")
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


@app.get("/masa_imperial/{conver}/{a}")
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


@app.get("/temperatura/{conver}/{a}")
def peso(a: float, conver: str):
    return {
        "C_a_K": lambda: a+273.15,
        "C_a_F": lambda: a*9/5+32,
        "K_a_C": lambda: a - 273.15,
        "K_a_F": lambda: (a - 273.15)*9/5+32,
        "F_a_C": lambda: (a - 32)*5/9,
        "F_a_K": lambda: (a - 32)*5/9+273
    }.get(conver, 0)()

#---------------------------------------------CONVERSIONES Numéricas-------------------------------------------------

@app.get("/decimal_hexadecimal/{a}")
def dec_hex(a: int):
    return hex(a)[2:]


@app.get("/hexadecimal_decimal/{a}")
def dec_hex(a: str):
    return int(a, 16)


@app.get("/decimal_octal/{decimal}")
def decimal_a_octal(decimal: int):
    return int(oct(decimal)[2:])


@app.get("/octal_decimal/{octal}")
def octal_a_decimal(octal: int):
    for cifra in str(octal):
        if cifra == "8" or cifra == "9":
            return "Octal incorrecto"
    return int(str(octal), 8)


@app.get("/octal_hexadecimal/{a}")
def octal_a_hexadecial(a: int):
    for cifra in str(a):
        if cifra == "8" or cifra == "9":
            return "Octal incorrecto"
    return hex(a)[2:]

@app.get("/hexadecimal_octal/{hexadecimal}")
def hex_oct(hexadecimal: str):
    # Convertir hexadecimal a decimal
    decimal = int(hexadecimal, 16)
    # Convertir decimal a octal
    octal = oct(decimal)
    return int(octal[2:])

@app.get("/binario_decimal/{a}")
def binario_a_decimal(a: int):
    for cifra in str(a):
        if cifra > 1:
            return "Binario incorrecto"
    return int(str(a), 2)

@app.get("/binario_hexadecimal/{a}")
def binario_a_hexadecimal(a: int):
    for cifra in str(a):
        if cifra > 1:
            return "Binario incorrecto"
    decimal = int(str(a), 2)
    return hex(decimal)[2:]

@app.get("/binario_octal/{a}")
def binario_a_octal(a: int):
    for cifra in str(a):
        if cifra > 1:
            return "Binario incorrecto"
    decimal = int(str(a), 2)
    return int(oct(decimal)[2:])

@app.get("/decimal_binario/{a}")
def decimal_a_binario(a: int):
    return int(bin(a)[2:])

@app.get("/hexadecimal_binario/{a}")
def hexadecimal_a_binario(a: str):
    a = int(a, 16)
    return int(bin(a)[2:])

@app.get("/octal_binario/{a}")
def octal_a_binario(a: int):
    for cifra in str(a):
        if cifra == "8" or cifra == "9":
            return "Octal incorrecto"

    a = int(str(a), 8)
    return int(bin(a)[2:])
#---------------------------------------------SERVIDOR-------------------------------------------------

# Definir tu ruta raíz (root_path)
root_path = "/calculadora_multiproposito"

# Crear una instancia de Config con la ruta raíz
config = Config(app=app, host="127.0.0.1", port=8000, root_path=root_path)

# Crear una instancia de Server con la configuración
server = Server(config)

# Iniciar el servidor
server.run()

