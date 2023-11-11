import express, { Request, Response } from "express";
import { Telegraf } from "telegraf";
import { TelegramService } from "./services/telegram.service";
import { connectDB } from "./db";
import cors from "cors";
import path from "path";
import dotenv from "dotenv";


dotenv.config({
  path: path.resolve(__dirname, `../.env.${process.env.NODE_ENV}`),
});
const app = express();
app.use(cors());

app.use(express.json());
const BOT_TOKEN = process.env.TELEGRAM_TOKEN || "YOUR_BOT_TOKEN";
const bot = new Telegraf(BOT_TOKEN);

bot.launch();
new TelegramService(bot);

app.use((err: Error, req: Request, res: Response) => {
  console.error(err.stack);
  res.status(500).json({ error: "Internal Server Error" });
});


async function init() {
  await connectDB();
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

init();

