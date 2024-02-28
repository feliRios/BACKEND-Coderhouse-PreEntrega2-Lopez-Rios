import mongoose from "mongoose";

// Archivo para la conexion de la DB

function connect(){
  return mongoose.connect("mongodb+srv://felipetomas:generic123@fcluster.q0b3m8s.mongodb.net/ecommerce")
  .then(() => {
    console.log("Base conectada correctamente.");
  })
  .catch((err) => {
    console.log(`Hubo un error al intentar conectar a la DB: ${err}`);
  })
}

export default connect;