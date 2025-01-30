import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, Button, ScrollView } from "react-native";
import { GoogleGenerativeAI } from '@google/generative-ai';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { generateSchedule } from './generate';
import { RFPercentage } from 'react-native-responsive-fontsize';

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