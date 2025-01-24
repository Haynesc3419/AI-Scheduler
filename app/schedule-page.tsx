import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, Button, ScrollView } from "react-native";
import { GoogleGenerativeAI } from '@google/generative-ai';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { generateSchedule } from './generate';

type ScheduleScreenProps = {
  navigation: NavigationProp<any>;
};

const ScheduleScreen = ({ navigation }: ScheduleScreenProps) => {

  const [inputs, setInputs] = useState(['', '', '']);

  const handleAddInput = () => {
    setInputs([...inputs, '']);
  };

  const handleRemoveEvent = () => {
    setInputs(inputs.slice(0, -1));
    console.log("current inputs: " + inputs)
  };

  const handleGenerateSchedule = () => {
      const changes = "none"
      const response = generateSchedule(inputs, changes).then((response) => {
          console.log("gemini returned... " + response);
          navigation.navigate('GeneratedScreen', { navigation, scheduleJson: response });
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
      <Text style={styles.subtitle}>For each entry, add a recurring 
        event that you would like fit into your schedule. Indicate any preferences you have
        in regards to time, day of the week, and frequency. Also indicate whether there
        are any logistical details that are non-negotiable (class on monday 2-3pm) </Text>
      {inputs.map((input, index) => (
        <TextInput
          key={index}
          style={styles.input}
          value={input}
          onChangeText={(text) => handleInputChange(text, index)}
          placeholder={`Input ${index + 1}`}
        />
      ))}
      <View style={{ flexDirection: 'row', marginTop: 10 }}>
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
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  buttonWrap: {
    padding: 5
  },
  buttonRow: {
    padding:10,
    flexDirection: 'row', 
    marginTop: 10
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: 18,
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