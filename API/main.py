import math
from fastapi import FastAPI
import numpy as np
from uvicorn import *
import json
from fastapi.middleware.cors import CORSMiddleware
import base64
import statistics


# from myapp.api import api


"""json.dump(
  get_schema_from_app(api),
  open('openapi_schema.json', 'w')
)"""

app = FastAPI()
ans = 0
hist = {}

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
def Ans():
    global ans
    if type(ans) != int and type(ans) != float:
        return 0
    return ans


@app.get("/historial")
def historial():
    if len(hist) == 0:
        return "Aún no ha hecho ninguna operación"
    return hist


"""
Para suma: +
Para resta: -
Para multiplicación: *
Para división: /
Para potencias: ** o pow(x, potencia)
Para raíces: math.sqrt() o pow(x, 1/potencia)
Para seno: math.sin()
Para coseno: math.cos()
Para tangentes: math.tan()
Para logaritmos: math.log(x, base)
"""

@app.get("/eval/{a}")
def evaluar(a: str):
    global ans
    a = base64.b64decode(a)
    for i in range(len(a)):
        if (a[i] == 47 and a[i+1] == 48)\
                or (a[i] == 45 and a[i-2] == 116)\
                or (a[i] == 119 and a[i+2] == 45 and a[-2] % 2 == 0):  # divisiones entre 0 y raíces negativas
            return "operación imposible"
    hist[a] = eval(a)
    ans = hist[a]
    return ans


#Formato de entrada: i-i-i-i...
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


@app.get("/media/{a}")
def media(a: str):
    numeros = list(map(int, a.split('-')))  # Separar la cadena y convertir los números a enteros
    return statistics.mean(numeros)


@app.get("/moda/{a}")
def moda(a: str):
    numeros = list(map(int, a.split('-')))  # Separar la cadena y convertir los números a enteros
    return statistics.mode(numeros)




#---------------------------------------------Matrices-------------------------------------------------
def convertir_a_matriz(cadena):
    conjuntos = cadena.split(";")
    lista_de_listas = []
    for conjunto in conjuntos:
        numeros = conjunto.split(",")
        lista_de_numeros = [int(num) for num in numeros]
        lista_de_listas.append(lista_de_numeros)
    matriz = np.array(lista_de_listas)
    return matriz


"""
Formato de entrada de matrices:
x,x,x;x,x,x;x,x,x
los números se separan por ,.
Las filas se separan por ;.
"""
@app.get("/suma_matricial/{matriz1}+{matriz2}")
def sumar_matrices(matriz1: str, matriz2: str):

    matriz1_np = convertir_a_matriz(matriz1)
    matriz2_np = convertir_a_matriz(matriz2)

    matriz_suma = matriz1_np + matriz2_np

    return matriz_suma.tolist()

@app.get("/resta_matricial/{matriz1}&{matriz2}")
def sumar_matrices(matriz1: str, matriz2: str):

    matriz1_np = convertir_a_matriz(matriz1)
    matriz2_np = convertir_a_matriz(matriz2)

    matriz_resta = matriz1_np - matriz2_np

    return matriz_resta.tolist()


@app.get("/multiplicacion_matricial/{matriz1}*{matriz2}")
def sumar_matrices(matriz1: str, matriz2: str):

    matriz1_np = convertir_a_matriz(matriz1)
    matriz2_np = convertir_a_matriz(matriz2)

    matriz_mul = np.dot(matriz1_np, matriz2_np)

    return matriz_mul.tolist()


@app.get("/matriz_traspuesta/{matriz1}")
def sumar_matrices(matriz1: str):

    matriz1_np = convertir_a_matriz(matriz1)

    matriz_t = np.transpose(matriz1_np)
    print(matriz_t)

    return matriz_t.tolist()


@app.get("/matriz_inversa/{matriz1}")
def sumar_matrices(matriz1: str):
    matriz1_np = convertir_a_matriz(matriz1)
    try:
        inversa = np.linalg.inv(matriz1_np)
        lista_de_listas = inversa.tolist()
        return lista_de_listas
    except np.linalg.LinAlgError:
        print("La matriz no es invertible.")
        return None


