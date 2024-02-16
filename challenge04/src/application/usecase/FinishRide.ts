import { PaymentGateway } from '../../infra/gateway/PaymentGateway';
import RideRepository from '../../infra/repository/RideRepository';

export default class FinishRide{
  constructor(readonly rideRepository: RideRepository, readonly paymentGateway: PaymentGateway){}

  async execute({rideId,cardNumber,cvv,expirationMonth,expirationYear}:Input){
    const ride = await this.rideRepository.get(rideId)
    if (!ride)  throw new Error('Ride does not exist')
    ride.finish()
    const paymentResponse = await this.paymentGateway.processPayment(cardNumber, cvv, expirationMonth, expirationYear)
    if(paymentResponse==='success') await this.rideRepository.update(ride)
    else throw new Error('Payment failed')
  } 
}

type Input = {
	rideId: string,
  cardNumber:string,
  cvv:number,
  expirationMonth: number,
  expirationYear: number
}
