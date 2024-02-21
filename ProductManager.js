const fs = require("fs");

class ProductManager {
  constructor() {
    this.productos = [];
    this.path = "./productos.json";
  }

  addProduct(title, description, price, thumbnail, code, stock) {
    // Validacion
    if (!title || !description || !price || !thumbnail || !code || !stock) {
      console.log("Por favor complete todos los campos");
      return;
    }
    // Generar ID auto
    let id = 1;
    if (this.productos.length > 0) {
      id = this.productos[this.productos.length - 1].id + 1;
    }
    // Crear producto nuevo
    let newProduct = {
      id: id,
      title: title,
      description: description,
      price: price,
      thumbnail: thumbnail,
      code: code,
      stock: stock,
    };
    // Add product to the array
    this.productos.push(newProduct);
    try {
      fs.writeFileSync(this.path, JSON.stringify(this.productos));
      console.log("El producto ha sido agregado");
    } catch (error) {
      console.log("Error:", error.message);
    }
  }

  getProducts() {
    try {
      const data = fs.readFileSync(this.path, "utf-8");
      const productos = JSON.parse(data);
      console.log(productos);
      return productos;
    } catch (error) {
      console.log("Error:", error.message);
      return [];
    }
  }

//   getProductById(id) {
//     let productos = fs.readFileSync(this.path, "utf-8");
//     productos = JSON.parse(productos);
//     const productoId = productos.find((u) => u.id === id);
//     if (!productoId) {
//       console.log(`No existen productos con el id ${id}, prueba otro`);
//       return null;
//     }
//     return productoId;
//   }
getProductById(id) {
    try {
      let productos = fs.readFileSync(this.filePath, 'utf-8');
      productos = JSON.parse(productos);
      const productoId = productos.find(u => u.id === id);
      if (!productoId) {
        console.log(`No existen productos con el id ${id}, prueba otro`);
        return null;
      }
      return productoId;
    } catch (error) {
      console.error('Error occurred while reading or parsing products data:', error);
      return null;
    }
}

  updateProductById(id, newData) {
    const index = this.productos.findIndex((u) => u.id === id);
    if (index === -1) {
      console.log(`No existen productos con el id ${id}, prueba otro`);
      return false;
    }
    this.productos[index] = { ...this.productos[index], ...newData };
    try {
      fs.writeFileSync(this.path, JSON.stringify(this.productos));
      console.log("El producto ha sido actualizado");
      return true;
    } catch (error) {
      console.log("Error:", error.message);
      return false;
    }
  }

  deleteProductById(id) {
    const index = this.productos.findIndex((u) => u.id === id);
    if (index === -1) {
      console.log(`No existen productos con el id ${id}, prueba otro`);
      return false;
    }
    this.productos.splice(index, 1); // Eliminar el producto del array
    try {
      fs.writeFileSync(this.path, JSON.stringify(this.productos));
      console.log("El producto ha sido eliminado");
      return true;
    } catch (error) {
      console.log("Error:", error.message);
      return false;
    }
  }
}

module.exports= ProductManager
// Ejemplos
const manager = new ProductManager();
console.log(manager.getProducts());
manager.addProduct(
  "Producto 1",
  "Descripción 1",
  10.99,
  "imagen1.jpg",
  "ABC123",
  100
);
manager.addProduct(
  "Producto 2",
  "Descripción 2",
  20.49,
  "imagen2.jpg",
  "DEF456",
  50
);
manager.addProduct(
  "Producto 3",
  "Descripción 3",
  24.49,
  "imagen3.jpg",
  "DEF436",
  234
);
manager.addProduct(
  "Producto 3",
  "Descripción 3",
  24.49,
  "imagen3.jpg",
  "DEF436",
  2399
);
manager.addProduct(
  "Producto 3",
  "Descripción 3",
  24.49,
  "imagen3.jpg",
  "DEF436",
  2398
);
manager.addProduct(
  "Producto 3",
  "Descripción 3",
  24.49,
  "imagen3.jpg",
  "DEF436",  
  2397
);
console.log(manager.getProductById(2));
console.log(manager.getProductById(99));
console.log(manager.getProducts());
manager.updateProductById(2, { title: "Producto 2 Modificado" });
manager.deleteProductById(3);