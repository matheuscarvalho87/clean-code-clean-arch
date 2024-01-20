import { expect, describe, it} from '@jest/globals'
import axios from 'axios'

describe('Server',()=>{

  it('should be able to POST signup on route /signup ',async ()=>{
    const input = {
      name: 'Jonh Passenger',
      email: `jonhPassenger${Math.random()}@usuario.com`,
      cpf: '97456321558',
      password: '123456',
      carPlate: 'ABC1234',
      isPassenger: true,
      isDriver: false,
    };
    
    const response = await axios.post('http://localhost:3000/signup',input);

    expect(response.status).toBe(201)
    expect(response.data.accountId).toBeDefined()
  })
  it('should be able to GET account by id on route /account/:accountId ',async ()=>{
    const input = {
      name: 'Jonh Passenger',
      email: `jonhPassenger${Math.random()}@usuario.com`,
      cpf: '97456321558',
      password: '123456',
      carPlate: 'ABC1234',
      isPassenger: true,
      isDriver: false,
    };
    
    const responseSignup = await axios.post('http://localhost:3000/signup',input);
    const responseAccount = await axios.post(`http://localhost:3000/account/${responseSignup.data.accountId}`);

    expect(responseAccount.status).toBe(200)
    expect(responseAccount.data.name).toEqual('Jonh Passenger')
    expect(responseAccount.data.email).toEqual(input.email)
    expect(responseAccount.data.cpf).toEqual('97456321558')
    expect(responseAccount.data.is_passenger).toBe(true)
  })
})