import { messageModel } from "../models/message.model.js";

class MessageManager {
  constructor(){}

  async getMessages(){
    const messages = await messageModel.find();
    return messages;
  }

  async postMessage(user, text){
    await messageModel.create({"user": user, "message": text});
  }
}

export { MessageManager };