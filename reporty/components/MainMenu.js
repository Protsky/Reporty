import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome'; // You can choose other icon libraries as well

const MainMenu = () => {
  const navigation = useNavigation();

  const goToRegistrazioneAttivita = () => {
    navigation.navigate('RegistrazioneAttivita');
  };
  const goToArchivio = () => {
    navigation.navigate('Archivio');
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={goToRegistrazioneAttivita}>
        <Icon name="tasks" style={styles.icon} />
        <Text style={styles.buttonText}>Attività</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={goToArchivio}>
        <Icon name="archive" style={styles.icon} />
        <Text style={styles.buttonText}>Archivio</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f4f4f4',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3498db',
    paddingVertical: 15,
    paddingHorizontal: 20,
    marginBottom: 20,
    borderRadius: 10,
    elevation: 5,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  icon: {
    color: '#ffffff',
    fontSize: 20,
    marginTop: 2, // Add a margin on top for better alignment
  },
});

export default MainMenu;
