import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, FlatList, SafeAreaView, ActivityIndicator, RefreshControl, Alert, StyleSheet } from 'react-native';
import PokemonCard from '../components/PokemonCard';
import axios from 'axios';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList, PokemonMinimal } from '../navigation/StackNavigator';
import { useNavigation } from '@react-navigation/native';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

const API_BASE = 'https://pokeapi.co/api/v2/pokemon/';
const PAGE_LIMIT = 20;

export default function HomeScreen() {
  const navigation = useNavigation<NavigationProp>();
  const [pokemons, setPokemons] = useState<PokemonMinimal[]>([]);
  const [offset, setOffset] = useState(0);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [hasNext, setHasNext] = useState(true);

  const fetchPage = useCallback(async (newOffset = 0, replace = false) => {
    if (loading) return;
    setLoading(true);
    try {
      const url = `${API_BASE}?offset=${newOffset}&limit=${PAGE_LIMIT}`;
      const res = await axios.get(url);
      const data = res.data;
      const items: PokemonMinimal[] = data.results.map((r: any) => ({ name: r.name, url: r.url }));

      const withImages = await Promise.all(items.map(async item => {
        try {
          const dres = await axios.get(item.url);
          const dt = dres.data;
          return {
            ...item,
            image: dt.sprites?.front_default || null,
            details: { height: dt.height, weight: dt.weight, types: dt.types.map((t: any) => t.type.name) }
          } as PokemonMinimal;
        } catch (e) {
          return { ...item, image: null } as PokemonMinimal;
        }
      }));

      setPokemons(prev => (replace ? withImages : [...prev, ...withImages]));
      setOffset(newOffset + PAGE_LIMIT);
      setHasNext(!!data.next);
    } catch (err) {
      console.error(err);
      Alert.alert('Erro', 'Falha ao carregar Pokémons.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [loading]);

  useEffect(() => { fetchPage(0, true); }, []);

  const loadMore = () => { if (hasNext && !loading) fetchPage(offset); };
  const onRefresh = () => { setRefreshing(true); fetchPage(0, true); };

  const openDetails = (p: PokemonMinimal) => navigation.navigate('Details', { pokemon: p });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}><Text style={styles.title}>Pokédex</Text></View>
      {pokemons.length === 0 && loading ? (
        <View style={styles.centered}><ActivityIndicator size='large' /><Text>Carregando...</Text></View>
      ) : (
        <FlatList
          data={pokemons}
          keyExtractor={(item, idx) => item.name + idx}
          renderItem={({ item }) => <PokemonCard pokemon={item} onPress={openDetails} />}
          onEndReached={loadMore}
          onEndReachedThreshold={0.5}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          ListFooterComponent={() => loading && <ActivityIndicator />}
          contentContainerStyle={{ padding: 8 }}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fc3e3eff' },
  header: { padding: 12, alignItems: 'center', backgroundColor: '#ef5350' },
  title: { fontSize: 22, color: '#fff', fontWeight: '700' },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' }
});
