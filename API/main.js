let operacionActual = '';
let numeros = [];
let numbers;
let operations;
var result;
var ans;
let anterior ="es";
let ruta;

function borrar(){
    document.getElementById('console').innerText = document.getElementById('console').innerText.slice(0, -1);
    if(window.location.pathname=== "/PS/paginaWeb/conversiones.html"){
        document.getElementById('console2').innerText = document.getElementById('console2').innerText="";
    }
}
function limpiar(){
    document.getElementById('console').innerText = "";
    if(window.location.pathname=== "/PS/paginaWeb/conversiones.html"){
        document.getElementById('console2').innerText = "";
    }
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
            //console.log(data);
            if (data==="operación imposible"){
                limpiar();
                alert("SyntaxError");
                return;
            }
            document.getElementById('console').innerText = data;
        })
        .catch(error => {
            console.error('Error al llamar a la API:', error);
            limpiar();
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
    if (data.match(/\d+\π/) || data.match(/\d+\e/)){
        limpiar();
        alert("SyntaxError")  //hay que poner numero * π ó numero * e
        return;
    }
    data = data.replace(/\π/g, Math.PI);
    data = data.replace(/\e/g, Math.E);


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
    //console.log(data);
    try {
        var base64 = btoa(data);
        //console.log(base64);
    } catch (error) {
        console.error("Error al codificar en Base64:", error);
        limpiar();
        alert("SyntaxError");
        return 0;
    }




    operacion(base64);
}
function principal2(cadena) {
    // Verificar que haya al menos un número y una operación
    if (cadena.length < 1 ) {
        //console.error("Cadena inválida");
        //limpiar();
        alert("Have to write some number");
        return;
    }

    // Obtener el valor y la magnitud origen del primer número
    let valor = cadena;
    let magnitudOrigen = document.getElementById("contenidoDropdown").value;

    // Verificar si hay una segunda magnitud seleccionada
    let magnitudDestino;
    if (document.getElementById("contenidoDropdown2").value) {
        magnitudDestino = document.getElementById("contenidoDropdown2").value;
        //console.log(magnitudOrigen);
    } else {
        console.error("No se ha seleccionado una magnitud de destino");
        alert("Have to select any magnitude");
        return;
    }
    if (magnitudOrigen === magnitudDestino ){
        if (magnitudOrigen==="hexadecimal"){
            document.getElementById('console2').innerText = document.getElementById('console').innerText;
        }
        else{
            if(document.getElementById('console').innerText.match(/^\d+$/)){
                document.getElementById('console2').innerText = document.getElementById('console').innerText;
            }
            else{
                limpiar();
                alert("SyntaxError");
            }


        }
        return;
    }
    var pal=magnitudOrigen+"_a_"+magnitudDestino;
    var pal2=magnitudOrigen+"_"+magnitudDestino;
    // Realizar la conversión llamando a la API
    //console.log(`http://127.0.0.1:8000/conversion/${pal}/${valor}`);
    if(magnitudOrigen=="hexadecimal"|magnitudOrigen=="octal"|magnitudOrigen=="decimal"|magnitudOrigen=="binario"){
        valor=valor.toString();
        fetch(`http://127.0.0.1:8000/${pal2}/${valor}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Error de red - Código de estado: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                //console.log(data);
                document.getElementById('console2').innerText = data; // Mostrar el resultado en el campo de texto
            })
            .catch(error => {
                console.error('Error al llamar a la API:', error);

                limpiar();
                alert("SyntaxError");
            });
    }

    else {
        fetch(`http://127.0.0.1:8000/conversion/${pal}/${valor}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Error de red - Código de estado: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                //console.log(data);
                document.getElementById('console2').innerText = data; // Mostrar el resultado en el campo de texto
            })
            .catch(error => {
                console.error('Error al llamar a la API:', error);
                limpiar();
                alert("SyntaxError");
            });
    }
}
let inputLang;
let outputLang;


function principal3(cadena){
    var change = cadena.replace(/,/g , "-");
    var funcion;
    var resto;

    if (change.startsWith("MCD:")) {
        funcion ="MCD"
        resto= change.substring(4);

    }
    else if(change.startsWith("MCM:")) {
        funcion ="MCM"
        resto= change.substring(4);
    }
    else if(change.startsWith("Media:")) {
        //funcion ="MCM"
        //resto= change.substring(6);
    }
    else if(change.startsWith("Moda:")) {
        //funcion ="MCM"
        //resto= change.substring(5);
    }

    else{
        limpiar();
        alert("SyntaxError");
    }
    console.log(`http://127.0.0.1:8000/${funcion}/${resto}`);

    fetch(`http://127.0.0.1:8000/${funcion}/${resto}`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Error de red - Código de estado: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            //console.log(data);
            document.getElementById('console').innerText = funcion+":"+data; // Mostrar el resultado en el campo de texto
        })
        .catch(error => {
            console.error('Error al llamar a la API:', error);
            limpiar();
            alert("SyntaxError");
        });

}

