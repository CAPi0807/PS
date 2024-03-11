
let operacionActual = '';
let numeros = [];

function limpiar(){
    document.getElementById('console').innerText = "";

}

function sumar() {
    const a = document.getElementById("a").value;
    const b = document.getElementById("b").value;
    console.log(a);
    console.log(b);


    // Realizar la solicitud a la API
    //http://127.0.0.1:8000/calculadora_multiproposito/suma_basica/' + numero1 + '+' + numero2
    //https://localhost:8000/PS/suma_basica/{a}+{b}
    /*
    fetch(`http://127.0.0.1:8000/calculadora_multiproposito/suma_basica/{${a}+${b}`)
        .then(function (response) {
            console.log(a);
            return response.json();
        })
        .then(function (data){
            console.log(a);
            // Actualizar el resultado en el elemento con id "resultado"
            document.getElementById("resultado").innerText = `Resultado: ${data}`;

        })


        .catch(error => {
            console.error('Error al llamar a la API:', error);
        });
    */
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

