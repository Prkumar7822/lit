import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import Ui from './src/screens/Ui';  // Import your actual Home screen
import ProfileScreen from './src/screens/Profile';
import actual from './src/screens/actual';
import HomeScreen from "./src/screens/Homescreen";
// Define your StackParamList
export type StackParamList = {
  Home: undefined; // Home screen without parameters
  ProfileScreen: undefined; // Profile screen without parameters
};

// Create the stack navigator with the type
const Stack = createStackNavigator<StackParamList>();

function App(): React.JSX.Element {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        {/* Home screen should be the Ui component */}
        <Stack.Screen name="Home" component={actual} options={{ headerShown: false }} />
        <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;


// import React from 'react';
// import { NavigationContainer } from '@react-navigation/native';
// import { createStackNavigator } from '@react-navigation/stack';
// import LoginPage from './src/screens/Login';
// import VerifyOtpPage from './src/screens/verifyOtpPage';

// type RootStackParamList = {
//   LoginPage: undefined;
//   VerifyOtpPage: { mobileNumber: string };
// };
 
// const Stack = createStackNavigator<RootStackParamList>();

// const App = () => {
//   return (
//     <NavigationContainer>
//       <Stack.Navigator initialRouteName="LoginPage">
//         <Stack.Screen name="LoginPage" component={LoginPage} options={{ headerShown: false }} />
//         <Stack.Screen name="VerifyOtpPage" component={VerifyOtpPage} options={{ headerShown: false }} />
//       </Stack.Navigator>
//     </NavigationContainer>
//   );
// };

// export default App;