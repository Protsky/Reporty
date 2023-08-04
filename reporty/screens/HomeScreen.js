import React from 'react';
import { View, Text } from 'react-native';
import MainMenu from '../components/MainMenu';

const HomeScreen = () => {
  return (
    <View>
      <MainMenu />
      <Text>Questa è la schermata principale</Text>
      {/* Aggiungi qui il contenuto della tua schermata principale */}
    </View>
  );
};

export default HomeScreen;
