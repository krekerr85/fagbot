import express, { Request, Response } from "express";
import { Telegraf } from "telegraf";
import { TelegramService } from "./services/telegram.service";
import setupTelegramRoutes from "./routes/telegram.router";
import { connectDB } from "./db";
import cors from "cors";
import path from "path";
import dotenv from "dotenv";
// Create Express app

dotenv.config({
  path: path.resolve(__dirname, `../.env.${process.env.NODE_ENV}`),
});
const app = express();
app.use(cors());
// Set up JSON body parsing middleware
console.log(process.env.MONGO_DB)
app.use(express.json());
const BOT_TOKEN = process.env.TELEGRAM_TOKEN || "YOUR_BOT_TOKEN";
const bot = new Telegraf(BOT_TOKEN);

bot.launch();
const telegramService = new TelegramService(bot);
// Set up routes
app.use("/api/telegram", setupTelegramRoutes(telegramService));

// Set up error handling middleware
app.use((err: Error, req: Request, res: Response) => {
  console.error(err.stack);
  res.status(500).json({ error: "Internal Server Error" });
});

// Start the Express app
async function init() {
  await connectDB();
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

init();
// Create and start the Telegraf bot
