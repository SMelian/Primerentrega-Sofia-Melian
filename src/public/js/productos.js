//const { Socket } = require("socket.io");
Swal.fire({
    title: 'Hello!',
    input: "text",
    text: 'Ingresa un nombre',
    icon: 'info', // You can use 'success', 'error', 'warning', 'info', or 'question'
    inputValidator: (value)=> {
        return !value && "debe ingresar un nombre"
    },
    allowOutsideClick: false 
 })

 .then (datos => {
    console.log(datos) 
    let nombre = datos.value
    document.title = nombre
    let inputMensaje=document.getElementById("mensaje")
    let divMensaje =document.getElementById("mensajes")
    const socket =io();

    socket.emit("presentation", nombre)
    socket.on ("historial", mensajes =>{
    mensajes.forEach(m => {
        divMensaje.innerHTML+= `<strong>${m.nombre}: ${m.mensaje} </strong> <br>`
        
         })
      })

    socket.on ("nuevoUsuario",nombre=>{
        Swal.fire({
            text:`${nombre} se conecto!`,
            toast: true, 
            position:"top-right",
        })
    })
    socket.on ("nuevoMensaje",(nombre,mensaje)=>{
        divMensaje.innerHTML+= `<strong>${nombre}: ${mensaje} </strong> <br>`
    })
    inputMensaje.addEventListener("keyup", e => {
        e.preventDefault();
        if (e.code === "Enter" && e.target.value.trim().length > 0) {
            socket.emit("mensaje", nombre, e.target.value.trim());
            e.target.value =""
            e.target.focus()
        }
    });
})

const socket =io();



/*socket.on("NewProduct",datos =>{
    console.log(datos);
    let ulProducto=document.getElementById("productos")
    ulProducto.innerHTML+=`<li>${datos.description} - precio es: $ $${datos.price}<button>agregar al carrito</button></li>`

} )*/

alert('hola')