function principal4() {
    //getMatrixValues();
    //var matriz1="1,2,3;4,5,6";
    //var matriz2="6,5,4;3,2,1";
    var matriz1 = getMatrixValues("matrixInputs");
    var matriz2 = getMatrixValues("matrixInputs2");

    console.log(matriz1);
    console.log(matriz2);
    var operation = document.getElementById("operation").value;
    var operando_cal="";
    if(operation === "suma_matricial"){
        operando_cal="+";
    }
    else if(operation === "resta_matricial"){
        operando_cal="&";
    }
    else if(operation === "multiplicacion_matricial"){
        operando_cal="*";
    }

    console.log(`http://127.0.0.1:8000/${operation}/${matriz1}${operando_cal}${matriz2}`);

    fetch(
        `http://127.0.0.1:8000/${operation}/${matriz1}${operando_cal}${matriz2}`
    ).then((response) => response.json())

        .then((data) => {
            //console.log(variable);

            console.log(data);
            displayMatrix(data,"resultMatrix");

        })
        .catch(error => {
        console.error('Error al llamar a la API:', error);
        alert("SyntaxError: Las dimensiones no son correctas");
        //var elemento= document.getElementById("resultMatrix");
        //elemento.style.display = "none";
            location.reload();
    });
}

function principal5(numero) {
    var matriz="";
    if (numero === 1){
        matriz=getMatrixValues("matrixInputs");
    }
    else if(numero === 2){
        matriz=getMatrixValues("matrixInputs2");
    }

    console.log("operation"+numero);
    var operation = document.getElementById("operation" + numero).value;


    console.log(`http://127.0.0.1:8000/${operation}/${matriz}`);

    fetch(
        `http://127.0.0.1:8000/${operation}/${matriz}`
    ).then((response) => response.json())

        .then((data) => {
            //console.log(variable);

            console.log(data);
            if (operation==="matriz_determinante" || operation==="rango_matriz"){

                var resultDiv = document.getElementById("resultMatrix");
                resultDiv.innerHTML = "";

                var cell = document.createElement("div");
                cell.textContent = data;
                resultDiv.appendChild(cell);
            }
            else{
                displayMatrix(data,"resultMatrix");

            }


            //displayMatrix(data,"resultMatrix");

        })
        .catch(error => {
            console.error('Error al llamar a la API:', error);
            alert("SyntaxError: Las dimensiones no son correctas");
            //var elemento= document.getElementById("resultMatrix");
            //elementad();
        });
}



function getMatrixValues(tableId) {
    var matrixValues = "";
    var table = document.getElementById(tableId);
    for (var i = 0; i < table.rows.length; i++) {
        //var row = [];
        for (var j = 0; j < table.rows[i].cells.length; j++) {
            matrixValues += table.rows[i].cells[j].querySelector("input").value;
            if(j < table.rows[i].cells.length-1){
                matrixValues += ",";
            }
            //row.push(parseFloat(table.rows[i].cells[j].querySelector("input").value));
        }
            matrixValues += ";";

        //matrixValues.push(row);
    }
    matrixValues = matrixValues.slice(0, -1);
    return matrixValues;
}

function displayMatrix(matrix, targetId) {
    var resultDiv = document.getElementById(targetId);
    resultDiv.innerHTML = "";

    var table = document.createElement("table");
    table.classList.add("matrix-table");

    for (var i = 0; i < matrix.length; i++) {
        var row = document.createElement("tr");
        for (var j = 0; j < matrix[i].length; j++) {
            var cell = document.createElement("td");
            cell.textContent = matrix[i][j];
            row.appendChild(cell);
        }
        table.appendChild(row);
    }

    resultDiv.appendChild(table);
}

