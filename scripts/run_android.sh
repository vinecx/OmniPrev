#!/bin/bash

NODE_VERSION=$(node --version)
SUB='v17'

# CASO A VERSÃO DO NODE SEJA A 17 EXPORTA NODE_OPTIONS
case $NODE_VERSION in
    *"$SUB"*)
        export NODE_OPTIONS=--openssl-legacy-provider       
    ;;
esac

export ANDROID_HOME=$HOME/Android/Sdk
export PATH=$PATH:$ANDROID_HOME/emulator
export PATH=$PATH:$ANDROID_HOME/tools
export PATH=$PATH:$ANDROID_HOME/tools/bin
export PATH=$PATH:$ANDROID_HOME/platform-tools

echo 'Inicializando instalação...'
sleep 2s
yarn android 
echo 'Iniciando aplicação, aguarde...'
echo 'Atenção: Caso após iniciar a aplicação no dispositivo a tela 
mostrar uma mensagem de erro "Unable to load script,
feche a aplicação pelo emulador/dispositivo  e abra novamente..."'
sleep 5s
yarn start --reset-cache
