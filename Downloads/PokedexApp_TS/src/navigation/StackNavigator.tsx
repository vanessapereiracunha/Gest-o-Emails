import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen';
import DetailsScreen from '../screens/DetailsScreen';

export type RootStackParamList = {
  Home: undefined;
  Details: { pokemon: PokemonMinimal };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function StackNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Pokédex' }} />
      <Stack.Screen name="Details" component={DetailsScreen} options={({ route }) => ({ title: route.params.pokemon.name })} />
    </Stack.Navigator>
  );
}

export interface PokemonMinimal {
  name: string;
  url: string;
  image?: string | null;
  details?: {
    height?: number;
    weight?: number;
    types?: string[];
  };
}
