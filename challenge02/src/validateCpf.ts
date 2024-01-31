function removeNonDigits(cpf:string){
  return cpf.replace(/\D/g,"")
}

function isInvalidLenght(cpf:string){
	const CPF_LENGTH = 11
		return cpf.length !== CPF_LENGTH
}
function hasAllDigitsEqual(cpf:string){
	const [firstCpfDigit] = cpf
	return [...cpf].every(digit => digit === firstCpfDigit)
}

function calculateDigit(cpf:string, factor:number){
	let total = 0
	for(const digit of cpf){
		if(factor > 1 ) total += parseInt(digit) * factor--;
	}
	const rest = total%11
	return(rest<2) ? 0 : 11 - rest
}

function extractDigit(cpf:string){
 return cpf.slice(9); 
}

export function validateCpf (cpf: string) {
	if (!cpf) return false
	const cleanedCpf = removeNonDigits(cpf)
	if (isInvalidLenght(cleanedCpf)) return false
	if (hasAllDigitsEqual(cleanedCpf)) return false
	const digit1 = calculateDigit(cleanedCpf, 10)
	const digit2 = calculateDigit(cleanedCpf, 11)
	return extractDigit(cleanedCpf) ===  `${digit1}${digit2}`;
}