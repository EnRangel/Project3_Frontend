import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Navbar from './components/Navbar'; // Header Navbar
import BottomNavbar from './components/BottomNavbar'; // Bottom Navbar
import Home from './components/Home';
import Login from './components/Login';
import SignUp from './components/SignUp';
import Profile from './components/Profile';
import RecipeForm from './components/RecipeForm';

import Details from './components/Details';
import Feed from './components/Feed';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <View style={styles.container}>
        {/* Header Navbar */}
        {/* <Navbar /> */}

        {/* Stack Navigator */}
        <Stack.Navigator
          initialRouteName="Login"
          // screenOptions={{
          //   headerShown: true, // Disable default header
          // }}
        >
          <Stack.Screen name="Home" component={Home} />
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="SignUp" component={SignUp} />
          <Stack.Screen name="Feed" component={Feed} />
          <Stack.Screen name="Details" component={Details} />
          <Stack.Screen name="Profile" component={Profile} />
          <Stack.Screen name="RecipeForm" component={RecipeForm} />
          
        </Stack.Navigator>

        {/* Bottom Navbar */}
        <BottomNavbar />
      </View>
      <StatusBar style="auto" />
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
