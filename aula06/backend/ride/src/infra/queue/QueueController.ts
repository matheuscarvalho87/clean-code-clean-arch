import { ProcessPayment } from '../../application/usecase/ProcessPayment';
import { inject } from '../dependency-injection/Registry';
import Queue from './Queue';


export default class QueueController{

  @inject("processPayment")
  processPayment?: ProcessPayment
  constructor(queue:Queue){
    queue.consume("rideCompleted", async (input: any)=>{
      await this.processPayment?.execute(input)
    })
  }
}