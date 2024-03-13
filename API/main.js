let operacionActual = '';
let numeros = [];
let numbers;
let operations;
let result;

function chainValidation(chain){
    const error= new Error("Syntax error");
    const fail  = /[^0-9]{2}/;   //cadena para que no hayan dos símbolos juntos
    const fail2  = /^[^\d].*/;   //cadena para que no empiece por símbolo
    const fail3  = /.*[^\d]$/;   //cadena para que no termine en un símbolo

    if (fail.test(chain) || fail2.test(chain) || fail3.test(chain)) {
        console.log("Syntax Error");
        limpiar();
        alert("Syntax error")


    }
    else {
        console.log("La cadena esta bien");
    }


}
function splitChain(chain){
    const pattern = /[^0-9]/; // Coincide con cualquier caracter que no sea un número
    const pattern2 = /[0-9]/; // Coincide con los caracteres que sean números

    numbers = chain.split(pattern);
    operations = chain.split(pattern2);
    operations = operations.filter(str => str.length > 0);


}
function limpiar(){
    document.getElementById('console').innerText = "";
    console.clear();
}

function operacion(a, b, op) {
    fetch(`http://127.0.0.1:8000/${op}/${a}+${b}`)
        .then(function (response) {
            if (!response.ok) {
                throw new Error(`Error de red - Código de estado: ${response.status}`);
            }
            return response.json();
        })
        .then(function (data) {
            console.log(data);
            //document.getElementById("resultado").innerText = `Resultado: ${data}`;
            result = data;
        })
        .catch(error => {
            console.error('Error al llamar a la API:', error);
        });


}

function obtenerOperacion(simbolo) {
    switch (simbolo) {
        case "+":
            return "suma_basica";
        case "-":
            return "resta_basica";
        case "*":
            return "multiplicacion_basica";
        case "/":
            return "division_basica";
        default:
            return "Operación no válida";
    }
}
function principal (cadena){
    chainValidation(cadena);
    splitChain(cadena)
    let a;
    let b;
    let op;

    while(operations.length !== 0){
        a = numbers.shift();
        b = numbers.shift();
        op = operations.shift();
        op = obtenerOperacion(op);
        console.log(a);
        console.log(b);
        console.log(op);
        operacion(a, b, op);
        numbers.unshift("coger resultado");
    }
}

