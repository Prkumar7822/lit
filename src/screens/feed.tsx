import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { getToken } from "../../util/auth";

const Feed = () => {
  // State to store the token
  const [token, setToken] = useState<string | null>(null);

  // UseEffect to fetch token on component mount
  useEffect(() => {
    const fetchToken = async () => {
      const storedToken = await getToken(); // Fetch token from AsyncStorage
      setToken(storedToken); // Update state with the token
    };
    
    fetchToken(); // Call the function to fetch the token
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Welcome to the Feed Screen!</Text>
      {/* Display token */}
      <Text style={styles.text}>{token ? token : "Token not found"}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#121212",
  },
  text: {
    color: "#fff",
    fontSize: 18,
    marginBottom: 10,
  },
});

export default Feed;
