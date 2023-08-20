import React, { useState} from "react";
import { View, TextInput, Button } from "react-native";
import { Calendar } from "react-native-calendars";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { useFilePicker } from "use-file-picker";
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";
import { getDatabase, ref, push, set } from "firebase/database";
import "firebase/compat/storage"; 
import { uploadBytes } from "firebase/storage";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";




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



const database = getDatabase();
const storage = firebase.storage(); // Ottieni l'istanza del modulo Storage


const RegistrazioneAttivitaScreen = () => {
  const [attivita, setAttivita] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedStartTime, setSelectedStartTime] = useState("");
  const [selectedEndTime, setSelectedEndTime] = useState("");
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
 
 

  const [openFileSelector, { filesContent, loading }] = useFilePicker({
    accept: ".png"
  });

  if (loading) {
    return <div>Loading...</div>;
  }



  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleDateConfirm = (date) => {
    setSelectedDate(date.toISOString().slice(0, 10));
    hideDatePicker();
    setTimePickerVisibility(true);
  };

  

  const handleSave = async () => {
    const selectedStartTimeHours = selectedStartTime.$H;
    const selectedStartTimeMinutes = selectedStartTime.$m;
  
    const formattedSelectedStartTime = `${selectedStartTimeHours
      .toString()
      .padStart(2, "0")}:${selectedStartTimeMinutes
      .toString()
      .padStart(2, "0")}`;
  
    const selectedEndTimeHours = selectedEndTime.$H;
    const selectedEndTimeMinutes = selectedEndTime.$m;
  
    const formattedSelectedEndTime = `${selectedEndTimeHours
      .toString()
      .padStart(2, "0")}:${selectedEndTimeMinutes.toString().padStart(2, "0")}`;
  
    const attivitaRef = ref(database, "attivita");
    const newAttivitaRef = push(attivitaRef);
  
    const newData = {
      data: selectedDate,
      attivita: attivita,
      orario_inizio: formattedSelectedStartTime,
      orario_fine: formattedSelectedEndTime,
    };
  
    try {
      if (filesContent) {
        for (const selectedFile of filesContent) {
          try {
            const storageRef = storage.ref();
            const fileExtension = selectedFile.name.split(".").pop();
            const fileName = `${new Date().getTime()}.${fileExtension}`;
            const fileRef = storageRef.child(fileName);
  
            try {
              await uploadBytes(fileRef, selectedFile);
              console.log("Uploaded a blob or file!");
            } catch (error) {
              console.error("Error uploading file:", error);
            }
  
            // Get the download URL of the uploaded file
            const downloadURL = await fileRef.getDownloadURL();
  
            // Add the file details to newData
            newData.fileURL = downloadURL;
            newData.fileName = selectedFile.name;
          } catch (error) {
            console.error("Error uploading file:", error);
          }
        }
      }
  
      // Save the data to the database
      try {
        await set(newAttivitaRef, newData);
        console.log("Data saved successfully");
      } catch (error) {
        console.error("Error saving data to the database:", error);
      }
  
      setAttivita("");
      setSelectedDate("");
      setSelectedStartTime("");
      setSelectedEndTime("");
    } catch (error) {
      console.error("Error saving data:", error);
    }
  };
  

  

  return (
    <View style={{ padding: 20 }}>
      <Calendar
        style={{ marginBottom: 20 }}
        onDayPress={(day) => setSelectedDate(day.dateString)}
        markedDates={{
          [selectedDate]: { selected: true, selectedColor: "#2E66E7" },
        }}
      />

      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        onConfirm={handleDateConfirm}
        onCancel={hideDatePicker}
      />

      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <TextInput
          placeholder="Inserisci qui l'attività"
          value={attivita}
          onChangeText={setAttivita}
          multiline={true}
          numberOfLines={5}
          style={{
            flex: 1,
            borderWidth: 1,
            borderColor: "#2E66E7",
            borderRadius: 5,
            padding: 10,
            marginRight: 10,
            height: 150,
          }}
        />

        <button onClick={() => openFileSelector()}>Select files </button>
      </View>

      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DemoContainer components={["TimePicker"]}>
          <TimePicker
            label="Start time"
            value={selectedStartTime} // Imposta il valore del selezionatore di orario
            onChange={(newValue) => setSelectedStartTime(newValue)} // Aggiungi questo gestore
          />
          <TimePicker
            label="Stop time"
            style={{ marginRight: 10 }}
            value={selectedEndTime} // Imposta il valore del selezionatore di orario
            onChange={(newValue) => setSelectedEndTime(newValue)} // Aggiungi questo gestore
          />
        </DemoContainer>
      </LocalizationProvider>

      <View style={{ marginTop: 20, width: 100 }}>
        <Button title="Salva" onPress={handleSave} />
      </View>
    </View>
  );
};

export default RegistrazioneAttivitaScreen;
