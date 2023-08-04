import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const MainMenu = () => {
  const navigation = useNavigation();

  const goToRegistrazioneAttivita = () => {
    navigation.navigate('RegistrazioneAttivita');
  };

  return (
    <View>
      <TouchableOpacity onPress={goToRegistrazioneAttivita}>
        <Text>Attività</Text>
      </TouchableOpacity>
    </View>
  );
};

export default MainMenu;
