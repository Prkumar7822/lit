import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

const ProfileScreen = () => {
    const handleRateApp = () => {
        console.log("Rate App clicked");
        // Implement rate app functionality
    };

    const handleShareApp = () => {
        console.log("Share App clicked");
        // Implement share app functionality
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>User Profile</Text>
            <Text style={styles.subtitle}>Features</Text>
            <TouchableOpacity style={styles.button} onPress={handleRateApp}>
                <Text style={styles.buttonText}>Rate App</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={handleShareApp}>
                <Text style={styles.buttonText}>Share App</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white",
        padding: 16,
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 16,
        color: "black",
    },
    subtitle: {
        fontSize: 18,
        fontWeight: "600",
        marginBottom: 12,
        color: "black",
    },
    button: {
        backgroundColor: "#007bff",
        padding: 12,
        borderRadius: 8,
        marginVertical: 8,
    },
    buttonText: {
        color: "white",
        fontSize: 16,
        fontWeight: "bold",
        textAlign: "center",
    },
});

export default ProfileScreen;
