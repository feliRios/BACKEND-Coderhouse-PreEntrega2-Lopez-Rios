import { cartModel } from "../models/cart.model.js";
import { NotFoundError } from "../../../utils.js";
import { CastError } from "mongoose";

class CartManager {
  constructor(){}

  async createCart() {
    await cartModel.create({products: []});
  }

  async getCarts() {
    return await cartModel.find();
  }

  async getCartById(cartId){
    const cart = await cartModel.findById(cartId);
      if(cart){
        return cart;
      } else {
        throw new NotFoundError(`No existe ningun carrito con el ID ${cartId} para mostrar`);
      }
  }

  async getCartProducts(cartId) {
    try {
      // Excepcion para manejar error "CastError" como "NotFoundError"
      // Metodo "populate" para desglosar la lista de productos del carrito
      const cartProducts = await cartModel.findOne({"_id": cartId}).populate("products.product").lean();
      if(cartProducts){
        return cartProducts;
      } else {
        throw new NotFoundError(`No existe ningun carrito con el ID ${cartId}`);
      }
    } catch(err) {
      if(err instanceof CastError){
        throw new NotFoundError(`No existe un carrito con el ID '${cartId}'`);
      } else {
        throw err;
      }
    }
  }

  async addProductToCart(cartId, productId) {
    const cart = await this.getCartById(cartId);
    const existingProductIndex = cart.products.findIndex(p => p.product.toString() === productId);
    if(existingProductIndex !== -1){
      cart.products[existingProductIndex].quantity += 1;
    } else {
      cart.products.push({product: productId, quantity: 1});
    }
    await cartModel.updateOne({ _id: cartId }, { products: cart.products });
  }

  async deleteCartProduct(cartId, productId) {
    const cart = await this.getCartById(cartId);
    const existingProductIndex = cart.products.findIndex(p => p.product.toString() === productId);
    if(existingProductIndex !== -1){
      cart.products.splice(existingProductIndex, 1);
    } else {
      throw new NotFoundError(`No existe un producto con el ID '${productId}'`);
    }
    await cartModel.updateOne({ _id: cartId }, { products: cart.products });
  }

  async updateProductQuantity(cartId, productId, newQuantity) {
    const cart = await this.getCartById(cartId);
    const existingProductIndex = cart.products.findIndex(p => p.product.toString() === productId);
    if(existingProductIndex !== -1){
      cart.products[existingProductIndex].quantity = newQuantity;
    } else {
      throw new NotFoundError(`No existe un producto con el ID '${productId}'`);
    }
    await cartModel.updateOne({ _id: cartId }, { products: cart.products });
  }

  async deleteCartProducts(cartId) {
    const cart = await this.getCartById(cartId);
    await cartModel.updateOne({ _id: cartId }, { products: [] });
  }
}

export { CartManager };