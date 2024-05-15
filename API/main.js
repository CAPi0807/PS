let operacionActual = '';
let numeros = [];
let numbers;
let operations;
var result;
var ans;
let anterior ="es";
let ruta;
var datoGlobalBas=""; // Variable global para almacenar el dato
var datoGlobalEs="";
let histOper="";
let histResult=""


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


function getAns(calc){
    if (calc==="basica"){
        document.getElementById('console').innerText += datoGlobalBas;

    }else if(calc==="estadistica"){
        document.getElementById('console').innerText += datoGlobalEs;

    }
    //document.getElementById('console').innerText += datoGlobalBas;
}
function vaciarHistorial(){
    fetch(`http://127.0.0.1:8000/vaciarHistorial`)
        .then(function (response) {
            if (!response.ok) {
                throw new Error(`Error de red - Código de estado: ${response.status}`);
            }
            return response.json();
        })
        .then(function (data) {







            //historial.textContent += `\n${claves}\t\t${valor}`;

        })
        .catch(error => {
            console.error('Error al llamar a la API:', error);


        });
    historial=document.getElementById('displayHistory');
    historial.textContent ="\nOperación\t\tresultado";
}


function displayHist(){

    if (document.getElementById('displayHistory')){
        main.removeChild(document.getElementById('displayHistory')) ;
        return;
    }
    // Crear un nuevo elemento <p>
    const historial = document.createElement('div');

    // Asignar contenido al nuevo elemento
    historial.id="displayHistory";
    historial.style.position="absolute";

    //historial.style.display="block";
    //historial.style.position= "fixed"; /* Fijar la posición */

    historial.style.marginTop="-800px";
    historial.style.marginLeft="82%";

    historial.style.zIndex= "3";
    historial.style.height="400px";
    historial.style.width="265px";
    historial.style.backgroundColor="black";
    historial.style.borderRadius="20px";

    historial.textContent = "\nOperación\t\tresultado";
    historial.style.textAlign="center";
    historial.style.whiteSpace="pre";
    historial.style.color="white";
    historial.style.overflow="scroll"; /* Oculta el desbordamiento */
    //historial.style.scrollbar-width= "none";





// Añadir el nuevo elemento al final del cuerpo del documento

    fetch(`http://127.0.0.1:8000/historial`)
        .then(function (response) {
            if (!response.ok) {
                throw new Error(`Error de red - Código de estado: ${response.status}`);
            }
            return response.json();
        })
        .then(function (data) {

            console.log(data);

            var claves = Object.keys(data);

// Iteramos sobre cada clave para obtener su valor y guardarlo en una variable
            claves.forEach(function(clave) {
                var valor = data[clave];
                console.log("Clave:", clave, "Valor:", valor);
                historial.textContent += `\n${clave}\t\t${valor}`;

            });


            //historial.textContent += `\n${claves}\t\t${valor}`;

        })
        .catch(error => {
            console.error('Error al llamar a la API:', error);


        });
    main.appendChild(historial);

}
function actualizaHist(operacion, resultado){
    if (document.getElementById('displayHistory')){
        var histo = document.getElementById('displayHistory');
        a=atob(operacion);
        histo.innerText+="\n"+a+"\t\t"+resultado;
    }

}


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

            datoGlobalBas=document.getElementById('console').innerText;

            histOper=variable;
            histResult=data;
            actualizaHist(variable, data);




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
        funcion ="media"
        resto= change.substring(6);
    }
    else if(change.startsWith("Moda:")) {
        funcion ="moda"
        resto= change.substring(5);
    }

    else{
        limpiar();
        alert("SyntaxError");
    }
    //console.log(`http://127.0.0.1:8000/${funcion}/${resto}`);

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
            console.log(data);
            //console.log(document.getElementById('console').innerText.match(/[^:]*:(\d+(\.\d+)?)/));
            //datoGlobalEs= document.getElementById('console').innerText.match(/[^:]*:(\d+(\.\d+)?)/);
            datoGlobalEs=data;
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

    //console.log(`http://127.0.0.1:8000/${operation}/${matriz1}${operando_cal}${matriz2}`);

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

    //console.log("operation"+numero);
    var operation = document.getElementById("operation" + numero).value;


    //console.log(`http://127.0.0.1:8000/${operation}/${matriz}`);

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
            alert("SyntaxError");
            //var elemento= document.getElementById("resultMatrix");
            //elementad();
            location.reload();

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
var global_eco="pagos";

