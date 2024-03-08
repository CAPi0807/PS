
let operacionActual = '';
let numeros = [];

function actualizarDisplay() {
    document.getElementById('console').value = numeros.join('') + operacionActual;
    document.getElementById('console').innerText =numeros.join('') + operacionActual;


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
    fetch(`http://localhost:3000/calcular?expresion=${encodeURIComponent(expresion)}`)
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

