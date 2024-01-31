import { test,expect, beforeEach } from '@jest/globals'
import RequestRide from '../src/FindARide'
import GetAccount from '../src/GetAccount'
import {AccountDAODatabase, AccountDAOMemory} from '../src/AccountDAO'

let getAccount: GetAccount;
let requestRide: RequestRide;

beforeEach(()=>{
  const accountDAO = new AccountDAODatabase();
	requestRide = new RequestRide(accountDAO);
	getAccount = new GetAccount(accountDAO);
})

test('should find a ride to a passenger',async ()=>{
  const input = {
    passengerId:'pass-id-1',
    from:{
      lat:123456,
      long:56493
    },
    to:{ 
      lat:159681, 
      long:321684
    }
  }

  const findARideOutput = await  requestRide.execute(input)
  expect(findARideOutput).toBeTruthy() // if it returns
})