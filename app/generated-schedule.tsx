import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Modal, ScrollView, TextInput, Alert, ActivityIndicator, Button, TouchableOpacity } from 'react-native';
import { generateSchedule } from './generate';
import { NavigationProp } from '@react-navigation/native';
import { RFPercentage } from 'react-native-responsive-fontsize';
import { Dimensions } from 'react-native';
import { IoIosAddCircleOutline, IoIosRemoveCircleOutline, IoMdColorFill, IoIosTrash, IoIosBuild } from "react-icons/io";
import { checkTimeValid, compareTime, militaryToStandard } from './time-utils';
import { Picker } from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';

type GeneratedScreenProps = {
  navigation: NavigationProp<any>;
};

const { width, height } = Dimensions.get('window');

const GeneratedScreen = ({ navigation }: GeneratedScreenProps) => {
  const [showDetails, setShowDetails] = useState(false);
  const [showEditEventModal, setShowEditEventModal] = useState(false);
  const [focusedEvent, setFocusedEvent] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [schedule, setSchedule] = useState<any>(null);
  const [inputs, setInputs] = useState('');
  const [jsonError, setJsonError] = useState(false);
  const [collapsed, setCollapsed] = useState<{ [key: string]: boolean }>({});
  const [colors, setColor] = useState<{ [key: string]: number }>({});
  const colorWheel = ['#fdb1a1', '#fde0a1', '#f5fda1', '#bdfda1', '#a1fdcc', '#a1defd', '#b3a1fd', '#fda1f9'];

  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        const jsonValue = await AsyncStorage.getItem('schedule');
        if (jsonValue) {
          setSchedule(JSON.parse(jsonValue));
        } else {
          setSchedule({ schedule: [] });
        }
      } catch (error) {
        console.error('Error retrieving schedule:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchSchedule();
  }, []);

  if (!schedule) {
    return <Text>Error: No schedule data available.</Text>;
  }

  const scheduleJson = schedule;
  const focusedStartTime = scheduleJson.schedule.find((event: any) => event.id === focusedEvent)?.start_time;
  const focusedEndTime = scheduleJson.schedule.find((event: any) => event.id === focusedEvent)?.end_time;

  // Group items by day of the week
  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const groupedByDay = daysOfWeek.map(day => ({
    day,
    events: scheduleJson.schedule.filter((item: { week_day: string }) => item.week_day === day)
      .sort((a: { start_time: string }, b: { start_time: string }) => compareTime(a.start_time, b.start_time)),
  }));

  const handleInputChange = (text: string) => {
    setInputs(text);
  };

  const saveEvent = (newEvent: any) => {
    const updatedSchedule = scheduleJson.schedule.map((event: any) =>
      event.id === newEvent.id ? newEvent : event
    );
    setSchedule({ schedule: updatedSchedule });
    AsyncStorage.setItem('schedule', JSON.stringify({ schedule: updatedSchedule }));
  };

  const deleteEvent = (id: string) => {
    const updatedSchedule = scheduleJson.schedule.filter((event: any) => event.id !== id);
    setSchedule({ schedule: updatedSchedule });
    AsyncStorage.setItem('schedule', JSON.stringify({ schedule: updatedSchedule }));
  };

  const handleRegenerateSchedule = () => {
    setIsLoading(true);
    const oldInput = [JSON.stringify(scheduleJson)];
    generateSchedule(oldInput, inputs).then((response) => {
      setSchedule(JSON.parse(response.toString()));
      setIsLoading(false);
    }).catch((error) => {
      console.error("Error generating schedule: ", error);
      setIsLoading(false);
    });
  };

  const handleSave = () => {
    try {
      JSON.parse(inputs);
      setSchedule(JSON.parse(inputs));
      setJsonError(false);
    } catch (e) {
      setJsonError(true);
    }
  };

  const toggleCollapse = (id: string) => {
    setCollapsed((prev) => ({
      ...prev,
      [id]: !prev[id], // Toggle only the selected text
    }));
  };

  // check if time edits are valid
  const timeInputValid = (time1: string, time2: string): boolean => {
    return (
      // check if times are actual times
      checkTimeValid(time1) &&
      checkTimeValid(time2) &&
      // check if time2 > time1
      compareTime(time1, time2) < 0
    );
  };

  // validate form fields
  const saveIsDisabled = (time1: string, time2: string): boolean => {
    return !timeInputValid(time1, time2);
  };

  // Render each item
  const renderItem = ({ item }: { item: { id: string; title: string; week_day: string; start_time: string; end_time: string; description: string; } }) => {
    const isCollapsed = collapsed[item.id];

    return (
      <View style={[styles.card, { backgroundColor: colorWheel[colors[item.id] % colorWheel.length] }]}>
        <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-end' }}>
          <View style={{ justifyContent: 'flex-start' }}>
            {item.description == '' ? '' :
              <TouchableOpacity onPress={() => toggleCollapse(item.id)}>
                {isCollapsed ? <IoIosAddCircleOutline /> : <IoIosRemoveCircleOutline />}
              </TouchableOpacity>
            }
          </View>
          <View>
            <TouchableOpacity onPress={() => setColor((prev) => ({ ...prev, [item.id]: (prev[item.id] ? prev[item.id] : 0) + 1 }))}>
              <IoMdColorFill />
            </TouchableOpacity>
          </View>

          <View>
            <TouchableOpacity onPress={() => { setFocusedEvent(item.id); setShowEditEventModal(true) }}>
              <IoIosBuild />
            </TouchableOpacity>
          </View>

          <View>
            <TouchableOpacity onPress={() => deleteEvent(item.id)}>
              <IoIosTrash />
            </TouchableOpacity>
          </View>
        </View>
        <View style={[styles.title, { display: 'flex', flexDirection: 'row', flex: 2 }]}>
          <Text style={[{ flexGrow: 5, flex: 1, flexShrink: 1 }, styles.title]}>
            {item.title}
          </Text>
        </View>
        <Text style={styles.time}>
          {militaryToStandard(item.start_time)} - {militaryToStandard(item.end_time)}
        </Text>

        {isCollapsed ? <View></View> : <Text style={styles.description}>{item.description}</Text>}
      </View>
    );
  };

  return (
    <View style={[styles.rootContainer, { display: 'flex', }]}>
      <View style={[styles.weekContainer, { height: height - 130, flexGrow: 9, }]}>
        {groupedByDay.map(day => (
          <View key={day.day} style={[styles.dayContainer]}>
            <Text style={styles.dayTitle}>{day.day}</Text>
            <ScrollView>
              <FlatList
                data={day.events}
                renderItem={renderItem}
                keyExtractor={(event) => event.id}
                contentContainerStyle={styles.container}
              />
            </ScrollView>
          </View>
        ))}
      </View>

      <View style={[{}]}>
        <View style={styles.inputRow}>
          {isLoading && <ActivityIndicator size="large" color="#0000ff" />}
          <View style={styles.buttonWrap}>
            <Button title="Regenerate" onPress={handleRegenerateSchedule} />
          </View>
          <View style={styles.buttonWrap}>
            <Button title="Details" onPress={() => setShowDetails(true)} />
          </View>
          <TextInput
            style={[styles.input]}
            value={inputs}
            onChangeText={handleInputChange}
            placeholder={`Insert any changes and regenerate`}
          />
        </View>
        <Modal visible={showDetails} transparent={true} animationType="fade">
          <View style={styles.modalContainer}>
            <Text style={styles.title}>Edit Schedule JSON</Text>
            <TextInput
              style={[styles.input, { justifyContent: 'center', alignItems: 'center', width: '60%', height: '60%' }]}
              multiline
              numberOfLines={10}
              onChangeText={(text) => setInputs(text)}
              value={inputs}
            />
            <Text style={{ color: 'red' }}>{jsonError && 'Invalid JSON format. Please correct it and try again.'}</Text>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <View style={styles.buttonWrap}>
                <Button title="Save" onPress={handleSave} />
              </View>

              <View style={styles.buttonWrap}>
                <Button title="Close" onPress={() => setShowDetails(false)} />
              </View>

            </View>
          </View>
        </Modal>

        <Modal visible={showEditEventModal} transparent={true} animationType="fade">
          <View style={styles.modalContainer}>
            <View style={{ width: '80%', padding: 20 }}>
              <Text style={styles.title}>Edit Event</Text>
              <TextInput
                style={styles.input}
                placeholder="Title"
                value={scheduleJson.schedule.find((event: any) => event.id === focusedEvent)?.title || ''}
                onChangeText={(text) => {
                  const updatedEvent = { ...scheduleJson.schedule.find((event: any) => event.id === focusedEvent), title: text };
                  saveEvent(updatedEvent);
                }}
              />
              <TextInput
                style={styles.input}
                placeholder="Description"
                value={scheduleJson.schedule.find((event: any) => event.id === focusedEvent)?.description || ''}
                onChangeText={(text) => {
                  const updatedEvent = { ...scheduleJson.schedule.find((event: any) => event.id === focusedEvent), description: text };
                  saveEvent(updatedEvent);
                }}
              />
              <Picker
                style={styles.picker}
                selectedValue={scheduleJson.schedule.find((event: any) => event.id === focusedEvent)?.week_day || ''}
                onValueChange={(value) => {
                  const updatedEvent = { ...scheduleJson.schedule.find((event: any) => event.id === focusedEvent), week_day: value };
                  saveEvent(updatedEvent);
                }}>
                {daysOfWeek.map(day => (
                  <Picker.Item key={day} label={day} value={day}></Picker.Item>
                ))}
              </Picker>
              <TextInput
                style={styles.input}
                placeholder="Start Time"
                value={scheduleJson.schedule.find((event: any) => event.id === focusedEvent)?.start_time || ''}
                onChangeText={(text) => {
                  const updatedEvent = { ...scheduleJson.schedule.find((event: any) => event.id === focusedEvent), start_time: text };
                  saveEvent(updatedEvent);
                }}
              />
              <TextInput
                style={styles.input}
                placeholder="End Time"
                value={scheduleJson.schedule.find((event: any) => event.id === focusedEvent)?.end_time || ''}
                onChangeText={(text) => {
                  const updatedEvent = { ...scheduleJson.schedule.find((event: any) => event.id === focusedEvent), end_time: text };
                  saveEvent(updatedEvent);
                }}
              />

              <Text style={{ color: 'red' }}>{!timeInputValid(focusedStartTime, focusedEndTime) && 'Time inputs invalid, please verify'}</Text>
              <View style={{ flexDirection: 'row', justifyContent: 'flex-start' }}>
                <View style={styles.buttonWrap}>
                  <Button
                    title="Save"
                    onPress={() => setShowEditEventModal(false)}
                    disabled={saveIsDisabled(
                      focusedStartTime,
                      focusedEndTime)}
                  />
                </View>
                <View style={styles.buttonWrap}>
                  <Button title="Cancel" onPress={() => setShowEditEventModal(false)} />
                </View>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    margin: 'auto',
    justifyContent: 'center',
    alignItems: 'center',
    width: '80%',
    height: '80%',
    backgroundColor: 'white',
    borderRadius: 10,
    borderColor: 'black',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 10,
    position: 'absolute',
    top: '10%',
    left: '10%',
  },
  picker: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    width: '60%',
    paddingHorizontal: 10,
  },
  rootContainer: {
    flexDirection: 'column',
    width: '100%',
  },
  buttonWrap: {
    padding: 5
  },
  inputRow: {
    flexDirection: 'row',
    padding: 10,
  },
  container: {
    padding: 10,
    backgroundColor: '#f5f5f5',
  },
  card: {
    backgroundColor: '#ffffff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    width: '60%',
    paddingHorizontal: 10,
  },
  dayTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  weekContainer: {
    flexDirection: 'row',
    padding: 10,
    backgroundColor: '#f5f5f5',
    flexGrow: 9,
  },
  dayContainer: {
    flex: 1,
    marginHorizontal: 5,
  },
  title: {
    fontSize: RFPercentage(1.5),
    fontWeight: 'bold',
    marginBottom: 5,
  },
  time: {
    fontSize: RFPercentage(1),
    color: '#555',
    marginBottom: 5,
  },
  description: {
    fontSize: RFPercentage(1),
    color: '#333',
    marginBottom: 5,
  },
  location: {
    fontSize: 14,
  }
});

export default GeneratedScreen;