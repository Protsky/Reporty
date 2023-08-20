import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { AntDesign, Entypo } from "@expo/vector-icons"; // Import the Entypo icon
import firebase from "firebase/compat/app";
import "firebase/compat/database";

const firebaseConfig = {
  apiKey: "AIzaSyCJorBqsG0xTm9unbxnj6NLtb1WWTgL3BE",
  authDomain: "reporty-b66fa-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "reporty-b66fa",
  storageBucket: "reporty-b66fa.appspot.com",
  messagingSenderId: "504973056130",
  appId: "1:504973056130:web:f5f21a9855d89618907c9b",
  measurementId: "G-1SH61TVL1V",
  databaseURL:
    "https://reporty-b66fa-default-rtdb.europe-west1.firebasedatabase.app",
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const database = firebase.database();

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
  const getDayOfWeek = (date) => {
    const daysOfWeek = [
      "Domenica",
      "Lunedì",
      "Martedì",
      "Mercoledì",
      "Giovedì",
      "Venerdì",
      "Sabato",
    ];
    return daysOfWeek[date.getDay()];
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
    // Reference the specific rapporto you want to delete
    const rapportiRef = firebase.database().ref(`attivita/${rapportoId}`);

    // Remove the rapporto from Firebase
    rapportiRef
      .remove()
      .then(() => {
        console.log("Rapporto deleted successfully");
      })
      .catch((error) => {
        console.error("Error deleting rapporto:", error);
      });
  };

  const handleDownloadFile = (fileUrl) => {
    fetch(fileUrl)
      .then((response) => response.blob())
      .then((blob) => {
        // Create a URL for the blob object
        const url = URL.createObjectURL(blob);

        // Create an anchor element and simulate a click to trigger download
        const a = document.createElement("a");
        a.href = url;
        a.download = fileUrl.split("/").pop(); // Extract the file name from URL
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);

        // Clean up by revoking the object URL
        URL.revokeObjectURL(url);
      })
      .catch((error) => {
        console.error("Error downloading file:", error);
      });
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
                  <Text style={styles.attivita}>{rapporto.attivita}</Text>
                  <View style={styles.orarioDeleteContainer}>
                    <View style={styles.dayOfWeekContainer}>
                      <Text style={[styles.dayOfWeek, { fontWeight: "bold" }]}>
                        {getDayOfWeek(new Date(rapporto.data))}
                      </Text>
                    </View>
                    <Text style={styles.orario}>
                      {rapporto.orario_inizio} - {rapporto.orario_fine}
                    </Text>
                    <TouchableOpacity
                      style={styles.deleteButton}
                      onPress={() => handleDeleteRapporto(rapporto.id)}
                    >
                      <AntDesign name="delete" size={24} color="red" />
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.downloadButton}
                      onPress={() => handleDownloadFile(rapporto.fileURL)}
                    >
                      <Entypo name="download" size={24} color="blue" />
                    </TouchableOpacity>
                  </View>
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
  container: {
    padding: 2,
    backgroundColor: "#f0f0f0",
  },
  dayOfWeekContainer: {
    width: 80, // Set a fixed width for the day of the week
  },
  dayOfWeek: {
    fontSize: 14,
    color: "#888",
    fontWeight: "bold",
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
    marginBottom: 10,
  },
  deleteButton: {
    marginLeft: 10, // Add margin to separate delete icon from time text
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
  orarioDeleteContainer: {
    flexDirection: "row",
    alignItems: "center", // Align items at the center of the container
    justifyContent: "flex-start", // Start the content from the left
  },
  attivita: {
    fontSize: 16, // Adjusted font size
    fontWeight: "bold",
    marginBottom: 8, // Adjusted margin
    marginRight: 8,
  },
  orario: {
    fontSize: 14, // Adjusted font size
    color: "#888",
  },
  downloadButton: {
    marginLeft: 5, // Add margin to separate download icon from delete icon
  },
});

export default ArchivioScreen;
