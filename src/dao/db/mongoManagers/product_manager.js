import { productModel } from "../models/product.model.js";
import { NotFoundError, LimitError, AlreadyExistsError } from "../../../utils.js";

class ProductManager {
  
  constructor(){}

  async getProducts(limit) {
    if(!isNaN(limit)){
      if(limit == 0){
        // Si limit es 0, entonces devuelve todos los documentos (productos)
        return await productModel.find();
      }
      return await productModel.find().limit(limit);
    } else {
      throw new LimitError("Limit debe ser un numero");
    }
  }

  async addProduct(objectProd){
      const data = await this.getProducts(0);
      if (!data.some(prod => prod.code === objectProd.code)){
        await productModel.create(objectProd);
        return true;
      } else {
        throw new AlreadyExistsError(`Ya existe un producto con el codigo ${objectProd.code}`);
      }
  }

  async getProductById(id) {
      const product = await productModel.findOne({_id: id});
      if(product){
        return product;
      } else {
        throw new NotFoundError(`No existe ningun producto con el ID ${id} para mostrar`);
      }
  }

  async updateProduct(id, objectProd) {
      const product = await this.getProductById(id);
      if(product) {
        // Condicional para validar que el producto exista
        await productModel.updateOne({"_id": id}, {$set: objectProd});
        return true;
      } else {
        throw new NotFoundError(`No existe ningun producto con el ID '${id}' para actualizar`);
      }
  }

  async deleteProduct(id) {
      const product = await this.getProductById(id);
      if(product) {
        await productModel.deleteOne({"_id": id});
        return true;
      } else {
        throw new NotFoundError(`No existe ningun producto con el ID ${id} para eliminar`);
      }
  }
}

export { ProductManager };