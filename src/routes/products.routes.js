import { Router } from "express";
import { ProductManager } from "../dao/db/mongoManagers/product_manager.js";
import { NotFoundError, LimitError, AlreadyExistsError } from "../utils.js";

const routerProd = Router();
const pm = new ProductManager();

routerProd.get("/", async (req, res) => {
  // Servicio GET para obtener los products
  try {
    const limit = req.query.limit ? req.query.limit : 0;
    const page = req.query.page ? req.query.page : 1;
    let sort = req.query.sort;
    if(req.query.sort == "asc" || req.query.sort == "desc"){
      console.log(sort);
    }
    const filter = JSON.stringify(req.query.filter);
    const products = await pm.getProducts(limit, page, sort, filter);
    res.render("products", {
      "products": products,
      "totalPages": products["totalPages"],
      "style": "products.css"
    });
    // res.send({
    //   payload: products,
    //   prevLink: products["hasPrevPage"] ? `http://localhost:8080/api/product?page=${products["prevPage"]}` : null,
    //   nextLink: products["hasNextPage"] ? `http://localhost:8080/api/product?page=${products["nextPage"]}` : null
    // });
  } catch(err) {
    err instanceof LimitError ? res.status(400).send({
      name: err.name,
      msg: err.message
    }) : res.status(500).send({
      name: err.name,
      msg: err.message
    });
  }
});

routerProd.get("/:pid", async (req, res) => {
  // Servicio GET by ID de products. Muestra el producto dado su ID (pid)
  try {
    const pid = req.params.pid;
    const product = await pm.getProductById(pid)
    res.send({
      data: product
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


routerProd.post("/createProd", async (req, res) => {
  // Servicio POST para crear un producto
  try {
    await pm.addProduct(req.body);
    res.status(201).send({
      msg: "Producto creado",
      data: req.body
    });
  } catch(err) {
    err instanceof AlreadyExistsError ? res.status(400).send({
      name: err.name,
      msg: err.message
    }) : res.status(500).send({
      name: err.name,
      msg: err.message
    });
  }
});

routerProd.put("/editProd/:pid", async (req, res) => {
  // Servicio PUT para actualizar un producto
  // Recibe el ID del producto a actualizar mediante req.params
  // Recibe la informacion a actualizar del producto mediante req.body
  try {
    const pid = req.params.pid;
    await pm.updateProduct(pid, req.body);
    res.send({
      msg: "Producto actualizado correctamente",
      data: await pm.getProductById(pid)
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

routerProd.delete("/deleteProd/:pid", async (req, res) => {
  // Servicio DELETE para eliminar un producto
  try {
    const pid = req.params.pid;
    await pm.deleteProduct(pid);
    res.send({
      msg: "Producto eliminado correctamente"
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

export default routerProd;