function economia_funcion(tipo){
    if(global_eco===tipo){
        return
    }
    global_eco=tipo;

    var info =document.getElementById("info_eco");
    var input = document.getElementById("input_eco");
    var result = document.getElementById("result_eco");

    info.innerHTML = ''; // Clear existing content
    input.innerHTML = ''; // Clear existing content
    result.innerHTML = ''; // Clear existing content


    // Empieza hueco de informacion

    var informacion = document.createElement("p");
    var titulo= document.createElement("p");

    titulo.style.color = 'white'; // Establecer el color del texto
    titulo.style.fontSize= "20px";
    titulo.textContent="Información:";

    informacion.style.color = 'white'; // Establecer el color del texto
    informacion.style.fontSize= "16px";
    informacion.style.display = 'block';

    var encabezado= document.createElement("p");

    encabezado.style.color = 'white'; // Establecer el color del texto
    encabezado.style.fontSize= "20px";
    encabezado.textContent="Modelos Activos:";
    encabezado.style.textAlign = 'center';

    // Añado botones

    var iva = document.createElement("button");
    iva.textContent = 'IVA';
    iva.id = 'iva_button';
    iva.className='imp';
    iva.addEventListener('click', function() {
        economia_funcion("impuestos_iva");
    });
    var igic = document.createElement("button");
    igic.textContent = 'IGIC';
    igic.id = 'igic_button';
    igic.className='imp';

    igic.addEventListener('click', function() {
        economia_funcion("impuestos_igic");
    });
    var irpf = document.createElement("button");
    irpf.textContent = 'IRPF';
    irpf.id = 'irpf_button';
    irpf.className='imp';

    irpf.addEventListener('click', function() {
        economia_funcion("impuestos_irpf");
    });
    var adu_gen = document.createElement("button");
    adu_gen.textContent = 'Aduana';
    adu_gen.id = 'aduana_gen_button';
    adu_gen.className='imp';

    adu_gen.addEventListener('click', function() {
        economia_funcion("impuestos_aduana_gen");
    });
    var adu_can = document.createElement("button");
    adu_can.textContent = 'Aduana Can';
    adu_can.id = 'aduana_gen_button';
    adu_can.className='imp';

    adu_can.addEventListener('click', function() {
        economia_funcion("impuestos_aduana_can");
    });

    // Termino de añadir botones




    // Termina hueco de informacion

    if(tipo ==="pagos"){

        /*input empieza*/
        const form = document.createElement('form');
        form.className = 'maineconomia-pagos-input-form';

        // Función para crear un div de entrada


        // Crear los tres campos de entrada
        const prestamoDiv = createInputDiv('Préstamo','', '*$*', '20px');
        const duracionDiv = createInputDiv('Duración','', '*Nº Meses*', '20px');
        const interesDiv = createInputDiv('Interés','', '*%*', '20px');

        // Crear el botón
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'maineconomia-pagos-button17 button';
        button.textContent = 'Calcular';


        // Añadir los elementos al formulario
        form.appendChild(prestamoDiv);
        form.appendChild(duracionDiv);
        form.appendChild(interesDiv);
        form.appendChild(button);

        // Añadir el formulario al div con id="input_eco"
        document.getElementById('input_eco').appendChild(form);

        /*input acaba*/

        /*informacion empieza*/
        informacion.textContent="El crédito o contrato de crédito es una operación financiera en la que una persona " +
            "(el acreedor) realiza un préstamo por una cantidad determinada de dinero a otra persona (el deudor) y en la " +
            "que este último, se compromete a devolver la cantidad solicitada en el tiempo o plazo definido, además de pagar " +
            "intereses devengados, seguros y costos asociados si los hubiere, de acuerdo a las condiciones establecidas en el " +
            "contrato de dicho préstamo."

        info.appendChild(titulo);
        info.appendChild(informacion);

        /*informacion acaba*/

    }
    else if (tipo ==="interes_sencillo"){

        /*input empieza*/
        const form = document.createElement('form');
        form.className = 'maineconomia-pagos-input-form';

        // Función para crear un div de entrada


        // Crear los tres campos de entrada
        const invIn = createInputDiv('Inversión Inicial','', '*$*', "20px");
        const ContAn = createInputDiv('Contribución anual', '','*$*', '20px');
        const ratInt = createInputDiv('Ratio de intereses','', '*%*', '20px');
        const comp = createInputDiv('Compuesto','dropdown_comp', '*%*', '20px');

        const durInv = createInputDiv('Duración de Inversión','', '*Meses*', '20px');
        const ratImp = createInputDiv('Ratio de impuestos','', '*%*', '20px');

        //const DiasFiesta = createInputDiv('Días/Fiesta', '*Nº*', '20px');


        // Crear el botón
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'maineconomia-pagos-button17 button';
        button.style.marginTop = '15%';
        button.textContent = 'Calcular';


        // Añadir los elementos al formulario
        form.appendChild(invIn);
        form.appendChild(ContAn);
        form.appendChild(ratInt);
        form.appendChild(comp);
        form.appendChild(durInv);
        form.appendChild(ratImp);

        form.appendChild(button);

        // Añadir el formulario al div con id="input_eco"
        document.getElementById('input_eco').appendChild(form);

        /*input acaba*/


        informacion.textContent="El interes sencillo es aquel que se va sumando al capital inicial y sobre el que se van " +
            "generando nuevos intereses. El dinero, en este caso, tiene un efecto multiplicador porque los intereses " +
            "producen nuevos intereses. Sin embargo, en el caso del interés o capitalización simple, los rendimientos " +
            "siempre se generan sobre el capital original."

        info.appendChild(titulo);
        info.appendChild(informacion);
    }
    else if (tipo ==="interes_compuesto"){

        /*input empieza*/
        const form = document.createElement('form');
        form.className = 'maineconomia-pagos-input-form';

        // Función para crear un div de entrada


        // Crear los tres campos de entrada
        const ratInt = createInputDiv('Ratio de intereses','', '*%*', '20px');
        const comp = createInputDiv('Compuesto','dropdown_comp', '*%*', '20px');
        const comp_sal = createInputDiv('Compuesto(salida)','dropdown_comp', '*%*', '20px');



        //const DiasFiesta = createInputDiv('Días/Fiesta', '*Nº*', '20px');


        // Crear el botón
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'maineconomia-pagos-button17 button';
        button.style.marginTop = '15%';
        button.textContent = 'Calcular';


        // Añadir los elementos al formulario
        form.appendChild(ratInt);
        form.appendChild(comp);
        form.appendChild(comp_sal);

        form.appendChild(button);

        // Añadir el formulario al div con id="input_eco"
        document.getElementById('input_eco').appendChild(form);






        informacion.textContent="El interes compuesto es aquel que se va sumando al capital inicial y sobre el que se van " +
            "generando nuevos intereses. El dinero, en este caso, tiene un efecto multiplicador porque los intereses " +
            "producen nuevos intereses. Sin embargo, en el caso del interés o capitalización simple, los rendimientos " +
            "siempre se generan sobre el capital original."

        info.appendChild(titulo);
        info.appendChild(informacion);
    }

    else if (tipo ==="salarios"){

        /*input empieza*/
        const form = document.createElement('form');
        form.className = 'maineconomia-pagos-input-form';

        // Función para crear un div de entrada


        // Crear los tres campos de entrada
        const salarioDiv = createInputDiv('Salario/hora','', '*$*', "20px");
        const horasDias = createInputDiv('Horas/Días', '','*Nº*', '20px');
        const DiasSemanas = createInputDiv('Días/Semanas','', '*Nº*', '20px');
        //const DiasFiesta = createInputDiv('Días/Fiesta', '*Nº*', '20px');
        const DiasVacaciones = createInputDiv('Días/Vacaciones','', '*Nº*', '20px');


        // Crear el botón
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'maineconomia-pagos-button17 button';
        button.style.marginTop = '20%';
        button.textContent = 'Calcular';


        // Añadir los elementos al formulario
        form.appendChild(salarioDiv);
        form.appendChild(horasDias);
        form.appendChild(DiasSemanas);
        //form.appendChild(DiasFiesta);
        form.appendChild(DiasVacaciones);

        form.appendChild(button);

        // Añadir el formulario al div con id="input_eco"
        document.getElementById('input_eco').appendChild(form);

        /*input acaba*/

        informacion.textContent="Legalmente, se considera salario la totalidad de las percepciones económicas de los " +
            "trabajadores —en dinero o en especie— por la prestación profesional de los servicios laborales por cuenta" +
            " ajena, ya retribuyan el trabajo efectivo, cualquiera que sea la forma de remuneración, o los periodos de" +
            " descanso computables como de trabajo.​ Por lo tanto, se excluye al trabajador por cuenta propia" +
            " (el autónomo). Asimismo, el sueldo no solo retribuye el «trabajo efectivo», sino también los periodos" +
            " de descanso computables como de trabajo."

        info.appendChild(titulo);
        info.appendChild(informacion);
    }

    else if (tipo ==="impuestos_iva"){

        const form = document.createElement('form');
        form.className = 'maineconomia-pagos-input-form';

        // Función para crear un div de entrada


        // Crear los tres campos de entrada
        const baseImp = createInputDiv('Base Imponible', '','*$*', '20px');
        const iva_input = createInputDiv('IVA', 'dropdown_iva','*%*', '20px');
        const ret_irpf = createInputDiv('Retencion IRPF','dropdown_irpf', '*%*', '20px');

        // Crear el botón
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'maineconomia-pagos-button17 button';
        button.textContent = 'Calcular';

        // Añadir los elementos al formulario
        form.appendChild(baseImp);
        form.appendChild(iva_input);
        form.appendChild(ret_irpf);
        form.appendChild(button);

        // Añadir el formulario al div con id="input_eco"
        document.getElementById('input_eco').appendChild(form);


        info.appendChild(encabezado);
        info.appendChild(iva);
        info.appendChild(igic);
        info.appendChild(irpf);
        info.appendChild(adu_gen);
        info.appendChild(adu_can);


    }
    else if (tipo ==="impuestos_igic"){

        const form = document.createElement('form');
        form.className = 'maineconomia-pagos-input-form';

        // Función para crear un div de entrada


        // Crear los tres campos de entrada
        const baseImp = createInputDiv('Base Imponible', '' ,'*$*', '20px');
        const igic_input = createInputDiv('IGIC', 'dropdown_igic','*%*', '20px');
        const ret_irpf = createInputDiv('Retencion IRPF', 'dropdown_irpf','*%*', '20px');

        // Crear el botón
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'maineconomia-pagos-button17 button';
        button.textContent = 'Calcular';

        // Añadir los elementos al formulario
        form.appendChild(baseImp);
        form.appendChild(igic_input);
        form.appendChild(ret_irpf);
        form.appendChild(button);

        // Añadir el formulario al div con id="input_eco"
        document.getElementById('input_eco').appendChild(form);


        info.appendChild(encabezado);
        info.appendChild(iva);
        info.appendChild(igic);
        info.appendChild(irpf);
        info.appendChild(adu_gen);
        info.appendChild(adu_can);
    }
    else if (tipo ==="impuestos_irpf"){

        const form = document.createElement('form');
        form.className = 'maineconomia-pagos-input-form';

        // Función para crear un div de entrada


        // Crear los tres campos de entrada
        const baseImp = createInputDiv('Base Imponible', '','*$*', '20px');
        const ret_irpf = createInputDiv('Retencion IRPF','dropdown_irpf', '*%*', '20px');

        // Crear el botón
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'maineconomia-pagos-button17 button';
        button.textContent = 'Calcular';

        // Añadir los elementos al formulario
        form.appendChild(baseImp);
        form.appendChild(ret_irpf);
        form.appendChild(button);

        // Añadir el formulario al div con id="input_eco"
        document.getElementById('input_eco').appendChild(form);

        info.appendChild(encabezado);
        info.appendChild(iva);
        info.appendChild(igic);
        info.appendChild(irpf);
        info.appendChild(adu_gen);
        info.appendChild(adu_can);
    }
    else if (tipo ==="impuestos_aduana_gen"){

        const form = document.createElement('form');
        form.className = 'maineconomia-pagos-input-form';

        // Función para crear un div de entrada


        // Crear los tres campos de entrada
        const importe = createInputDiv('Importe', '' ,'*$*', '20px');
        const remitente = createInputDiv('Remitente', 'dropdown_ad_gen','*%*', '20px');

        // Crear el botón
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'maineconomia-pagos-button17 button';
        button.textContent = 'Calcular';

        // Añadir los elementos al formulario
        form.appendChild(importe);
        form.appendChild(remitente);
        form.appendChild(button);

        // Añadir el formulario al div con id="input_eco"
        document.getElementById('input_eco').appendChild(form);


        info.appendChild(encabezado);
        info.appendChild(iva);
        info.appendChild(igic);
        info.appendChild(irpf);
        info.appendChild(adu_gen);
        info.appendChild(adu_can);
    }
    else if (tipo ==="impuestos_aduana_can"){

        const form = document.createElement('form');
        form.className = 'maineconomia-pagos-input-form';

        // Función para crear un div de entrada


        // Crear los tres campos de entrada
        const importe = createInputDiv('Importe', '' ,'*$*', '20px');
        const remitente = createInputDiv('Remitente', 'dropdown_ad_can','*%*', '20px');

        // Crear el botón
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'maineconomia-pagos-button17 button';
        button.textContent = 'Calcular';

        // Añadir los elementos al formulario
        form.appendChild(importe);
        form.appendChild(remitente);
        form.appendChild(button);

        // Añadir el formulario al div con id="input_eco"
        document.getElementById('input_eco').appendChild(form);

        info.appendChild(encabezado);
        info.appendChild(iva);
        info.appendChild(igic);
        info.appendChild(irpf);
        info.appendChild(adu_gen);
        info.appendChild(adu_can);
    }


}

