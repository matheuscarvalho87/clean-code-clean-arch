import express, { Request, Response } from 'express'
import { signup } from './signup';
import { getAccount } from './getAccount';

const app = express()
app.use(express.json())
const port = 3000

app.post('/signup',async (req:Request,res:Response)=>{
  const {name,email,cpf,password,carPlate,isPassenger,isDriver}= req.body;
  const response = await signup({name,email,cpf,password,carPlate,isPassenger,isDriver})
  res.status(201).json(response)
})

app.post('/account/:accountId',async (req:Request,res:Response)=>{
  const accountId = req.params.accountId;
  const response = await getAccount(accountId)
  res.status(200).json(response)
})


app.listen(port,()=>{
  console.log(`Server is running on http://localhost:${port}`)
})