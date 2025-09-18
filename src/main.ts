import { ChatController } from "./ChatController";

document.addEventListener("DOMContentLoaded", async () => {
  const chatController = new ChatController();
  await chatController.initialize();
});
