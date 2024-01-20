import {validateCpf} from '../src/validateCpf'

test.each([
"97456321558",
"71428793860",
"87748248800"
])('Deve validar se o cpf é valido: %s',(cpf:string)=>{
  const isValid = validateCpf(cpf)
  expect(isValid).toBe(true)
})

test.each([
  "8774824880",
  null,
  undefined,
  "11111111111",
  ])('Deve validar se o cpf é inválido: %s',(cpf:any)=>{
    const isValid = validateCpf(cpf)
    expect(isValid).toBe(false)
  })