import { productModel } from "../models/product.model.js";
import { NotFoundError, LimitError, AlreadyExistsError } from "../../../utils.js";

class ProductManager {
  
  constructor(){}

  async getProducts(limit, page, sort, filter) {
    if(!isNaN(limit) && limit >= 0){
      // Si limit es 0, entonces devuelve 10 documentos
      if(sort != "asc" && sort != "desc"){
        sort = 1;
      } else {
        sort == "asc" ? sort = 1 : sort = -1;
      }
      if(filter){
        return await productModel.paginate({category: filter}, {limit: limit || 10, page: page, sort: {price: sort}, lean: true});
      } else {
        return await productModel.paginate({}, {limit: limit || 10, page: page, sort: {price: sort}, lean: true});
      }
    } else {
      throw new LimitError("Limit debe ser un numero mayor o igual a 0");
    }
  }

  async addProduct(objectProd){
      const data = await this.getProducts(0);
      if (!data.docs.some(prod => prod.code === objectProd.code)){
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