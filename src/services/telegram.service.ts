import { botT, ctxT } from "../types/telegramType";
import { sleep } from "../utils/functions";
import { UserModel } from "../models/user.model";
import { InfoModel } from "../models/info.model";
import cron from "node-cron";
import { GroupModel } from "../models/group.model";
export class TelegramService {
  constructor(private readonly bot: botT) {
    this.init();
  }

  async init() {
    cron.schedule("0 0 * * *", this.reloadAll, {
      timezone: "Europe/Moscow",
    });

    this.bot.start(async (ctx) => {
      console.log(ctx.from);
      console.log(ctx.chat);

      await ctx.reply(
        "Здорова, пидоры и красавчики! Приятно присоединиться к вашей беседе!"
      );
      await this.bot.telegram.setMyCommands(
        [
          { command: "/reg", description: "Чтобы учавствовать в розыгрыше." },
          { command: "/delete", description: "Чтобы сбежать с поля боя." },
          {
            command: "/run",
            description:
              "Запустить барабан усатого, чтобы узнать кто красавчик дня.",
          },
          {
            command: "/pidor",
            description:
              "Запустить барабан усатого, чтобы узнать кто пидор дня.",
          },
          { command: "/stats", description: "Результаты игры красавчика." },
          { command: "/pidorstats", description: "Результаты игры пидора." },
        ],
        { scope: { type: "all_private_chats" } }
      );
      await this.createGroup(ctx.chat);
    });

    setInterval(async () => {}, 60 * 60 * 1000);

    this.bot.command("reg", async (ctx) => {
      await this.createUser(ctx);
      ctx.reply("Отлично, ты в игре");
    });

    this.bot.command("delete", async (ctx) => {
      await this.deleteUser(ctx);
      ctx.reply("Отлично, ты больше не учавствуешь в игре");
    });

    this.bot.command("run", async (ctx) => {
      const { id } = ctx.chat;
      const prevCoolDay = await this.currentCoolOfTheDay(id);
      if (!prevCoolDay) {
        const coolDay = await this.getCoolOfTheDay(id);
        if (!coolDay) {
          ctx.reply("ВНИМАНИЕ 🔥");
          await sleep(3000);
          ctx.reply("СПАСИБО ЗА ВНИМАНИЕ 🔥");
          return;
        }
        const { last_name, first_name, username } = coolDay;
        ctx.reply("КРУТИМ БАРАБАН");
        await sleep(2000);
        ctx.reply("Ищем красавчика в этом чате");
        await sleep(2000);
        ctx.reply("Гадаем на бинарных опционах 📊");
        await sleep(2000);
        ctx.reply("Анализируем лунный гороскоп 🌖");
        await sleep(2000);
        ctx.reply("Лунная призма дай мне силу 💫");
        await sleep(2000);
        ctx.reply("СЕКТОР ПРИЗ НА БАРАБАНЕ 🎯");
        await sleep(2000);
        let fullName;
        if (first_name && last_name) {
          fullName = `${last_name} ${first_name}`;
        } else if (first_name) {
          fullName = first_name;
        } else if (last_name) {
          fullName = last_name;
        }
        ctx.reply(`🎉 Сегодня красавчик дня - ${fullName} (@${username})`);
        return;
      }
      const { last_name, first_name, username } = prevCoolDay;
      let fullName;
      if (first_name && last_name) {
        fullName = `${last_name} ${first_name}`;
      } else if (first_name) {
        fullName = first_name;
      } else if (last_name) {
        fullName = last_name;
      }
      ctx.reply(`🎉 Сегодня красавчик дня - ${fullName} (@${username})`);
      return;
    });

    this.bot.command("pidor", async (ctx) => {
      const { id } = ctx.chat;
      const prevPidorDay = await this.currentPidorOfTheDay(id);
      if (!prevPidorDay) {
        const pidorDay = await this.getPidorOfTheDay(id);
        if (!pidorDay) {
          ctx.reply("ВНИМАНИЕ 🔥");
          await sleep(3000);
          ctx.reply("СПАСИБО ЗА ВНИМАНИЕ 🔥");
          return;
        }
        const { last_name, first_name, username } = pidorDay;
        ctx.reply("ВНИМАНИЕ 🔥");
        await sleep(2000);
        ctx.reply("ФЕДЕРАЛЬНЫЙ 🔍 РОЗЫСК ПИДОРА 🚨");
        await sleep(2000);
        ctx.reply("4 - спутник запущен 🚀");
        await sleep(2000);
        ctx.reply("3 - сводки Интерпола проверены 🚓");
        await sleep(2000);
        ctx.reply("2 - твои друзья опрошены 🙅");
        await sleep(2000);
        ctx.reply("1 - твой профиль в соцсетях проанализирован 🙀");
        await sleep(2000);

        let fullName;
        if (first_name && last_name) {
          fullName = `${last_name} ${first_name}`;
        } else if (first_name) {
          fullName = first_name;
        } else if (last_name) {
          fullName = last_name;
        }
        ctx.reply(`🎉 Сегодня ПИДОР 🌈 дня - ${fullName} (@${username})`);
        return;
      }
      const { last_name, first_name, username } = prevPidorDay;
      let fullName;
      if (first_name && last_name) {
        fullName = `${last_name} ${first_name}`;
      } else if (first_name) {
        fullName = first_name;
      } else if (last_name) {
        fullName = last_name;
      }
      ctx.reply(`🎉 Сегодня ПИДОР 🌈 дня - ${fullName} (@${username})`);
      return;
    });

    this.bot.command("stats", async (ctx) => {
      const cools: { [key: number]: number } = {};
      const infoList: (number | null | undefined)[] = (
        await InfoModel.find({ group_id: ctx.chat.id }, "currentCool")
      )
        .map((info) => info.currentCool)
        .filter(
          (value) =>
            typeof value === "number" && value !== null && value !== undefined
        );

      infoList.forEach((info) => {
        if (info) {
          if (cools.hasOwnProperty(info)) {
            cools[info] += 1;
          } else {
            cools[info] = 1;
          }
        }
      });

      const coolsArray = Object.entries(cools);

      // Sort the array based on the values in descending order
      coolsArray.sort((a, b) => b[1] - a[1]);

      // Convert the sorted array back into an object
      let message = "";
      let cnt = 1;
      for (const cool of coolsArray) {
        const user = await UserModel.findOne({ user_id: cool[0] });
        message += `${cnt++}) @${user?.username} - ${cool[1]} раз(а)\n`;
      }

      ctx.reply("🎉 Результаты Красавчик Дня\n" + message);
    });

    this.bot.command("pidorstats", async (ctx) => {
      const pidors: { [key: number]: number } = {};
      const infoList: (number | null | undefined)[] = (
        await InfoModel.find({ group_id: ctx.chat.id }, "currentPidor")
      )
        .map((info) => info.currentPidor)
        .filter(
          (value) =>
            typeof value === "number" && value !== null && value !== undefined
        );
      console.log(infoList);
      infoList.forEach((info) => {
        if (info) {
          if (pidors.hasOwnProperty(info)) {
            pidors[info] += 1;
          } else {
            pidors[info] = 1;
          }
        }
      });
      const pidorsArray = Object.entries(pidors);

      // Sort the array based on the values in descending order
      pidorsArray.sort((a, b) => b[1] - a[1]);
      console.log(pidorsArray);
      // Convert the sorted array back into an object
      let message = "";
      let cnt = 1;
      for (const pidor of pidorsArray) {
        const user = await UserModel.findOne({ user_id: pidor[0] });
        message += `${cnt++}) @${user?.username} - ${pidor[1]} раз(а)\n`;
      }

      ctx.reply("Результаты 🌈ПИДОР Дня\n" + message);

      this.bot.command("gnidastats", async (ctx) => {
        ctx.reply("Функция в разработке!");
      });
    });
  }

