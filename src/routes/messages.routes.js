import { Router } from "express";
import { MessageManager } from "../dao/db/mongoManagers/message_manager.js";

const routerMessage = Router();
const mm = new MessageManager();

routerMessage.get("/", (req, res) => {
  res.render("chat", {
    style: "chat.css"
  });
});

export default routerMessage;