options_iva=[ "0%", "4%", "5%", "7%", "8%", "10%", "16%", "18%", "21%"];
options_igic=["0%", "3%", "7%", "9.5%", "15%", "20%"];
options_irpf=["0%", "1%", "2%", "7%", "15%", "19%"];
options_gen=[];
options_can=[];
options_comp=["Anual","Semianual","Cuatrimestral", "Trimestral", "Mensual"];

function createInputDiv(labelText, type, placeholderText, marginRight) {
    const div = document.createElement('div');
    div.className = 'maineconomia-pagos-input';
    div.style.marginTop = '10px';
    div.style.height = '40px';

    const label = document.createElement('label');
    label.className = 'maineconomia-pagos-label';
    label.style.color = 'white';
    label.style.marginLeft = '20px';
    label.textContent = labelText;

    //const input = document.createElement('input');


    let input;
    if (type === 'dropdown_iva') {
        input = document.createElement('select');
        options_iva.forEach(option => {
            const optionElement = document.createElement('option');
            optionElement.textContent = option;
            input.appendChild(optionElement);
        });


    }

    else if (type === 'dropdown_igic') {
        input = document.createElement('select');
        options_igic.forEach(option => {
            const optionElement = document.createElement('option');
            optionElement.textContent = option;
            input.appendChild(optionElement);
        });
    }
    else if (type === 'dropdown_irpf') {
        input = document.createElement('select');
        options_irpf.forEach(option => {
            const optionElement = document.createElement('option');
            optionElement.textContent = option;
            input.appendChild(optionElement);
        });
    }
    else if (type === 'dropdown_ad_gen') {
        input = document.createElement('select');
        options_gen.forEach(option => {
            const optionElement = document.createElement('option');
            optionElement.textContent = option;
            input.appendChild(optionElement);
        });
    }
    else if (type === 'dropdown_ad_can') {
        input = document.createElement('select');
        options_can.forEach(option => {
            const optionElement = document.createElement('option');
            optionElement.textContent = option;
            input.appendChild(optionElement);
        });
    }
    else if (type === 'dropdown_comp') {
        input = document.createElement('select');
        options_comp.forEach(option => {
            const optionElement = document.createElement('option');
            optionElement.textContent = option;


            input.appendChild(optionElement);
        });
    }

    else {
        input = document.createElement('input');
        input.type = type;
        input.placeholder = '*$*';
    }
    input.marginTop = "0px";
    input.style.marginRight = marginRight;
    input.style.width='40%';
    input.style.borderRadius = '40px';
    input.style.height = '90%';
    input.style.textAlign = 'center';
    input.style.fontSize = '14px';
    input.type = 'number';
    input.style.float='right';
    input.placeholder = placeholderText;
    input.className = 'maineconomia-pagos-textinput';

    div.appendChild(label);
    div.appendChild(input);

    return div;
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