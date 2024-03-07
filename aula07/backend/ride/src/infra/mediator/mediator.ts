//padrão mediator: desacopla objetos, faz com que objetos/classes que precisem  se comunicar entre si possam ser independentes um do outro.
//ex: ao inves de finishRide injetar(sendEmail,sendInvoice...), tem um mediator que entende a ação e executa por fora
//N:N posso cadastrar vários service, N classe cadastradas notificando N eventos
export default class Mediator{
  services:{event:string, callback:Function }[]

  constructor(){
    this.services = []
  }

  register(event:string, callback:Function){
    this.services.push({event, callback})
  }

  async notify(event:string, data:any) {
    for(const service of this.services){
      if (service.event === event) await service.callback(data)
    }
  }
}