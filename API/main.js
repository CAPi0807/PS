let operacionActual = '';
let numeros = [];
let numbers;
let operations;
var result;
var ans;

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

function operacion(variable) {
    fetch(`http://127.0.0.1:8000/eval/${variable}`)
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
            //limpiar();
            alert("SyntaxError");

        });
}


function principal(cadena) {
    var salir = 0;

    let data = cadena.replace(/sin(\d+)/g, "math.sin($1)");
    data = data.replace(/cos(\d+)/g, "math.cos($1)");
    data = data.replace(/tan(\d+)/g, "math.tan($1)");
    data = data.replace(/\^/g, "**");
    data = data.replace(/\÷/g, "/");
    //data = data.replace(/√(\d+)/g, "pow($1, 1/2)");
    data = data.replace(/(-?\d+)√(-?\d+)/g, function(match, number, root) {
        // Convierte las cadenas capturadas a números
        var num = parseInt(number);
        var rootNum = parseInt(root);
        // Verifica si el número es negativo
        if (num % 2 !== 0) {
            // Si es negativo, devuelve el texto original
            return rootNum +"**(1/"+num+")";
        } else {
            if (Math.abs(rootNum)-rootNum===0){
                return rootNum +"**(1/"+num+")";
            }
            else{
                limpiar();
                alert("SyntaxError: Cannot make an even root of a negative number");
                salir = 1;
            }

        }
    });
    if (salir===1){
        return;
    }
    //"$2**(1/$1)");


    //data = data.replace(/Ans/g, "9");
    console.log(data);
    try {
        var base64 = btoa(data);
        console.log(base64);
    } catch (error) {
        console.error("Error al codificar en Base64:", error);
        //limpiar();
        alert("SyntaxError");
        return 0;
    }




    operacion(base64);
}
function principal2(cadena) {
    splitChain(cadena); // Separar la cadena en números y operaciones

    // Verificar que haya al menos un número y una operación
    if (numbers.length < 1 ) {
        console.error("Cadena inválida");
        return;
    }

    // Obtener el valor y la magnitud origen del primer número
    let valor = parseFloat(numbers.shift());
    let magnitudOrigen = document.getElementById("contenidoDropdown").value;

    // Verificar si hay una segunda magnitud seleccionada
    let magnitudDestino;
    if (document.getElementById("contenidoDropdown2").value) {
        magnitudDestino = document.getElementById("contenidoDropdown2").value;
        //console.log(magnitudOrigen);
    } else {
        console.error("No se ha seleccionado una magnitud de destino");
        return;
    }
    var pal=magnitudOrigen+"_a_"+magnitudDestino;
    // Realizar la conversión llamando a la API
    //console.log(`http://127.0.0.1:8000/conversion/${pal}/${valor}`);

    fetch(`http://127.0.0.1:8000/conversion/${pal}/${valor}`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Error de red - Código de estado: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log(data);
            document.getElementById('console2').innerText = data; // Mostrar el resultado en el campo de texto
        })
        .catch(error => {
            console.error('Error al llamar a la API:', error);
        });
}
let inputLang;
let outputLang;
// Función para cambiar el idioma
function cambiarIdioma(idioma) {
    insertImagen(idioma);
    //language.style.backgroundImage = `url("https://upload.wikimedia.org/wikipedia/commons/a/a5/Flag_of_the_United_Kingdom_%281-2%29.svg")`;
    let inputLang =     document.documentElement.lang;

    let outputLang = document.getElementById('language').value;
    //language.classList.remove('fondo-es', 'fondo-en')



    // cmabiar idioma nav
    var texto=document.getElementById("button1").title;
    for(var i=2;i<7;i++) {
        //console.log(document.getElementById("button"+i).title);
        texto+=", "+document.getElementById("button"+i).title;
    }


    var arrayLan;
    console.log("https://api.mymemory.translated.net/get?q=" + texto + "&langpair=" + inputLang + "|" + outputLang);
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

    document.documentElement.lang=outputLang;

}

function insertImagen(idioma){
    switch (idioma) {
        case "es":
            return language.style.backgroundImage = `url("https://upload.wikimedia.org/wikipedia/commons/f/ff/Bandera_de_Espa%C3%B1a_%28sin_escudo%29.svg")`;
        case "en":
            return language.style.backgroundImage = `url("https://upload.wikimedia.org/wikipedia/commons/a/a5/Flag_of_the_United_Kingdom_%281-2%29.svg")`;
        case "it":
            return language.style.backgroundImage = `url("https://upload.wikimedia.org/wikipedia/commons/0/03/Flag_of_Italy.svg")`;
        case "de":
            return language.style.backgroundImage = `url("https://upload.wikimedia.org/wikipedia/commons/b/ba/Flag_of_Germany.svg")`;
        case "fr":
            return language.style.backgroundImage = `url("https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTSG24QVtqDWYqBksVSyK1yULlQWKw_HXQ853vdS-3M5dwS_n4MdgL35AF2WfI&s=10")`;

        default:
            return language.style.backgroundImage = `url("https://upload.wikimedia.org/wikipedia/commons/f/ff/Bandera_de_Espa%C3%B1a_%28sin_escudo%29.svg")`;
    }

}




