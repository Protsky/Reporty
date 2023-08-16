import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import firebase from "firebase/compat/app";
import "firebase/compat/database";



const firebaseConfig = {
  // Configurazione Firebase
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const ArchivioScreen = () => {
 

  

  const [rapporti, setRapporti] = useState([]);

  useEffect(() => {
    const attivitaRef = firebase.database().ref("attivita");

    attivitaRef.on("value", (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const rapportiList = Object.entries(data).map(([key, value]) => ({
          id: key,
          ...value,
        }));
        setRapporti(rapportiList);
      }
    });

    return () => attivitaRef.off("value");
  }, []);

  const getWeek = (date) => {
    const onejan = new Date(date.getFullYear(), 0, 1);
    return Math.ceil(((date - onejan) / 86400000 + onejan.getDay() + 1) / 7);
  };

  const raggruppaRapportiPerSettimana = (rapporti) => {
    const rapportiPerSettimana = {};

    rapporti.forEach((rapporto) => {
      const data = new Date(rapporto.data);
      const settimanaKey = `${data.getFullYear()}-${getWeek(data)}`;

      if (!rapportiPerSettimana[settimanaKey]) {
        rapportiPerSettimana[settimanaKey] = [];
      }
      rapportiPerSettimana[settimanaKey].push(rapporto);
    });

    return rapportiPerSettimana;
  };

  const rapportiRaggruppatiPerSettimana =
    raggruppaRapportiPerSettimana(rapporti);

  const handleDeleteRapporto = (rapportoId) => {
    // ... (existing delete code)
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Archivio dei rapporti:</Text>

      {Object.keys(rapportiRaggruppatiPerSettimana).map(
        (settimanaKey, index) => (
          <View key={index}>
            <Text style={styles.settimanaHeader}>Settimana {settimanaKey}</Text>
            {rapportiRaggruppatiPerSettimana[settimanaKey].map(
              (rapporto, index) => (
                <View style={styles.rapportoContainer} key={index}>
                  <View>
                    <Text style={styles.attivita}>
                      {rapporto.attivita}
                    </Text>
                    <Text style={styles.orario}>
                      Orario: {rapporto.orario_inizio} - {rapporto.orario_fine}
                    </Text>
                  </View>
                  <TouchableOpacity
                    onPress={() => handleDeleteRapporto(rapporto.id)}
                  >
                    <AntDesign name="delete" size={24} color="red" />
                  </TouchableOpacity>
                </View>
              )
            )}
            
          </View>
        )
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  ontainer: {
    padding: 16,
    backgroundColor: "#f0f0f0",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
  settimanaHeader: {
    fontSize: 15,
    fontWeight: "bold",
    marginTop: 16,
    marginBottom:10
  },
  rapportoContainer: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 8, // Adjusted padding
    marginBottom: 8, // Adjusted margin
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  attivita: {
    fontSize: 16, // Adjusted font size
    fontWeight: "bold",
    marginBottom: 8, // Adjusted margin
  },
  orario: {
    fontSize: 14, // Adjusted font size
    color: "#888",
  },
});

export default ArchivioScreen;
