# SINGLETON
o padrão singleton impede que use o contructor e utilize somente método de instanciação
que cria uma espécie de cache estético em memória.

se torna um anti-pattern se usar o singleton para armazenar estado global da aplicação
e voce tem uma mutação de estados por meio de diferentes lugares interferindo na estabilidade
da aplicação


# DI vs DIP

Dependency Injection: Implementação(constructor, setter, registry, annotation)

Dependency Inversion: Design (high level modules shoul not depend on low level modules, both depend on abstraction)