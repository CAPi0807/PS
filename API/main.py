import math
from fastapi import FastAPI
from uvicorn import *

app = FastAPI()
ans = 0


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


@app.get("/division_basica/{a}:{b}")
def suma_basica(a: int, b: int):
    global ans
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


@app.get("/raiz_cuadrada/√{a}")
def raiz_cuadrada(a: int):
    global ans
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
def logaritmo_10(a: int, b: int):
    global ans
    ans = math.log(a, b)
    return ans


# Definir tu ruta raíz (root_path)
root_path = "/calculadora_multiproposito"

# Crear una instancia de Config con la ruta raíz
config = Config(app=app, host="127.0.0.1", port=8000, root_path=root_path)

# Crear una instancia de Server con la configuración
server = Server(config)

# Iniciar el servidor
server.run()

