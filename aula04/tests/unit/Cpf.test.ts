import { test,expect } from '@jest/globals'
import Cpf from '../../src/domain/vo/Cpf'
test.each([
"97456321558",
"71428793860",
"87748248800"
])('Deve validar se o cpf é valido: %s',(cpf:string)=>{
  expect(new Cpf(cpf)).toBeDefined()
})

test.each([
  "8774824880",
  null,
  undefined,
  "11111111111",
  ])('Deve validar se o cpf é inválido: %s',(cpf:any)=>{
    expect(()=> new Cpf(cpf)).toThrow(new Error("Invalid cpf"))
  })