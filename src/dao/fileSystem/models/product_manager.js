import fs from "fs";

async function writeFile(param_path, param_products) {
  // Funcion: void
  // Funcion encargada de ingresar los productos al archivo
  try {
    await fs.promises.writeFile(param_path, JSON.stringify(param_products), { encoding: 'utf-8' });
  } catch(e) {
    console.log(`Hubo un error al escribir el archivo: ${e}`);
  }
}

class ProductManager {
  constructor(){
    this.products = [];
    this.productId = 1;

    // El PATH del archivo

    this.path = '../products.json';

    this.initializeFile()
  }

  async initializeFile() {
    // Funcion: void
    // Funcion encargada de inicializar el archivo (crear un products.json) 
    // en caso que no exista (primera ejecucion)
    try {
      if(!fs.existsSync(this.path)) {
        await writeFile(this.path, this.products);
        console.log('Archivo inicializado correctamente');
      }
    } catch(e) {
      console.log(`Hubo un error al inicializar el archivo: ${e}`);
    }
  }

  async getProducts() {
    // Funcion: retorna this.products
    // Este metodo pasa a ser asincrono para poder ser reutilizado en otros
    // metodos de la clase

    try {
      const noParsedData = await fs.promises.readFile(this.path, 'utf-8');
      this.products = JSON.parse(noParsedData) 
      return this.products;
    } catch(e) {
      console.log(`Hubo un error al obtener los productos: ${e}`);
    }


  }

  async addProduct(objectProd){
    // Funcion: void
    // Este metodo pasa a ser asincrono para poder ser reutilizado en otros
    // metodos de la clase

    if (!objectProd.title || !objectProd.description || !objectProd.price || !objectProd.code || !objectProd.stock || !objectProd.category) {
      // Este condicional valida que todos los campos hayan sido completados
      return "Todos los campos son obligatorios...";
    } else {
      let bandera = true;
      
      try {
        // data -> this.products
        const data = await this.getProducts();
        do {  
          // Este bucle cumple la funcion de incrementar automaticamente el ID del producto en caso
          // de que encuentre un repetido 

          if (!data.some(prod => prod.id === this.productId)) {
            // Este condicional valida que no exista ningun producto con el mismo ID que el generado
            bandera = false;
            if (!data.some(prod => prod.code === objectProd.code)){
              // Este condicional valida que no exista ningun producto con el mismo codigo que el
              const product = { id: this.productId, title: objectProd.title, description: objectProd.description, price: objectProd.price, thumbnail: objectProd.thumbnail || [], code: objectProd.code, stock: objectProd.stock, status: objectProd.status ?? true, category: objectProd.category };
              
              this.products.push(product);

              await writeFile(this.path, this.products);
              
              return true; 
              
            } else {
              return `Error: ya existe un producto con el codigo ${objectProd.code}`;
            }
          } else {
            this.productId += 1;
          }
        } while (bandera)
      } catch(err) {
        return `Hubo un error al intentar agregar un nuevo producto '${objectProd.title}': ${err}`;
      }
    }

  }

  async getProductById(id) {
    // Funcion: retorna un producto de this.products con id = id

    try {
      // data -> this.products
      const data = await this.getProducts();

      const element = data.find(e => e.id === id);
      if(element){
        return element;
      } else {
        console.log(`No existe ningun producto con el ID ${id} para mostrar`);
      }
    } catch(e) {
      console.log(`Hubo un error al traer un producto con ID '${id}': ${err}`);
    }
  }

  async updateProduct(id, objectProd) {
    // Funcion: void

    try {
      // data -> this.products
      const data = await this.getProducts();
      // element -> el producto de ID = ID
      const element = await this.getProductById(id);
      if(element) {
        // Variable bandera: sirve para retornar true en caso de operacion exitosa
        let bandera = true;
        data.map((item) => {
          if(item.id === element.id){
            if (!objectProd.title || !objectProd.description || !objectProd.price || !objectProd.code || !objectProd.stock || !objectProd.category){
              // Este condicional valida que todos los campos hayan sido completados
              bandera = false;
            } else {
              item.title = objectProd.title;
              item.description = objectProd.description;
              item.price = objectProd.price;
              item.thumbnail = objectProd.thumbnail || [];
              item.code = objectProd.code;
              item.stock = objectProd.stock;
              item.status = objectProd.status ?? true;
              item.category = objectProd.category;
            }
          }
        })
        if(bandera) {
          await writeFile(this.path, data);
          return true;
        } else {
          return "Todos los campos son obligatorios..."
        }

      } else {
        return `No existe ningun producto con el ID '${id}' para actualizar`;
      }
    } catch(e) {
      return `UpdateProduct: hubo un error al obtener el producto con ID ${id}. ${e}`;
    }

  }

  async deleteProduct(id) {
    // Funcion: void

    try {
      // data -> this.products
      const data = await this.getProducts();
      // element -> el producto de ID = ID
      const element = await this.getProductById(id);

      if(element) {
        const eIndex = data.indexOf(element);
        data.splice(eIndex, 1);
        await writeFile(this.path, data);
        return true;
      } else {
        return `No existe ningun producto con el ID ${id}`;
      }

    } catch(e) {
      return `DeleteProduct. Hubo un error al tratar de eliminar el producto con ID '${id}': ${err}`;
    }
  }
}

export { ProductManager };