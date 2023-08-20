import React, { useState } from "react";
import firebase from "firebase/compat/app";
import { useEffect } from "react";

import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Picker,
} from "react-native";

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

const AgendaScreen = () => {
  const [appointments, setAppointments] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedTag, setSelectedTag] = useState("");
  const [startDate, setStartDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [editAppointmentId, setEditAppointmentId] = useState(null);

  const handleSaveAppointment = () => {
    if (editAppointmentId !== null) {
      // Edit existing appointment
      const updatedAppointments = appointments.map((appointment) =>
        appointment.id === editAppointmentId
          ? {
              ...appointment,
              name,
              description,
              tag: selectedTag,
              dateTime: new Date(startDate + " " + startTime),
              endTime: new Date(startDate + " " + endTime),
            }
          : appointment
      );
      setAppointments(updatedAppointments);
      setEditAppointmentId(null);
    } else {
      // Add new appointment
      const newAppointment = {
        id: appointments.length + 1,
        name,
        description,
        tag: selectedTag,
        dateTime: new Date(startDate + " " + startTime),
        endTime: new Date(startDate + " " + endTime),
      };
      setAppointments([...appointments, newAppointment]);
    }

    const appointmentData = {
      name,
      description,
      tag: selectedTag,
      dateTime: new Date(startDate + " " + startTime).toISOString(),
      endTime: new Date(startDate + " " + endTime).toISOString(),
    };

    if (editAppointmentId !== null) {
      // Editing existing appointment
      database.ref(`appointments/${editAppointmentId}`).set(appointmentData);
    } else {
      // Adding new appointment
      database.ref("appointments").push(appointmentData);
    }

    // Clear input fields
    setName("");
    setDescription("");
    setSelectedTag("");
    setStartDate("");
    setStartTime("");
    setEndTime("");
  };

  const handleEditAppointment = (id) => {
    const appointment = appointments.find(
      (appointment) => appointment.id === id
    );
  
    if (appointment) {
      setName(appointment.name);
      setDescription(appointment.description);
      setSelectedTag(appointment.tag);
  
      // Convert appointment.dateTime and appointment.endTime to Date objects
      const startDateTime = new Date(appointment.dateTime);
      const endDateTime = new Date(appointment.endTime);
  
      setStartDate(startDateTime.toISOString().slice(0, 10));
      setStartTime(startDateTime.toISOString().slice(11, 16));
      setEndTime(endDateTime.toISOString().slice(11, 16));
      setEditAppointmentId(id);
    }
  };
  
  
  

  const handleDeleteAppointment = (id) => {
    // Remove from local state
    const updatedAppointments = appointments.filter(
      (appointment) => appointment.id !== id
    );
    setAppointments(updatedAppointments);
  
    // Remove from Firebase database
    database.ref(`appointments/${id}`).remove();
  };
  

  useEffect(() => {
    // This function will run when the component mounts
    const appointmentsRef = database.ref("appointments");

    // Set up a listener for changes in the appointments data
    const appointmentsListener = appointmentsRef.on("value", (snapshot) => {
      const appointmentsData = snapshot.val();
      if (appointmentsData) {
        const appointmentsArray = Object.keys(appointmentsData).map((key) => ({
          id: key,
          ...appointmentsData[key],
        }));
        setAppointments(appointmentsArray);
      }
    });

    // Return a cleanup function to remove the listener when the component unmounts
    return () => {
      appointmentsRef.off("value", appointmentsListener);
    };
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.appointmentForm}>
        <TextInput
          style={styles.input}
          placeholder="Name"
          value={name}
          onChangeText={setName}
        />
        <TextInput
          style={styles.input}
          placeholder="Description"
          value={description}
          onChangeText={setDescription}
        />
        <Picker
          style={styles.picker}
          selectedValue={selectedTag}
          onValueChange={(itemValue) => setSelectedTag(itemValue)}
        >
          <Picker.Item label="Select Tag" value="" />
          <Picker.Item label="Personale" value="Personale" />
          <Picker.Item label="Esame" value="Esame" />
          <Picker.Item label="Appuntamento" value="Appuntamento" />
          {/* Add more tags here */}
        </Picker>
        <TextInput
          style={styles.input}
          placeholder="Start Date (YYYY-MM-DD)"
          value={startDate}
          onChangeText={setStartDate}
        />
        <TextInput
          style={styles.input}
          placeholder="Start Time (HH:mm)"
          value={startTime}
          onChangeText={setStartTime}
        />
        <TextInput
          style={styles.input}
          placeholder="End Time (HH:mm)"
          value={endTime}
          onChangeText={setEndTime}
        />
        <TouchableOpacity
          style={styles.saveButton}
          onPress={handleSaveAppointment}
        >
          <Text style={styles.saveButtonText}>Save Appointment</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.timelineContainer}>
        {appointments.map((appointment) => (
          <View key={appointment.id} style={styles.appointmentItem}>
            <View style={styles.appointmentInfo}>
              <Text style={styles.appointmentName}>{appointment.name}</Text>
              <Text style={styles.appointmentDescription}>
                {appointment.description}
              </Text>
              <Text style={styles.appointmentTag}>Tag: {appointment.tag}</Text>
            </View>
            <Text style={styles.appointmentDateTime}>
              {new Date(appointment.dateTime).toLocaleDateString()} -{" "}
              {new Date(appointment.dateTime).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}{" "}
              to{" "}
              {new Date(appointment.endTime).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </Text>
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => handleEditAppointment(appointment.id)}
            >
              <Text style={styles.editButtonText}>Edit</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => handleDeleteAppointment(appointment.id)}
            >
              <Text style={styles.deleteButtonText}>Delete</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  appointmentForm: {
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
    padding: 10,
    marginBottom: 10,
  },
  saveButton: {
    backgroundColor: "#1976d2",
    padding: 10,
    borderRadius: 4,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "flex-end",
    marginTop: 10,
  },
  saveButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  timelineContainer: {
    borderTopWidth: 1,
    borderTopColor: "#ccc",
    paddingTop: 20,
  },
  appointmentItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
    padding: 10,
    borderRadius: 4,
    backgroundColor: "#f5f5f5",
  },
  appointmentInfo: {
    flex: 1,
  },
  appointmentName: {
    fontWeight: "bold",
    fontSize: 16,
  },
  appointmentDescription: {
    color: "#888",
  },
  appointmentTag: {
    color: "#888",
  },
  appointmentDateTime: {
    color: "#888",
    marginRight: 10,
  },
  editButton: {
    backgroundColor: "#3498DB",
    padding: 5,
    borderRadius: 4,
    alignItems: "center",
    justifyContent: "center",
  },
  editButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  deleteButton: {
    backgroundColor: "#E74C3C",
    padding: 5,
    borderRadius: 4,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 10,
  },
  deleteButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  picker: {
    backgroundColor: "#1976d2",
    borderRadius: 4,
    padding: 10,
    marginBottom: 10,
    color: "white",
  },
});

export default AgendaScreen;
