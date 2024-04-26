let ufValue;
let discount = 0;
// conexión con la API dpara obtener el valor de la  UF
fetch("https://mindicador.cl/api")
  .then((response) => response.json())
  .then((data) => {
    ufValue = data.uf.valor;
    console.log("Valor de la UF:", ufValue); // Imprimir el valor de la UF en la consola
  })
  .catch((error) => {
    console.error("Error al obtener el valor de la UF:", error);
  });

//FUNCIONES CALCULADORA
// 1.Precio de servicio
//constante  rangos por pesos
const rangoDePesos = [
  { start: 0, end: 4, factor: 0.35, discount: 0 },
  { start: 4.01, end: 7, factor: 0.4, discount: 0 },
  { start: 7.01, end: 9, factor: 0.45, discount: 2 },
  { start: 9.01, end: 13, factor: 0.48, discount: 3 },
  { start: 13.01, end: 18, factor: 0.5, discount: 3.6 },
  { start: 18.01, end: 22, factor: 0.55, discount: 4 },
  { start: 22.01, end: 30, factor: 0.6, discount: 4.5 },
  { start: 30.01, end: 40, factor: 0.65, discount: 4.7 },
  { start: 40.01, end: 50, factor: 0.7, discount: 5 },
  { start: 50.01, end: 65, factor: 0.75, discount: 6.5 },
  { start: 65.01, end: 80, factor: 0.8, discount: 8 },
  { start: 80.01, end: 100, factor: 0.85, discount: 10 },
];
// Encontrar el rango según el peso//funciona bn ✔
function calcularPrecioServicio(peso, cantidadProd) {
  if (peso <= 100 && cantidadProd >= 100) {
    const range = rangoDePesos.find(
      (range) => peso >= range.start && peso <= range.end
    );
    discount = range.discount;
    let servicePrice = (peso / cantidadProd) * range.factor * 10;
    if (servicePrice < 1.8) {
      return "Cargo mínimo es de 1.8 UF.";
    } else {
      return servicePrice.toFixed(2);
    }
  } else if (peso > 100) {
    return "La carga sobrepasa el máximo permitido.";
  } else {
    return "Se requiere un mínimo de 100 productos.";
  }
} //console.log(calcularPrecioServicio(100,3))

// CONEXIONES CON EL DOM (HTML)
//constantes de input usuarios
const cantidadProductos = document.getElementById("cantidad");
const pesoProductos = document.getElementById("peso");
const botonCotizar = document.getElementById("cotizar");
// constantes de detalles (6)
const precioServ = document.getElementById("precioS");
const diasMant = document.getElementById("dias");
const precioMant = document.getElementById("precioMant");
const subtotalUf = document.getElementById("subtotal");
const descuentos = document.getElementById("descuentos");
const iva = document.getElementById("iva");
//constantes de costo total
const totalUf = document.getElementById("totalUf");
const totalPesos = document.getElementById("totalPesos");

//CONECTO LAS FUNCIONALIDADES CON EL BOTÒN
botonCotizar.addEventListener("click", function () {
  //conexión inputs y funcion de precios de servicio
  const cantidadProd = parseInt(cantidadProductos.value);
  const pesoProd = parseFloat(pesoProductos.value);
  const precioServicio = calcularPrecioServicio(pesoProd, cantidadProd);
  precioServ.textContent = precioServicio;
  //número de días en mantención
  const fechaRecepcion = new Date(document.getElementById("fechaRE").value);
  const fechaSalida = new Date(document.getElementById("fechaSA").value);
  //calculo la diferencia de dias en milisegundos
  const diasMili = fechaSalida.getTime() - fechaRecepcion.getTime();
  //la diferencia se convierte a días
  const storageDays = Math.floor(diasMili / (1000 * 60 * 60 * 24));
  diasMant.textContent = storageDays;
  //precio de mantención en UF
  const maintenancePrice = 0.11 * storageDays;
  precioMant.textContent = maintenancePrice;
  //Subtotal
  //convierto las cadenas de precioServicio y maintenancePrice a nùmeros
  const precioServicioNum = parseFloat(precioServicio);
  const maintenancePriceNum = parseFloat(maintenancePrice);
  const porcentajeDes = 1 - discount / 100;
  const sub = (precioServicioNum + maintenancePriceNum) * porcentajeDes;
  subtotalUf.textContent = sub.toFixed(2);
  console.log(precioServicioNum, maintenancePriceNum, discount);
  // descuento en UF
  descuentos.textContent = +discount + "%";
  //IVA segun subtotal
  const ivaSub = sub * 0.19;
  iva.textContent = ivaSub.toFixed(2);

  //total en UF
  const totalU = sub + ivaSub;
  totalUf.textContent = totalU.toFixed(2);
  // total en CLP
  const totalC = ufValue * totalU;
  totalPesos.textContent = "$" + totalC.toFixed(2);
  console.log(totalC);
});
