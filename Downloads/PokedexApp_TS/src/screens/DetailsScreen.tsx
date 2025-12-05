import React from 'react';
import { View, Text, SafeAreaView, Image, StyleSheet } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/StackNavigator';

type Props = NativeStackScreenProps<RootStackParamList, 'Details'>;

export default function DetailsScreen({ route }: Props) {
  const { pokemon } = route.params;
  const height = pokemon.details?.height ?? '—';
  const weight = pokemon.details?.weight ?? '—';
  const types = pokemon.details?.types ?? [];

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.name}>{pokemon.name}</Text>
      <Image source={{ uri: pokemon.image || undefined }} style={styles.image} />
      <Text style={styles.info}>Altura: {String(height)}</Text>
      <Text style={styles.info}>Peso: {String(weight)}</Text>
      <Text style={styles.info}>Tipos: {types.join(', ') || '—'}</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 16 },
  name: { fontSize: 28, fontWeight: 'bold', textTransform: 'capitalize' },
  image: { width: 200, height: 200, marginVertical: 12 },
  info: { fontSize: 16, marginVertical: 4 }
});
