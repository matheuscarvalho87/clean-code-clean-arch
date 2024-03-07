import Signup from '../../application/usecase/Signup';
import { inject } from '../dependency-injection/Registry';
import Queue from './Queue';


export default class QueueController{
  @inject("signup")
	signup?: Signup

  constructor(queue:Queue){
    queue.consume("signup", async (input:any) =>{
      await this.signup?.execute(input)
    })
  }
}