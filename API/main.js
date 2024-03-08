
let operacionActual = '';
let numeros = [];

function actualizarDisplay() {
    document.getElementById('console').value = numeros.join('') + operacionActual;
    document.getElementById('console').innerText = document.getElementById('console').value

}
function agregarNumero(numero) {
    numeros.push(numero);
    document.getElementById('console').innerText += value;
    actualizarDisplay();
}

function realizarOperacion(operacion) {
    operacionActual = operacion;
    document.getElementById('console').innerText += value;
    actualizarDisplay();
}

function limpiar() {
    numeros = [];
    operacionActual = '';
    actualizarDisplay();

}

function calcularResultado() {
    const expresion = numeros.join('') + operacionActual;
    // Realizar solicitud a la API para calcular el resultado
    fetch(`https://127.0.0.1:8080/calculadora_multiproposito/main.py`)
        .then(response => response.json())
        .then(data => {
            // Mostrar el resultado en el display
            document.getElementById('display').value = data.resultado;
        })
        .catch(error => {
            console.error('Error al realizar la solicitud:', error);
            document.getElementById('display').value = 'Error';
        });
}
function sumar() {
    const a = document.getElementById("a").value;
    const b = document.getElementById("b").value;

    // Realizar la solicitud a la API
    axios.get(`http://127.0.0.1:8000/calculadora_multiproposito/suma_basica/${a}+${b}`)
        .then(response => {
            // Actualizar el resultado en el elemento con id "resultado"
            document.getElementById("resultado").innerHTML = `Resultado: ${response.data}`;
        })
        .catch(error => {
            console.error('Error al llamar a la API:', error);
        });
}

