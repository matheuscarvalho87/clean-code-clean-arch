import AccountDAO from './AccountDAO'

interface Input{
   passengerId:string,
   from:{
    lat:number,
    long:number
   },
   to:{ 
    lat:number, 
    long:number
   }
}

export default class RequestRide{
  constructor (readonly accountDAO: AccountDAO) {
	}

  async execute(data:Input){
    const passenger = await this.accountDAO.getById(data.passengerId)
    if(!passenger || !passenger.isPassenger){
      throw new Error('User Not found or is not a passenger')
    }

  }
}