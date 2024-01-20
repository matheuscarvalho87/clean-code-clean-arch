import { getAccount } from '../src/getAccount'
import { signup } from '../src/signup'
import crypto from "crypto";

describe('GetAccount',()=>{
  it('should get account by id if it exists',async ()=>{
    const input = {
      name:'Jonh Passenger',
      email: `jonhPassenger${Math.random()}@usuario.com`,
      cpf: '97456321558',
      password: '123456',
      isPassenger: true,
    }

    const responseSingup = await signup(input)
    const responseGetAccount = await getAccount(responseSingup.accountId) 
    expect(responseGetAccount).toHaveProperty('name')
    expect(responseGetAccount.email).toBe(input.email)

  })

it(`should return null if account don't exists`,async ()=>{
    const randomId = crypto.randomUUID();
    const responseGetAccount = await getAccount(randomId) 
    expect(responseGetAccount).toBeNull()
    
  })
})