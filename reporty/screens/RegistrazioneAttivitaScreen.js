import React, { useState } from "react";
import { View, TextInput, Button, TouchableOpacity, Text } from "react-native";
import { Calendar } from "react-native-calendars";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import * as DocumentPicker from "expo-document-picker"; // Import Expo Document Picker

import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";

const RegistrazioneAttivitaScreen = () => {
  const [attivita, setAttivita] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null); // State to hold selected file

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleDateConfirm = (date) => {
    setSelectedDate(date.toISOString().slice(0, 10));
    hideDatePicker();
  };

  const handleSave = () => {
    // Handle saving logic, including the selectedFile
  };

  // Function to handle file selection
  const handleFileSelect = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({});
      if (result.type === "success") {
        setSelectedFile(result);
      }
    } catch (error) {
      console.log("Error selecting file:", error);
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

        {selectedFile && <Text>Selected File: {selectedFile.name}</Text>}
        <TouchableOpacity
          onPress={handleFileSelect}
          style={{
            borderWidth: 1,
            borderColor: "#2E66E7",
            borderRadius: 5,
            padding: 10,
          }}
        >
          <Text>Select File</Text>
        </TouchableOpacity>
      </View>

      <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DemoContainer 
            components={["TimePicker"]}
           
          >
            <TimePicker label="Start time" />
            <TimePicker label="Stop time" style={{ marginRight: 10 }} />
          </DemoContainer>
        </LocalizationProvider>

      <View style={{ marginTop: 20, width: 100 }}>
        <Button title="Salva" onPress={handleSave} />
      </View>
    </View>
  );
};

export default RegistrazioneAttivitaScreen;
