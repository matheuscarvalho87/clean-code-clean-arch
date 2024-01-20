import { connection } from './databaseConnection'


export async function getAccount(accountId:string){
  const [account] = await connection.query("select * from cccat15.account where account_id= $1",[accountId])
  if(!account){
    return null
  }
  return account
}