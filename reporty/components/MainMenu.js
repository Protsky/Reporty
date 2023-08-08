import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const MainMenu = () => {
  const navigation = useNavigation();

  const goToRegistrazioneAttivita = () => {
    navigation.navigate('RegistrazioneAttivita');
  };
  const goToArchivio = () => {
    navigation.navigate('Archivio');
  };

  return (
    <View>
      <TouchableOpacity onPress={goToRegistrazioneAttivita}>
        <Text>Attività</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={goToArchivio}>
        <Text>Archivio</Text>
      </TouchableOpacity>
    </View>
  );
};

export default MainMenu;
