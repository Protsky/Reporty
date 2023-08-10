import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './screens/HomeScreen'; // La schermata principale
import RegistrazioneAttivitaScreen from './screens/RegistrazioneAttivitaScreen'; // La schermata di registrazione delle attività
import ArchivioScreen from './screens/Archivio';
import CostiScreen from './screens/Costi';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Reporty" component={HomeScreen} />
        <Stack.Screen name="RegistrazioneAttivita" component={RegistrazioneAttivitaScreen} />
        <Stack.Screen name="Archivio" component={ArchivioScreen} />
        <Stack.Screen name="Costi" component={CostiScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
