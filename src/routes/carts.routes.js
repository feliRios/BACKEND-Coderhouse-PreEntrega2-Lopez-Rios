import { Router } from "express";
import { CartManager } from "../dao/db/mongoManagers/cart_manager.js";
import { NotFoundError } from "../utils.js";

const routerCart = Router();
const cm = new CartManager();

routerCart.post("/", async (req, res) => {
  // Servicio POST de carts para crear un carrito nuevo
  try {
    await cm.createCart();
    res.status(201).send({
      msg: "Carrito creado correctamente"
    });
  } catch(err) {
    res.status(500).send({
      name: err.name,
      msg: err.message
    })
  }
});

routerCart.get("/:cid", async (req, res) => {
  // Servicio GET de carts. Lista los productos de un carrito
  // dado su ID (cid)
  try {
    const cid = req.params.cid;
    const products = await cm.getCartProducts(cid);
    // res.send({
    //   data: products 
    // })
    res.render("cart", {
      "products": products["products"],
      "style": "cart.css"
    })
  } catch(err) {
    err instanceof NotFoundError ? res.status(404).send({
      name: err.name,
      msg: err.message
    }) : res.status(500).send({
      name: err.name,
      msg: err.message
    });
  }
});

routerCart.post("/:cid/product/:pid", async (req, res) => {
  // Servicio POST de carts, para agregar productos a un carrito
  const cid = req.params.cid;
  const pid = req.params.pid;
  try {
    await cm.addProductToCart(cid, pid);
    res.send({
      msg: "Producto agregado al carrito correctamente"
    })
  } catch(err) {
    res.status(500).send({
      name: err.name,
      msg: err.message
    });
  }
});

routerCart.put("/:cid", async (req, res) => {
  // Servicio PUT de carts, para actualizar el carrito con un arreglo de productos
  const cid = req.params.cid;
  try {
    
  } catch(err) {

  }
});

routerCart.delete("/:cid/product/:pid", async (req, res) => {
  // Servicio DELETE de carts, para eliminar del carrito el producto seleccionado
  const cid = req.params.cid;
  const pid = req.params.pid;
  try {
    await cm.deleteCartProduct(cid, pid);
    res.send({
      msg: "Producto eliminado correctamente del carrito"
    });
  } catch(err) {
    err instanceof NotFoundError ? res.status(404).send({
      name: err.name,
      msg: err.message
    }) : res.status(500).send({
      name: err.name,
      msg: err.message
    });
  }
});

routerCart.put("/:cid/product/:pid", async (req, res) => {
  // Servicio PUT de carts, para actualizar solo la cantidad de productos de un
  // producto de un carrito seleccionado
  const cid = req.params.cid;
  const pid = req.params.pid;
  const { quantity } = req.body;
  try {
    await cm.updateProductQuantity(cid, pid, quantity);
    res.send({
      msg: "Producto actualizado correctamente"
    });
  } catch(err) {
    err instanceof NotFoundError ? res.status(404).send({
      name: err.name,
      msg: err.message
    }) : res.status(500).send({
      name: err.name,
      msg: err.message
    });
  }
});

routerCart.delete("/:cid", async (req, res) => {
  const cid = req.params.cid;
  try {
    await cm.deleteCartProducts(cid);
    res.send({
      msg: "Carrito vaciado correctamente"
    })
  } catch(err) {
    err instanceof NotFoundError ? res.status(404).send({
      name: err.name,
      msg: err.message
    }) : res.status(500).send({
      name: err.name,
      msg: err.message
    });
  }
});

export default routerCart;