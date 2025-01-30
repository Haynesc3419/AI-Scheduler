import { StyleSheet, Text, View, Button } from "react-native";
import { NavigationProp } from '@react-navigation/native';
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";

type HomeScreenProps = {
  navigation: NavigationProp<any>;
};

const HomeScreen = ({ navigation }: HomeScreenProps) => {
    return (
        <View style={styles.container}>
            <View style={styles.main}>
                <Text style={styles.title}>ScheduleAssistant</Text>
                <Button 
                    title="Get Scheduling"
                    onPress={() => navigation.navigate('ScheduleScreen', { navigation })}/>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: "center",
      padding: 24,
    },
    buttonHeader: {
      flex: 1,
    },
    main: {
      flex: 1,
      justifyContent: "center",
      maxWidth: 960,
      marginHorizontal: "auto",
    },
    title: {
      fontSize: RFPercentage(5),
      fontWeight: "bold",
    },
    subtitle: {
      fontSize: 36,
      color: "#38434D",
    },
  });

  export default HomeScreen;