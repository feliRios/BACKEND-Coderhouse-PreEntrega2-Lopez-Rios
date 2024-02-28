import fs from "fs";

async function writeFile(param_path, param_cart) {
  // Funcion: void
  // Funcion encargada de ingresar los productos al archivo (el carrito completo)
  try {
    await fs.promises.writeFile(param_path, JSON.stringify(param_cart), { encoding: 'utf-8' });
  } catch(e) {
    console.log(`Hubo un error al escribir el archivo: ${e}`);
  }
}

class CartManager {
  constructor(){
    this.carts = [];
    this.cartId = 1;
    this.path = "../cart.json";
    this.initializeFile();
  }

  async initializeFile() {
    // Funcion: void
    // Funcion encargada de inicializar el archivo (crear un cart.json) 
    // en caso que no exista (primera ejecucion)
    try {
      if(!fs.existsSync(this.path)) {
        await writeFile(this.path, this.carts);
        console.log('Archivo inicializado correctamente');
      }
    } catch(e) {
      console.log(`Hubo un error al inicializar el archivo: ${e}`);
    }
  }

  async createCart() {
    let bandera = true;
    
    // data -> this.carts
    const data = await this.getCarts();
    do {
      // Este bucle cumple la funcion de incrementar automaticamente el ID del carrito en caso
      // de que encuentre un repetido 
      if(!data.some(cart => cart.id === this.cartId)){
        // Este condicional valida que no exista ningun producto con el mismo ID que el generado
        bandera = false;
        const newCart = {id: this.cartId, products: []};
        this.carts = data;
        this.carts.push(newCart);
        await writeFile(this.path, this.carts);
        return true;
      } else {
        this.cartId += 1;
      }
    } while(bandera);
    
  }

  async getCarts() {
    const response = await fs.promises.readFile(this.path, {encoding: "utf-8"});
    const responseJSON = JSON.parse(response);
    return responseJSON;
  }

  async getCartProducts(cartId) {
    const carts = await this.getCarts();
    const cart = carts.find(cart => cart.id === cartId);
    if(cart) {
      return cart.products;
    } else {
      console.log(`No existe ningun carrito con el ID ${cartId}`);
    }
  }

  async addProductToCart(cartId, productId) {
    const carts = await this.getCarts();
    const index = carts.findIndex(cart => cart.id === cartId);
    if(index != -1){
      const cartProducts = await this.getCartProducts(cartId);
      const indexProduct = cartProducts.findIndex(product => product.productId === productId);
      if(indexProduct != -1) {
        // Si el producto ya se encuentra agregado en el carrito, entonces 
        // suma la cantidad del mismo en uno.
        cartProducts[indexProduct].quantity += 1;
      } else {
        // Si el producto no se encuentra en el carrito, entonces lo agrega.
        cartProducts.push({productId, quantity: 1});
      }
      carts[index].products = cartProducts;
      await writeFile(this.path, carts);
      return true;
    } else {
      return `No existe un carrito con el ID ${cartId}`;
    }
  }
}

export { CartManager };