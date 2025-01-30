import React, {useState} from 'react';
import { View, Text, FlatList, StyleSheet, ScrollView, TextInput, Button, TouchableOpacity } from 'react-native';
import dayjs from 'dayjs'; // Install this for date formatting: npm install dayjs
import { RouteProp, useRoute } from '@react-navigation/native';
import { generateSchedule } from './generate';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { RFPercentage, RFValue } from 'react-native-responsive-fontsize';
import { Dimensions } from 'react-native';

type GeneratedScreenProps = {
  navigation: NavigationProp<any>;
};

const { width, height } = Dimensions.get('window');

const GeneratedScreen = ({ navigation }: GeneratedScreenProps) => {
  const route = useRoute<RouteProp<any, 'GeneratedScreen'>>();
  const schedule = route.params;
  if (!schedule) {
    return <Text>Error: No schedule data available.</Text>;
  }
  const scheduleJson = JSON.parse(schedule.scheduleJson.toString().trim());

  // Group items by day of the week
  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const groupedByDay = daysOfWeek.map(day => ({
    day,
    events: scheduleJson.schedule.filter((item: { week_day: string }) => item.week_day === day)
    .sort((a: { start_time: string }, b: { start_time: string }) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime()),
  }));

  const [inputs, setInputs] = useState('');

  const handleInputChange = (text: string) => {
    const newInputs = text
    setInputs(newInputs);
  };

  const handleRegenerateSchedule = () => {
    const oldInput = [schedule.scheduleJson.toString()];
    const response = generateSchedule(oldInput, inputs).then((response) => {
        console.log("gemini returned... " + response);
        navigation.navigate('GeneratedScreen', { navigation, scheduleJson: response });
    }).catch((error) => {
        console.error("Error generating schedule: ", error);
    });
  }

  const [collapsed, setCollapsed] = useState<{ [key: string]: boolean }>({});

  const toggleCollapse = (id: string) => {
    setCollapsed((prev) => ({
      ...prev,
      [id]: !prev[id], // Toggle only the selected text
    }));
  };

  // Render each item
  const renderItem = ({ item }: { item: { id: string; title: string; week_day: string; start_time: string; end_time: string; description: string;} }) => {
    const isCollapsed = collapsed[item.id];

    return (
    <View style={styles.card}>
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.time}>
        {dayjs(item.start_time).format('h:mm A')} - {dayjs(item.end_time).format('h:mm A')}
      </Text>
      {isCollapsed ? (
        <TouchableOpacity onPress={() => toggleCollapse(item.id)}>
          <Text style={styles.description}>+</Text>
        </TouchableOpacity>
      ) : (
        <View>
          <Text style={styles.description}>{item.description}</Text>
          <TouchableOpacity onPress={() => toggleCollapse(item.id)}>
            <Text style={styles.description}>-</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
    );
  };

  return (
    <ScrollView horizontal contentContainerStyle={styles.rootContainer}>
      <View style={styles.weekContainer}>
      {groupedByDay.map(day => (
        <View key={day.day} style={styles.dayContainer}>
          <Text style={styles.dayTitle}>{day.day}</Text>
          <FlatList
            data={day.events}
            renderItem={renderItem}
            keyExtractor={(event) => event.id}
            contentContainerStyle={styles.container}
          />
        </View>
      ))}
      </View>

      <View style={styles.inputRow}>
        <View style={styles.buttonWrap}>
          <Button title="Regenerate" onPress={() => handleRegenerateSchedule()} />
        </View>
        <TextInput
                  style={styles.input}
                  value={inputs}
                  onChangeText={(text) => handleInputChange(text)}
                  placeholder={`Insert any changes and regenerate'`}
        />
      </View>
    </ScrollView>
    
  );
}

const styles = StyleSheet.create({
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
      flexGrow: 1,
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
    }});

    export default GeneratedScreen;