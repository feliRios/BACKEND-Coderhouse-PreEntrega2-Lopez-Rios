import express from "express";
import dbConnect from "./dao/db/index.js";
import { __dirname } from "./utils.js";
import handlebars from "express-handlebars";
import http from "http";
import { Server } from "socket.io";


// Importaciones de rutas y managers
import routerProd from "./routes/products.routes.js";
import routerCart from "./routes/carts.routes.js";
import routerMsg from "./routes/messages.routes.js";
import { MessageManager } from "./dao/db/mongoManagers/message_manager.js";
const mm = new MessageManager();

const app = express();
const PORT = 8080 || process.env.PORT;

// Middleware para enviar y recibir JSON
app.use(express.json());

// Middleware para servicio de archivos estaticos
app.use(express.static(__dirname+"/public"));

// Configuracion del motor de plantillas
app.engine("handlebars", handlebars.engine());
app.set("views", __dirname+"/views");
app.set("view engine", "handlebars");

// ***** Endpoints, rutas y socket *****

const server = http.createServer(app);

app.use("/api/product", routerProd);
app.use("/api/cart", routerCart);
app.use("/api/message", routerMsg);

app.get("/", (req, res) => {
  // ENDPOINT del home (pagina de inicio)
  res.send(`<h1 style="background-color: #49c; text-align: center; margin-top: 50px;">Pagina principal</h1>`)
});

server.listen(PORT, () => {
  console.log("Server listening on PORT", PORT);
  dbConnect();
})

const io = new Server(server);

io.on("connection", (socket) => {
  console.log("User connected");
  (async () => {
    io.sockets.emit("connection", await mm.getMessages());
  })();
  socket.on("newMessage", (data) => {
    try {
      mm.postMessage(data.user, data.text)
        .then(() => { 
          (async () => {
            io.sockets.emit("postedMessage", await mm.getMessages());
          })();
        })
        .catch((err) => { console.log(`(SOCKET) Ocurrio un error: ${err}`); })
    } catch(err) {
      console.log(err);
    }
  })
});