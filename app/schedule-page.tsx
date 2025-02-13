import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, Button, ScrollView, Modal, ActivityIndicator } from "react-native";
import { NavigationProp } from '@react-navigation/native';
import { generateSchedule } from './generate';
import { RFPercentage } from 'react-native-responsive-fontsize';

type ScheduleScreenProps = {
  navigation: NavigationProp<any>;
};

const ScheduleScreen = ({ navigation }: ScheduleScreenProps) => {

  const [inputs, setInputs] = useState(['', '', '']);
  const [isLoading, setIsLoading] = useState(false);

  const handleAddInput = () => {
    setInputs([...inputs, '']);
  };

  const handleRemoveEvent = () => {
    setInputs(inputs.slice(0, -1));
  };

  const handleGenerateSchedule = () => {
    setIsLoading(true);
      const changes = "none"
      const response = generateSchedule(inputs, changes).then((response) => {
          navigation.navigate('GeneratedScreen');
          setIsLoading(false)
      }).catch((error) => {
          console.error("Error generating schedule: ", error);
      });
  };

  const handleInputChange = (text: string, index: number) => {
    const newInputs = [...inputs];
    newInputs[index] = text;
    setInputs(newInputs);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Schedule Maker</Text>
      <Text style={styles.subtitle}>Add anything you'd like to incorporate into your schedule 
        and include important information like time and frequency</Text>
      {inputs.map((input, index) => (
        <TextInput
          key={index}
          style={styles.input}
          value={input}
          onChangeText={(text) => handleInputChange(text, index)}
          placeholder={`Input ${index + 1}`}
        />
      ))}
      <View style={styles.buttonRow}>
        <View style={styles.buttonWrap}>
            <Button title="Add Event" onPress={handleAddInput}/>
        </View>

        <View style={styles.buttonWrap}>
            <Button title="Remove Event" onPress={handleRemoveEvent} />
        </View>

        <View style={styles.buttonWrap}>
            <Button title="Generate Schedule" onPress={handleGenerateSchedule} />
        </View>

      </View>
      {isLoading && <Modal
        transparent={true}
        animationType="fade">
        <View style={styles.modalBackground}>
          <View style={styles.modalContent}>
            <Text style={styles.loadingText}>Generating schedule based on your inputs...</Text>
            <ActivityIndicator size="large" color="#0000ff" />
          </View>
        </View>

      </Modal>}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '60%',
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
  },
  loadingText: {
    fontSize: RFPercentage(1.5),
    marginBottom: 20,
  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  buttonWrap: {
    flexGrow: 1,
    padding: 8,
  },
  buttonRow: {
    alignContent: 'center',
    flexDirection: 'row', 
    marginTop: 10, width: '60%',
    flexWrap: 'wrap',
  },
  title: {
    fontSize: RFPercentage(4),
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: RFPercentage(2),
    width: '60%',
    color: "#38434D",
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    width: '60%',
    paddingHorizontal: 10,
  },
});

export default ScheduleScreen;