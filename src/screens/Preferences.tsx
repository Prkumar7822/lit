import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { Option, options, Vector, Check } from "./Options";
import { useNavigation } from '@react-navigation/native'; 
import { RootStackParamList } from "../../util/types";
import { StackNavigationProp } from '@react-navigation/stack';
import generateAnonymousUser from "../../constants/apiConstants/anonymousUserApi";


const { width, height } = Dimensions.get("window");

const Preferences = () => {
  const [selectedZones, setSelectedZones] = useState<string[]>([]);
  const navigation: StackNavigationProp<RootStackParamList> = useNavigation();

  const toggleSelection = (name: string): void => {
    if (selectedZones.includes(name)) {
      setSelectedZones(selectedZones.filter((zone) => zone !== name));
    } else {
      setSelectedZones([...selectedZones, name]);
    }
  };

  const formatData = (dataList: Option[], numberColumns: number) => {
    const totalRows = Math.floor(dataList.length / numberColumns);
    let totalLastRow = dataList.length - totalRows * numberColumns;
    while (totalLastRow > 0 && totalLastRow !== numberColumns) {
      dataList.push({ name: '', icon: null });
      totalLastRow++;
    }
    return dataList;
  };

  const renderItem = ({ item }: { item: Option }) => {
    const isItemInvisible = item.icon === null && item.name === '';

    return (
      <TouchableOpacity
        style={[
          styles.optionContainer,
          selectedZones.includes(item.name) && styles.selectedOption,
          isItemInvisible && styles.itemInvisible,
        ]}
        onPress={() => toggleSelection(item.name)}
        disabled={isItemInvisible}
      >
        {item.icon && <item.icon width={width * 0.25} height={width * 0.25} />}
        <Text style={styles.optionText}>{item.name}</Text>
        {selectedZones.includes(item.name) && (
          <View style={styles.checkmark}>
            <Vector
              width="100%"
              height="100%"
              preserveAspectRatio="xMidYMid slice"
              style={styles.vectorBackground}
            />
            <Check
              width="60%"
              height="60%"
              style={styles.checkForeground}
            />
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Where Do You Want to Chill?</Text>
      <Text style={styles.subHeader}>   Pick at least 3 zones to unlock your vibe!</Text>
      <FlatList
        data={formatData(options, 2)}
        renderItem={renderItem}
        keyExtractor={(item) => item.name}
        numColumns={2}
        contentContainerStyle={styles.grid}
      />
      <TouchableOpacity
        style={[
          styles.button,
          selectedZones.length >= 3 ? styles.buttonActive : styles.buttonDisabled,
        ]}
        disabled={selectedZones.length < 3}
        onPress={() =>generateAnonymousUser("url","deviceId",selectedZones,navigation)}
      >
        <Text style={styles.buttonText}>Let's Chil</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
    padding: width * 0.05,
  },
  header: {
    fontSize: width * 0.06,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: height * 0.01,
  },
  subHeader: {
    fontSize: width * 0.04,
    color: "#bbb",
    marginBottom: height * 0.03,
  },
  grid: {
    justifyContent: "center",
  },
  optionContainer: {
    flex: 1,
    backgroundColor: "#1e1e1e",
    borderRadius: 20,
    margin: width * 0.02,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    height: width * 0.4,
  },
  selectedOption: {
    borderWidth: 2,
    borderColor: "#ff5555",
  },
  optionText: {
    fontSize: width * 0.04,
    color: "#fff",
    textAlign: "center",
    marginTop: height * 0.02,
  },
  button: {
    height: height * 0.06,
    borderRadius: width * 0.1,
    alignItems: "center",
    justifyContent: "center",
    marginTop: height * 0.03,
  },
  buttonActive: {
    backgroundColor: "#ff5555",
  },
  buttonDisabled: {
    backgroundColor: "#444",
  },
  buttonText: {
    color: "#fff",
    fontSize: width * 0.045,
    fontWeight: "bold",
  },
  itemInvisible: {
    backgroundColor: "transparent",
  },
  checkmark: {
    width: width * 0.06,
    height: width * 0.06,
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
    top: width * 0.02,
    right: width * 0.02,
  },
  vectorBackground: {
    position: "absolute",
    top: 0,
    left: 0,
  },
  checkForeground: {
    zIndex: 1,
  },
});

export default Preferences;
