

export default class Cpf{
  private value : string
  
  constructor(cpf:string){
    if (!this.validateCpf(cpf)) throw new Error("Invalid cpf");
    this.value = cpf;
  }

  private removeNonDigits(cpf:string){
    return cpf.replace(/\D/g,"")
  }
  
  private isInvalidLenght(cpf:string){
    const CPF_LENGTH = 11
      return cpf.length !== CPF_LENGTH
  }
  private hasAllDigitsEqual(cpf:string){
    const [firstCpfDigit] = cpf
    return [...cpf].every(digit => digit === firstCpfDigit)
  }
  
  private calculateDigit(cpf:string, factor:number){
    let total = 0
    for(const digit of cpf){
      if(factor > 1 ) total += parseInt(digit) * factor--;
    }
    const rest = total%11
    return(rest<2) ? 0 : 11 - rest
  }
  
  private extractDigit(cpf:string){
   return cpf.slice(9); 
  }
  
  private validateCpf (cpf: string) {
    if (!cpf) return false
    const cleanedCpf = this.removeNonDigits(cpf)
    if (this.isInvalidLenght(cleanedCpf)) return false
    if (this.hasAllDigitsEqual(cleanedCpf)) return false
    const digit1 = this.calculateDigit(cleanedCpf, 10)
    const digit2 = this.calculateDigit(cleanedCpf, 11)
    return this.extractDigit(cleanedCpf) ===  `${digit1}${digit2}`;
  }

  getValue(){
    return this.value
  }
} 