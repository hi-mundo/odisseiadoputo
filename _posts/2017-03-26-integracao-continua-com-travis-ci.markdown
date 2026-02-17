---
layout:     post
title:      "Integração Contínua com Travis-CI"
subtitle:   "Chegou a hora de ter menos dores de cabeça durante o desenvolvimento do seu app."
date:       2017-03-26 12:00:00
author:     "Fabricio Serralvo"
header-img: "img/serralvo/cover.png"
category:   ios
---

# Lorem Ipsum Dolor Sit

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.

Você pode ler um pouco mais sobre o assunto [aqui (conteúdo em inglês)](https://example.com).

# Travis CI

Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

O uso do Travis para projetos _open source_ é gratuito 🎉. Para utilizá-lo em projetos privados você terá que desembolsar alguns dólares.

Para começar a utilizar basta acessar [travis-ci.org](https://travis-ci.org) para projetos _open source_ ou [travis-ci.com](https://travis-ci.com) para projetos privados.

# Benefícios

Entre os benefícios do uso do Travis destaco a velocidade em que os problemas corriqueiros são encontrados. Outro ponto interessante é a integração realizada pelo Travis com o GitHub.

![]({{ site.baseurl }}/img/serralvo/commits-travis.png)

_Marcação visual do status da build_

# Hora do Show

Para exemplificar o funcionamento do Travis criei um projeto. Esse projeto gerou três ítens para explorarmos:

* Será necessário gerenciar as dependências do projeto.
* Execução da _build_.
* Por fim, notificaremos o time sobre o _status_ do projeto.

# Arquivo .travis.yml

Para que essas tarefas listadas acima funcionem, nós precisaremos criar um arquivo que fornecerá instruções para o Travis. Aí é que entra o `.travis.yml`.

Antes de começarmos a escrever o arquivo de configuração, precisamos entender como funciona o ciclo de vida do processo de _build_ do Travis. O Travis divide a execução do _job_ em duas etapas.

![]({{ site.baseurl }}/img/serralvo/travis-ci-org.png)

O próximo passo é "ativar" o Travis para o repositório desejado.

![]({{ site.baseurl }}/img/serralvo/start-travis.png)

Após o cadastro chegou a hora de criar o arquivo *.travis.yml* na raiz do repositório. Veja abaixo:

~~~
language: objective-c
osx_image: xcode8.1
~~~

Ué, `objective-c`?! Mas o projeto não está escrito em Swift? Sim, até o momento o Travis utiliza o valor `objective-c` para Swift e também para Objective-C.

## Baixando as dependências

Se você já usou CocoaPods ao menos uma vez, sabe que basta executar `pod install`. No ambiente do Travis isso é um pouco diferente:

~~~
podfile: path/to/Podfile
~~~

Se o seu projeto usa outro gerenciador de dependências:

~~~
install: sh dependencies.sh
~~~

## Build e Sucesso

Após obter as dependências do projeto, basta apenas configurar alguns parâmetros para a execução da _build_. São eles:

* _Path_ do `xcworkspace` ou `xcproject`.
* Algum _scheme_ com a opção _shared_ ativada.
* SDK que será usado (no caso estamos usando `iphonesimulator`).

~~~
script:
  - xcodebuild -workspace DemoTravisCI.xcworkspace -scheme 'DemoTravisCI' -sdk iphonesimulator build
~~~

Sendo assim, no momento o arquivo `.travis.yml` possui o seguinte conteúdo:

~~~
language: objective-c
osx_image: xcode8.1

script:
  - xcodebuild -workspace DemoTravisCI.xcworkspace  -scheme DemoTravisCI -sdk iphonesimulator build
~~~

## Notificações

Para detectar possíveis problemas com o projeto, é interessante compartilhar o status da _build_ com o time. O Travis provê diversas opções para notificações. No nosso caso, vamos ser avisados via Slack 📢.

Para isso, o primeiro passo é adicionar uma nova integração ao Slack. Concluído tal passo, vamos incluir a chave `notifications` no arquivo `.travis.yml`:

~~~
notifications:
  slack: yourteam:G1P621hDDwEH3pXeCcJpck8i
~~~

Importante: Caso seu projeto seja aberto, é recomendado criptografar a chave.

# Considerações Finais

Ferramentas de integração contínua são realidade no mercado e fazem parte da rotina de qualquer grande projeto de software. Se você se interessou pelo assunto e deseja implantar tal processo em seus projetos, saiba que existem diversas opções, como Jenkins, Xcode Server, CircleCI, entre outras.

Para finalizar, Integração Contínua é um dos pilares do desenvolvimento ágil 🙃.

### Referencias:

* [Getting started](https://docs.travis-ci.com/user/getting-started/)
* [Building an Objective-C Project](https://docs.travis-ci.com/user/languages/objective-c/)
* [Notifications](https://docs.travis-ci.com/user/notifications/)
