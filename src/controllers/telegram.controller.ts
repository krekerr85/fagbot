
import { Request, Response } from 'express';
import { TelegramService } from '../services/telegram.service';
// Middleware для проверки аутентификации
class TelegramController {
  private readonly telegramService: TelegramService
  constructor( telegramService: TelegramService){
    this.telegramService = telegramService;
  }
  async createOrder(req: Request, res: Response){
    //const orders: OrderDTO[] = req.body;
    try{
     
      res.status(200).json({ success: true, message: 'Orders created successfully' });
    }catch(e){
      console.log(e);
      res.status(500).json({ success: false, message: 'Error creating orders', error: e });
    }
    
  }

}

export default TelegramController;