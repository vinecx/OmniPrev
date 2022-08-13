# Base React Native - Aplicativo

<img src="https://img.shields.io/static/v1?label=react native&message=OmniPrev&color=orange&style=for-the-badge&logo=REACT"/>

# Tópicos

:small_blue_diamond: [Resumo do projeto](#resumo-do-projeto)

:small_blue_diamond: [Entregas](#entregas)

:small_blue_diamond: [Tecnologias Utilizadas](#tecnologias-utilizadas)

:small_blue_diamond: [Ambiente de Desenvolvimento](#ambiente-de-desenvolvimento)

:small_blue_diamond: [Baixar projeto](#baixar-o-projeto)

:small_blue_diamond: [Opções de execução](#opções-de-execução)

# Entregas

> Entrega do projeto: Concluído :warning:

> Publicação Playstore :warning:

> Publicação Apple Store :warning:

# Tecnologias utilizadas

- [React native](https://reactnative.dev/) - Framework de interface para mobile;
- [Styled components](https://styled-components.com/) - Componente de estilização de componentes;
- [React native paper](https://callstack.github.io/react-native-paper/) - Biblioteca de componentes de UI;
- [Redux](https://redux.js.org/introduction/getting-started) - Gerenciador de estado global unidirecional.
- [Realm DB](https://www.mongodb.com/docs/realm/sdk/react-native/) - Banco de dados local.

# Ambiente de desenvolvimento

Para desenvolver neste projeto é necessário ter instalado na máquina o Android Studio:

[Fazer download Android Studio](https://developer.android.com/studio)

# Baixar o projeto

Para baixar o projeto basta executar o seguinte comando no seu terminal:


# Opções de execução

### Instalar Aplicação no emulador / Dispositivo

Para instalar a aplicação diretamente no emulador ou dispositivo conectado, basta executar o comando no seu terminal:

## Linux:

```
sh run_android.sh
```

## Windows

```
react-native run-android
```

Logo após a conclusão do comando acima, executar o seguinte comando para inicializar o servidor da aplicação:

```
react-native start
```

> Caso queira executar um versão prévia da release executar o seguinte comando

```
react-native run-android --variant=release
```

## Gerar APK para teste (DEBUG)

Para gerar a build do projeto, basta executar o comando no seu terminal:

```
cd android
./gradlew assembleDebug
```

> Arquivo localizado em: <b>/android/app/build/outputs/apk/</b>  
> Nome Arquivo: <b>app-debug.apk</b>

<h1 id="build-section">Gerar .AAB para publicação</h1>

Para gerar uma versão para publicação são necessários a chave da aplicação <b>.keystore</b> que deve estar nomeada da seguinte forma <code>controle_desperdicios-release.keystore</code> a qual já está configurada nos arquivos de configuração do android para geração da versão.

A cada publicação da aplicação na playstore ou Apple Store é necessário incrementar a propriedade <code>versionCode</code> e <code>versionName</code>.

Exemplo:

```
versionCode 12
versionName "12.0"
```

> Arquivo localizado em: <b>/android/app</b>  
> Nome Arquivo: <b>build.gradle</b>

Logo após, executar o seguinte comando para a geração do arquivo <b>.AAB</b>

```
cd android
./gradlew bundleRelease
```

> Arquivo localizado em: <b>/android/app/build/outputs/bundle/release/</b>  
> Nome Arquivo: <b>app-release.aab</b>

## Desenvolvimento:

Para o executá-lo, devemos importar o projeto na IDE sua preferência.

Para o instalar todas as dependências do projeto, devemos executar o seguinte comando na pasta do projeto pelo terminal:

```
    yarn
```

Ou:

```
    npm install
```

<h1 style="text-align: center; margin-top: 40px; font-weight: bold">
    Guia de instalação
</h1>
<p style="text-align: center;">
    Abaixo temos todos os guias de instalações das ferramentas utilizadas no projeto:
</p>

- [Java SE Development Kit 11](#jdk11)
- [NodeJS](#nodejs)
  - [NVM](#nvm)
  - [Instalação](#nvm-install)
- [Yarn](#yarn)
  - [Instalação](#yarn-install)
- [Insomnia](#insomnia)
- [VSCode](#vscode)
  - [Extensões](#extensões-necessárias---vscode)
  - [Fonte](#fontes)

<div style="margin-bottom: 30px"></div>

<h1 id="jdk11">Java SE Development Kit 11</h1>

Baixar e instalar o Java SE Development Kit 11 a partir [deste link](https://www.oracle.com/br/java/technologies/javase-jdk11-downloads.html).

# NodeJS

## NVM

Instalar o NVM (Node Version Manager), pois com ele é possível instalar e gerenciar de forma mais prática as versões do Node.
Faça a instalação seguindo [este link](https://github.com/nvm-sh/nvm).

<h3 id="nvm-install">Instalação<h3>

Verificar a versão LTS no site do [NodeJS](https://nodejs.org/en/download/).

> Exemplo: v14.16

No terminal, executar o comando para a instalar:

```
nvm install 14.16
```

Para verificar se instalou com sucesso, rodar o comando:

```
node -v
```

Caso uso já tenha outra versão do Node instalada é possível alternar entre as versões usando o seguinte comando:

```
nvm use $(version)
```

> Ex: nvm use 14.16

# Yarn

Yarn é um gerenciador de pacotes.

<h3 id="yarn-install">Instalação</h3>
Instalar o Yarn de forma global com o seguinte comando:

```
npm install -g yarnTear-DownTear-Down
```

# Insomnia

Ferramenta para testes de requisições à API
[Download](https://insomnia.rest/)

# VSCode

<h2 id="instalacao-vscode">Instalação:</h2>

Baixar e instalar o VSCode a partir [deste link](https://code.visualstudio.com/).

Ver extensões [aqui](#extensões-necessárias---vscode):

## Extensões necessárias - VSCode

- **Tailwind CSS IntelliSense** - Ferramenta de auto complete para classes do Tailwind CSS
- **EditorConfig for VS Code** - Suporte para o Editor Config utilizado no projeto
- **ESLint** - Apontar melhorias no código
- **GitLens** - Adiciona um pacote de funcionalidades novas no VSCode para Git
- **Prettier - Code formatter** - Aplica embelzamentos ao código para legibilidade
- **SonarLint** - Indica problemas para concertarmos no código

## Extensões recomendadas - VSCode

- **Material Icon Theme** - Pacote de icones para a árvore de arquivos do VSCode
- **React Hooks Snippets** - Adiciona Snippets para hooks no React
- **Color Hightlight** - Adiciona ferramentas para utilização de cores na hora de programar

Também é possível achar temas para personalizar o VSCode dentro da sua loja de extensões. Alguns temas recomendados são: Dracula Official, Omni, One Dark Pro, Winter Is Coming, Palenight e Atom One

## Fontes

As fontes **não** são obrigatórias. Você pode escolher qualquer fonte que preferir. É recomendado que se use fontes monospace.

Para trocar a fonte do VSCode, basta executar o comando `ctrl + shift + p`, pesquisar por `Preferences: Open Settings (JSON)` e adicionar as seguintes linhas para o arquivo:

```JSON
"editor.fontFamily": "Nome da Fonte",
"editor.fontLigatures": true,
```

E necessário recarregar o VSCode para que a fonte mude. Para isso execute novamente o comando `ctrl + shift + p` e procure por `Developer: Reload Window`.

Caso não queira usar a fonte padrão, aqui seguir segue uma lista de fontes recomendadas para desenvolvimento:

- **Fira Code**:

Baixar e instalar a fonte Fira Code: [link](https://github.com/tonsky/FiraCode/releases)

- **JetBrains Mono**:

Baixar e instalar a fonte JetBrains Mono: [link](https://www.jetbrains.com/pt-br/lp/mono/)
"# OmniPrev" 