// Función para cambiar el idioma
function cambiarIdioma(idioma) {
    insertImagen(idioma);
    localStorage.setItem("languagePagina", idioma); // Guardar el idioma seleccionado en localStorage
    document.documentElement.lang=localStorage.getItem("languagePagina", idioma);
    //language.style.backgroundImage = `url("https://upload.wikimedia.org/wikipedia/commons/a/a5/Flag_of_the_United_Kingdom_%281-2%29.svg")`;
    let inputLang =     anterior;

    let outputLang = idioma;
    //language.classList.remove('fondo-es', 'fondo-en')

    if (inputLang===outputLang){
        return;
    }

    // cmabiar idioma nav
    var texto=document.getElementById("button1").title;
    for(var i=2;i<8;i++) {
        //console.log(document.getElementById("button"+i).title);
        texto+=", "+document.getElementById("button"+i).title;
    }
    ruta = window.location.pathname;
    //console.log("Ruta:", ruta);
    if (ruta==="/PS/paginaWeb/conversiones.html"){
        for(var j=1;j<5;j++) {
            //console.log(document.getElementById("rectangle"+j).innerText);
            texto+=", "+document.getElementById("rectangle"+j).innerText;
        }
    }
    else if (ruta==="/PS/paginaWeb/constantes.html"){
        for(var k=1;k<16;k++) {
            //console.log(document.getElementById("rectangle"+j).innerText);
            texto+=", "+document.getElementById(k).innerText;
        }
        let texto2=document.getElementById("16").innerText;
        for(var l=17;l<32;l++) {
            //console.log(document.getElementById("rectangle"+j).innerText);
            texto2+=", "+document.getElementById(l).innerText;

        }
        var arrayLan2;
        //console.log("https://api.mymemory.translated.net/get?q=" + texto + "&langpair=" + inputLang + "|" + outputLang);
        fetch(
            "https://api.mymemory.translated.net/get?q=" + texto2 + "&langpair=" + inputLang + "|" + outputLang
        ).then((response) => response.json())

            .then((data) => {
                var variable2 = data.responseData.translatedText;
                //console.log(variable);

                arrayLan2 = variable2.split(", ");
                console.log(arrayLan2);

                var k=16;
                arrayLan2.forEach(function(elemento2) {

                    document.getElementById(k).innerText=elemento2;


                    k++;
                });

            });


        //anterior=outputLang;

    }


    var arrayLan;
    console.log(texto);
    //console.log("https://api.mymemory.translated.net/get?q=" + texto + "&langpair=" + inputLang + "|" + outputLang);
    fetch(
        "https://api.mymemory.translated.net/get?q=" + texto + "&langpair=" + inputLang + "|" + outputLang
    ).then((response) => response.json())

        .then((data) => {
            var variable = data.responseData.translatedText;
            //console.log(variable);

            arrayLan = variable.split(", ");
            console.log(arrayLan);

            var j=1;
            arrayLan.forEach(function(elemento) {
                if(j<8){
                    document.getElementById("button"+j).innerText=elemento;
                    document.getElementById("button"+j).title=elemento;
                }
                else{
                    if (ruta==="/PS/paginaWeb/conversiones.html"){
                        //console.log("rectangle"+(j-7));
                        document.getElementById("rectangle"+(j-7)).innerText=elemento;
                    }
                    else if (ruta==="/PS/paginaWeb/constantes.html"){

                        document.getElementById(""+(j-7)).innerText=elemento;
                    }
                }
                j++;
            });

        });


    anterior=outputLang;

}




function insertImagen(idioma){
    switch (idioma) {
        case "es":
            language.style.backgroundImage = `url("https://upload.wikimedia.org/wikipedia/commons/f/ff/Bandera_de_Espa%C3%B1a_%28sin_escudo%29.svg")`;
            language.text = language.value = "es";
            break;
        case "en":
            language.style.backgroundImage = `url("https://upload.wikimedia.org/wikipedia/commons/a/a5/Flag_of_the_United_Kingdom_%281-2%29.svg")`;
            language.text = language.value = "en";
            break;
        case "it":
            language.style.backgroundImage = `url("https://upload.wikimedia.org/wikipedia/commons/0/03/Flag_of_Italy.svg")`;
            language.text = language.value = "it";
            break;
        case "de":
            language.style.backgroundImage = `url("https://upload.wikimedia.org/wikipedia/commons/b/ba/Flag_of_Germany.svg")`;
            language.text = language.value = "de";
            break;
        case "fr":
            language.style.backgroundImage = `url("https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTSG24QVtqDWYqBksVSyK1yULlQWKw_HXQ853vdS-3M5dwS_n4MdgL35AF2WfI&s=10")`;
            language.text = language.value = "fr";
            break;
        default:
            language.style.backgroundImage = `url("https://upload.wikimedia.org/wikipedia/commons/f/ff/Bandera_de_Espa%C3%B1a_%28sin_escudo%29.svg")`;
            language.text = language.value = "es";
            break;
    }

    // Asignar el nuevo valor al parámetro 'valor' del elemento 'language'
    //language.valor = nuevoValor;

    // Devolver el nuevo valor
    return language.style.backgroundImage;
}








