import { expect, describe, it} from '@jest/globals'
import {signup} from '../src/signup'
import {getAccount} from '../src/getAccount'
describe('Signup',()=>{

  it('should create a new passenger account',async ()=>{
    const input = {
      name:'Jonh Passenger',
      email: `jonhPassenger${Math.random()}@usuario.com`,
      cpf: '97456321558',
      password: '123456',
      isPassenger: true,
    }

    const responseSingup = await signup(input)
    const responseGetAccount = await getAccount(responseSingup.accountId)

    expect(responseSingup.accountId).toBeDefined()
    expect(responseGetAccount.name).toEqual('Jonh Passenger')
    expect(responseGetAccount.email).toEqual(input.email)
    expect(responseGetAccount.cpf).toEqual('97456321558')
    expect(responseGetAccount.is_passenger).toBe(true)
  })
  it('should create a new driver account',async ()=>{
    const input = {
      name:'Jonh Driver',
      email: `jonhDriver${Math.random()}@usuario.com`,
      cpf: '97456321558',
      password: '123456',
      carPlate: 'ABC1234',
      isDriver: true,
    }

    const responseSingup = await signup(input)
    const responseGetAccount = await getAccount(responseSingup.accountId)

    expect(responseSingup.accountId).toBeDefined()
    expect(responseGetAccount.name).toEqual('Jonh Driver')
    expect(responseGetAccount.email).toEqual(input.email)
    expect(responseGetAccount.cpf).toEqual('97456321558')
    expect(responseGetAccount.is_driver).toBe(true)
  })
  
  it('should throw an error if email already exists',async ()=>{
    const input1 = {
      name:'Jonh Driver',
      email: `jonhDriver${Math.random()}@usuario.com`,
      cpf: '97456321558',
      password: '123456',
      carPlate: 'ABC1234',
      isDriver: true,
    }
   
  
    await signup(input1)

    await expect(()=>{
      return  signup(input1)
    }).rejects.toThrowError('Email already exists')
  })
  it('should throw an error if name is invalid',async ()=>{
    const input = {
      name:'!@Jonh Passenger99',
      email: `jonhPassenger${Math.random()}@usuario.com`,
      cpf: '97456321558',
      password: '123456',
      isPassenger: true,
    }
    await expect(()=>{
      return  signup(input)
    }).rejects.toThrowError('Invalid name')
  })
  it('should throw an error if email is invalid',async ()=>{
    const input = {
      name:'Jonh Driver',
      email: `jonhDriver${Math.random()}`,
      cpf: '97456321558',
      password: '123456',
      carPlate: 'ABC1234',
      isDriver: true,
    }
    await expect(()=>{
      return  signup(input)
    }).rejects.toThrowError('Invalid email')
  })
  it('should throw an error if CPF is invalid',async ()=>{
    const input = {
      name:'Jonh Driver',
      email: `jonhDriver${Math.random()}@usuario.com`,
      cpf: '97456321000',
      password: '123456',
      carPlate: 'ABC1234',
      isDriver: true,
    }
    await expect(()=>{
      return  signup(input)
    }).rejects.toThrowError('Invalid CPF')
  })
  it('should throw an error if user is driver and car plate is invalid',async ()=>{
    const input = {
      name:'Jonh Driver',
      email: `jonhDriver${Math.random()}@usuario.com`,
      cpf: '97456321558',
      password: '123456',
      carPlate: 'ABC-1234',
      isDriver: true,
    }
    await expect(()=>{
      return  signup(input)
    }).rejects.toThrowError('Invalid Car Plate')
  })
})