  async createGroup(chat: any) {
    if (chat.type === "group") {
      const existingGroup = await GroupModel.findOne({ group_id: chat.id });

      if (!existingGroup) {
        await GroupModel.create({
          group_id: chat.id,
          group_name: chat.title,
          date_created: new Date(),
        });
        this.reload(chat.id);
      }
    }
  }
  async currentPidorOfTheDay(group_id: number) {
    const info = await InfoModel.findOne({ group_id })
      .sort({ date_created: -1 })
      .limit(1);

    if (!info) {
      return false;
    }
    if (!info?.currentPidor) {
      return false;
    }
    const user = await UserModel.findOne({
      user_id: info.currentPidor,
      group_id,
    });

    return user;
  }
  async getPidorOfTheDay(group_id: number) {
    const user = await UserModel.findOne({ role: "pidor", group_id });
    await InfoModel.findOneAndUpdate(
      { group_id: user?.group_id },
      { currentPidor: user?.user_id },
      { sort: { date_created: -1 }, upsert: true, new: true }
    );
    return user;
  }

  async currentCoolOfTheDay(group_id: number) {
    const info = await InfoModel.findOne({ group_id })
      .sort({ date_created: -1 })
      .limit(1);

    if (!info) {
      return false;
    }
    if (!info?.currentCool) {
      return false;
    }
    const user = await UserModel.findOne({
      user_id: info.currentCool,
      group_id,
    });

    return user;
  }
  async getCoolOfTheDay(group_id: number) {
    const user = await UserModel.findOne({ role: "cool", group_id });
    await InfoModel.findOneAndUpdate(
      { group_id: user?.group_id },
      { currentCool: user?.user_id },
      { sort: { date_created: -1 }, upsert: true, new: true }
    );
    return user;
  }

  async createUser(ctx: any) {
    try {
      // Проверяем, существует ли пользователь с такими данными
      const existingUser = await UserModel.findOne({
        user_id: ctx.from?.id,
      });
      // Если пользователь существует, возвращаем его данные
      if (existingUser) {
        return existingUser;
      }

      // Если пользователь не существует, создаем нового пользователя
      const newUser = await UserModel.create({
        group_id: ctx.chat.id,
        group_name: ctx.chat.title,
        user_id: ctx.from?.id,
        first_name: ctx.from?.first_name,
        last_name: ctx.from?.last_name,
        username: ctx.from?.username,
      });
      return newUser;
    } catch (e) {
      console.error(e);
      throw e; // Пробросим ошибку, чтобы ее обработать в другом месте при необходимости
    }
  }
  async deleteUser(ctx: any) {
    await UserModel.findOneAndDelete({
      user_id: ctx.from?.id,
      group_id: ctx.chat.id,
    });
  }

  async reload(group_id: number) {
    return await InfoModel.create({
      currentPidor: null,
      currentCool: null,
      group_id,
    });
  }

  async reloadAll() {
    const groups = await GroupModel.find();
    for (const group of groups) {
      await this.reload(group.group_id);
    }
  }
}