@app.get("/matriz_determinante/{matriz1}")
def sumar_matrices(matriz1: str):

    matriz1_np = convertir_a_matriz(matriz1)

    matriz_d = np.linalg.det(matriz1_np)

    return matriz_d.tolist()

@app.get("/rango_matriz/{matriz}")
def rango_matriz(matriz: str):
    matriz_np = convertir_a_matriz(matriz)
    rango = np.linalg.matrix_rank(matriz_np)
    print(rango)
    return int(rango)


#---------------------------------------------POLINOMIOS-------------------------------------------------
"""
-Formato de entrada de polinomios:
<signo><valor>,<signo><valor>, ...

-Pasar polinomios de mayor a menor grado.

-Si hay potencias de x vacías (2x^2 + 3), la ristra de valores pasada tendrá un 0 en esa posición

"""
def pol_a_lista(pol):
    numeros = pol.split(',')  # Separar la cadena en función de las comas
    numeros_enteros = []

    for numero in numeros:
        signo = numero[0]  # Obtener el signo del número
        valor = float(numero[1:]) if signo in ['+', '-'] else float(numero)  # Obtener el valor numérico

        if signo == '-':  # Si el signo es negativo, convertir el valor a negativo
            valor *= -1

        numeros_enteros.append(valor)  # Agregar el valor a la lista de números enteros

    return numeros_enteros

@app.get("/sumar_polinomios/{pol1}&{pol2}")
def sumar_polinomios(pol1: str, pol2: str):
    pol1_a = pol_a_lista(pol1)
    pol1_b = pol_a_lista(pol2)
    sum = []
    for i in range(len(pol1_a)):
        sum.append(pol1_b[i] + pol1_a[i])
    return sum

@app.get("/restar_polinomios/{pol1}&{pol2}")
def sumar_polinomios(pol1: str, pol2: str):
    pol1_a = pol_a_lista(pol1)
    pol1_b = pol_a_lista(pol2)
    resta = []
    for i in range(len(pol1_a)):
        resta.append(pol1_b[i] + pol1_a[i])
    return resta

#Usar solo números enteros y decimales, no raíces o paréntesis
@app.get("/resolver_polinomios/{pol}")
def resolver_polinomios(pol: str):
    pol_np = pol_a_lista(pol)
    raices = np.roots(pol_np)
    raices = raices.tolist()
    for i in range(len(raices)):
        if raices[i] - int(raices[i]) > 0.00001:
            raices[i] = float("{:3f}".format(raices[i]))
        else:
            raices[i] = int(raices[i])

    return raices
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

#---------------------------------------------CONVERSIONES NUMÉRICAS-------------------------------------------------

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


#---------------------------------------------ECONOMÍA-------------------------------------------------

@app.get("/deuda/{deuda}*{interes}:{tiempo}")
def deuda(deuda: float, interes: float, tiempo: int):
    return deuda*interes/tiempo


@app.get("/salario/{pagoHora}*{horasDia}*{diasSemana}-{vacaciones}")
def salarios(pagoHora: float, horasDia: int, diasSemana: int, vacaciones: int):
    salarios = []
    diario = pagoHora*horasDia
    salarios.append(diario)
    semanal = pagoHora*horasDia*diasSemana
    salarios.append(semanal)
    anual = pagoHora*horasDia*(52*diasSemana-vacaciones)
    mensual = anual / 12
    salarios.append(mensual)
    cuatri = anual / 3
    salarios.append(cuatri)
    salarios.append(anual)
    return salarios


@app.get("/interes/{inversion}-{contribucion}-{interes}-{duracion}-{impuestos}")
def interes_simple(inversion: float, contribucion: int, interes: float, duracion: int, impuestos: float):
    beneficio = inversion+contribucion
    for i in range(duracion):
        iteracion_actual = (beneficio*interes/100)-((beneficio*interes/100)*(impuestos/100))
        print(iteracion_actual)
        beneficio += iteracion_actual

    return beneficio

#---------------------------------------------SERVIDOR-------------------------------------------------

# Definir tu ruta raíz (root_path)
root_path = "/calculadora_multiproposito"

# Crear una instancia de Config con la ruta raíz
config = Config(app=app, host="127.0.0.1", port=8000, root_path=root_path)

# Crear una instancia de Server con la configuración
server = Server(config)

# Iniciar el servidor
server.run()

