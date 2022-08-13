import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export const ScreenConfig = () => (
  <View style={styles.container}>
    <Text style={styles.title}>Configurações</Text>
    <Text style={styles.paragraph}>Tela em desenvolvimento</Text>
  </View>
);
export const ScreenSeparacaoRancho = () => (
  <View style={styles.container}>
    <Text style={styles.title}>Separação Rancho</Text>
    <Text style={styles.paragraph}>Tela em desenvolvimento</Text>
  </View>
);
export const ScreenSaidaDiaria = () => (
  <View style={styles.container}>
    <Text style={styles.title}>Saida diária</Text>
    <Text style={styles.paragraph}>Tela em desenvolvimento</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontWeight: '700',
    fontSize: 40,
  },
  paragraph: {
    fontWeight: '600',
  },
});
