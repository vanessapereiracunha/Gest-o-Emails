import React from 'react';
import { TouchableOpacity, Image, Text, View, StyleSheet } from 'react-native';
import type { PokemonMinimal } from '../navigation/StackNavigator';

type Props = {
  pokemon: PokemonMinimal;
  onPress: (p: PokemonMinimal) => void;
};

export default function PokemonCard({ pokemon, onPress }: Props) {
  return (
    <TouchableOpacity style={styles.card} onPress={() => onPress(pokemon)} accessibilityLabel={`Card do Pokémon ${pokemon.name}`}>
      <Image source={{ uri: pokemon.image || 'https://via.placeholder.com/96' }} style={styles.sprite} />
      <View style={styles.textBox}>
        <Text style={styles.name}>{pokemon.name}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: { flexDirection: 'row', backgroundColor: '#fff', marginVertical: 6, padding: 12, borderRadius: 8, elevation: 2, alignItems: 'center' },
  sprite: { width: 72, height: 72, marginRight: 12 },
  textBox: { flex: 1 },
  name: { textTransform: 'capitalize', fontSize: 18, fontWeight: '600' }
});
