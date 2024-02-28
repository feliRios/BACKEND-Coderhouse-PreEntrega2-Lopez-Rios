import mongoose from "mongoose";

const productCollection = "product";  // El nombre de la coleccion en la DB

const productSchema = new mongoose.Schema({
  // Se definen todos los campos que tiene un producto (el documento a insertar) en la
  // coleccion
  title: {
    // Cada propiedad va a contener una serie de opciones
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  thumbnail: {
    type: Array,
    default: [""]
  },
  code: {
    type: Number,
    required: true
  },
  stock: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    default: "true"
  },
  category: {
    type: String,
    required: true,
    enum: ["Tortas", "Alfajores", "Bombones", "Panaderia"]
  }
})

export const productModel = mongoose.model(productCollection, productSchema);