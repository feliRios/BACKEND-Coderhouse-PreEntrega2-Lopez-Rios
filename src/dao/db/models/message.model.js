import mongoose from "mongoose";

const messageCollection = "message";  // El nombre de la coleccion en la DB

const messageSchema = new mongoose.Schema({
  // Se definen todos los campos que tiene un mensaje (el documento a insertar) en la
  // coleccion
  user: {
    // Cada propiedad va a contener una serie de opciones
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  }
})

export const messageModel = mongoose.model(messageCollection, messageSchema);