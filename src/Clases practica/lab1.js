const mostrarList =(lista=[]) =>{
    if (lista.length === 0) {
        console.log("lista vacia")
        return
    }
    lista.forEach(producto => {
        console.log(producto)
    })
    console.log (`lista.length ${lista.length} productos`)
}
//console.log(mostrarList())
mostrarList ([2,4,5,7,2,4])

