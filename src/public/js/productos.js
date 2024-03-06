const { Socket } = require("socket.io");

const socket =io()

socket.on("NewProduct",datos =>{
    console.log(datos);
    let ulProducto=document.getElementById("productos")
    ulProducto.innerHTML+=`<li>${datos.description}<button>agregar al carrito</button></li>`
} )
