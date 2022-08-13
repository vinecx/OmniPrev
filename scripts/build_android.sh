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

echo 'Inicializando o build...'
cd android
./gradlew bundleRelease
echo 'Arquivo gerado com sucesso localizado em: /android/app/build/outputs/bundle/release/app-release.abb'