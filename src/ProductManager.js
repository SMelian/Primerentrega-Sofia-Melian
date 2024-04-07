const modeloProductos = require('./dao/models/productos.modelo');
const mongoosePaginate = require('mongoose-paginate-v2');

class ProductManager {
  constructor() {
    //this.productos = [];
    //this.path = "./productos.json";
  }

  async addProduct(title, description, price, thumbnail, code, stock) {
    try {
      if (!title || !description || !price || !code || !stock) {
        throw new Error("Por favor complete todos los campos");
      }

      const newProduct = new modeloProductos({
        title: title,
        description: description,
        price: price,
        thumbnail: thumbnail,
        code: code,
        stock: stock,
      });

      await newProduct.save();
      console.log("El producto ha sido agregado");
    } catch (error) {
      console.error("Error al agregar el producto:", error);
      throw error; // Re-lanza el error para que el manejador de la ruta pueda capturarlo y responder en consecuencia
    }
  }

  async getProductsViejo() {
    try {
      const products = await modeloProductos.find().lean();
      return products;
    } catch (error) {
      console.error("Error al obtener los productos:", error);
      throw error;
    }
  }

  async getProducts(options) {
    try {
      const { limit = 10, page = 1 } = options;
      const products = await modeloProductos.paginate({}, {
        ...options,
        limit: parseInt(limit),
        page: parseInt(page),
       // sort: sort ? JSON.parse(sort) : { createdAt: -1 },
        lean: true 
      });
      return products;
    } catch (error) {
      console.error("Error al obtener los productos:", error);
      throw error;
    }
  }



  async getProductById(id) {
    try {
      const product = await modeloProductos.findById(id).lean();
      if (!product) {
        throw new Error(`No existen productos con el id ${id}`);
      }
      return product;
    } catch (error) {
      console.error("Error al obtener el producto por id:", error);
      throw error;
    }
  }

  async updateProductById(id, newData) {
    try {
      const updatedProduct = await modeloProductos.findByIdAndUpdate(id, newData, { new: true }).lean();
      if (!updatedProduct) {
        throw new Error(`No existen productos con el id ${id}`);
      }
      console.log("El producto ha sido actualizado");
      return updatedProduct;
    } catch (error) {
      console.error("Error al actualizar el producto:", error);
      throw error;
    }
  }

  async deleteProductById(id) {
    try {
      const deletedProduct = await modeloProductos.findByIdAndDelete(id).lean();
      if (!deletedProduct) {
        throw new Error(`No existen productos con el id ${id}`);
      }
      console.log("El producto ha sido eliminado");
      return true;
    } catch (error) {
      console.error("Error al eliminar el producto:", error);
      throw error;
    }
  }
}

module.exports = ProductManager;

/*const manager = new ProductManager();
console.log(manager.getProducts());
manager.addProduct(
  "Producto 1",
  "Descripción 1",
  10.99,
  "imagen1.jpg",
  "ABC123",
  100
);*/