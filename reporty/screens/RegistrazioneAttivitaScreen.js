import React, { useState } from 'react';
import { View, TextInput, Button } from 'react-native';

const RegistrazioneAttivitaScreen = () => {
  const [attivita, setAttivita] = useState('');
  const [tempoLavoro, setTempoLavoro] = useState('');

  const handleSave = () => {
    // Salva i dati nel tuo stato globale o nel tuo database
  };

  return (
    <View>
      <TextInput
        placeholder="Attività svolte"
        value={attivita}
        onChangeText={setAttivita}
      />
      <TextInput
        placeholder="Tempo di lavoro"
        value={tempoLavoro}
        onChangeText={setTempoLavoro}
      />
      <Button title="Salva" onPress={handleSave} />
    </View>
  );
};

export default RegistrazioneAttivitaScreen;
