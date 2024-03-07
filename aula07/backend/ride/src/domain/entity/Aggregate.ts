import DomainEvent from '../event/DomainEvent';

// Observable: 1:N -> atende apenas a um objeto, diferente do mediator() que  pode escutar em todos os eventos.
export default class Aggregate{
  listeners: {name:string,callback: Function}[];

  constructor(){
    this.listeners =[]
  }

  register(name:string,callback:Function){
    this.listeners.push({name,callback})
  }

  notify(event: DomainEvent){
    for(const listener of this.listeners){
      console.log('VAI NOTIFICAR',this.listeners, event)
      if(listener.name === event.name){
        listener.callback(event)
      }
    }
  }
}