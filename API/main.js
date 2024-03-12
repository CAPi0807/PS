
let operacionActual = '';
let numeros = [];
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

}
function limpiar(){
    document.getElementById('console').innerText = "";

}

function sumar() {
    const a = document.getElementById("a").value;
    const b = document.getElementById("b").value;
    console.log(a);
    console.log(b);


    fetch(`http://127.0.0.1:8000/suma_basica/${a}+${b}`)
        .then(function (response) {
            if (!response.ok) {
                throw new Error(`Error de red - Código de estado: ${response.status}`);
            }
            return response.json();
        })
        .then(function (data) {
            console.log(data);
            document.getElementById("resultado").innerText = `Resultado: ${data}`;

        })
        .catch(error => {
            console.error('Error al llamar a la API:', error);
        });


}

