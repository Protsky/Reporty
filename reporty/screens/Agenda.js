import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Picker,
} from "react-native";

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
    setName(appointment.name);
    setDescription(appointment.description);
    setSelectedTag(appointment.tag);
    setStartDate(appointment.dateTime.toISOString().slice(0, 10));
    setStartTime(appointment.dateTime.toISOString().slice(11, 16));
    setEndTime(appointment.endTime.toISOString().slice(11, 16));
    setEditAppointmentId(id);
  };

  const handleDeleteAppointment = (id) => {
    const updatedAppointments = appointments.filter(
      (appointment) => appointment.id !== id
    );
    setAppointments(updatedAppointments);
  };

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
          <Picker.Item label="Personal" value="Personal" />
          <Picker.Item label="Work" value="Work" />
          <Picker.Item label="Study" value="Study" />
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
              {appointment.dateTime.toLocaleDateString()} -{" "}
              {appointment.dateTime.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}{" "}
              to{" "}
              {appointment.endTime.toLocaleTimeString([], {
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
