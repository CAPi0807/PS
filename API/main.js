let operacionActual = '';
let numeros = [];
let numbers;
let operations;
var result;
var ans;
function chainValidation(chain){
    const error= new Error("Syntax error");
    const fail  =  /[^\w]{2}/;   //cadena para que no hayan dos símbolos juntos
    const fail2  = /^[^\d].*/;   //cadena para que no empiece por símbolo
    const fail3  = /.*[^\d]$/;   //cadena para que no termine en un símbolo

   // if (chain ===)
    if (fail.test(chain) || fail2.test(chain) || fail3.test(chain)) {
        console.log("Syntax Error");
        limpiar();
        alert("Syntax error")
        return 1;

    }
    else {
        console.log("La cadena esta bien");
        return 0;
    }


}
function splitChain(chain){
    const pattern = /[^0-9]/; // Coincide con cualquier caracter que no sea un número
    const pattern2 = /[0-9]/; // Coincide con los caracteres que sean números


    numbers = chain.split(pattern);
    numbers = numbers.filter(str => str.length > 0);

    operations = chain.split(pattern2);
    operations = operations.filter(str => str.length > 0);

    console.log(numbers);
    console.log(operations);
}
function borrar(){
    document.getElementById('console').innerText = document.getElementById('console').innerText.slice(0, -1);
}
function limpiar(){
    document.getElementById('console').innerText = "";
    console.clear();
}

var datoGlobal; // Variable global para almacenar el dato

function operacion(a, b, op, opsim) {
    console.log(`http://127.0.0.1:8000/${op}/${a}${opsim}${b}`);
    fetch(`http://127.0.0.1:8000/${op}/${a}${opsim}${b}`)
        .then(function (response) {
            if (!response.ok) {
                throw new Error(`Error de red - Código de estado: ${response.status}`);
            }
            return response.json();
        })
        .then(function (data) {
            console.log(data);

            document.getElementById('console').innerText = data;
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
        case "÷":
            return "division_basica";
        case "^":
            return "exponente_basico";
        case "√":
            return "raiz";

        default:
            return "Operación no válida";
    }
}
function principal(cadena) {

    //if (chainValidation(cadena)===1){
    //   return;
    //}
    splitChain(cadena);
    let a;
    let b;
    let op;
    let opsim;
    while (operations.length !== 0) {
        a = numbers.shift();
        b = numbers.shift();
        opsim = operations.shift();
        op = obtenerOperacion(opsim);
        console.log(a);
        console.log(b);
        console.log(op);

        operacion(a, b, op, opsim)
        //console.log(document.getElementById('variable').title);

        numbers.unshift();
    }
    //console.log(document.getElementById('variable').title);


    //document.getElementById('console').innerText = "10";
}
function cambiarIdioma() {
    // Cambiar el atributo lang de la etiqueta html
    //location.reload();
    var lan = document.getElementById("lan");
    var inputLang;
    var outputLang;
    if(lan.value==="es"){
        inputLang="es";
        lan.value = "en";
        lan.innerText = "en";
        outputLang="en";
        lan.style.backgroundImage = `url("https://upload.wikimedia.org/wikipedia/commons/a/a5/Flag_of_the_United_Kingdom_%281-2%29.svg")`;
    }
    else if (lan.value==="en"){

        location.reload();
    }
    document.documentElement.lang = lan.innerText;

    console.log(lan.value);
    //var inputText = document.getElementById("button1");
    var texto=document.getElementById("button1").title;
    for(var i=2;i<7;i++) {
        //console.log(document.getElementById("button"+i).title);
        texto+=", "+document.getElementById("button"+i).title;
    }

    //inputText = document.getElementById("button1");
    console.log(texto);
    var arrayLan;
    fetch(
        "https://api.mymemory.translated.net/get?q=" + texto + "&langpair=" + inputLang + "|" + outputLang
    ).then((response) => response.json())

        .then((data) => {
            var variable = data.responseData.translatedText;
            console.log(variable);
            /*inputText.title = variable;
            inputText.innerText = variable;
            console.log(inputText);*/
            arrayLan = variable.split(", ");
            console.log(arrayLan);
            var j=1;
            arrayLan.forEach(function(elemento) {
                document.getElementById("button"+j).innerText=elemento;
                document.getElementById("button"+j).title=elemento;
                j++;
            });

        });


}




