import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Navbar from './components/Navbar';
import Home from './components/Home';
import Login from './components/Login';
import SignUp from './components/SignUp';
import Profile from './components/Profile';
import RecipeForm from './components/RecipeForm';
import RecipeList from './components/RecipeList';
import Details from './components/Details';
import Feed from './components/Feed';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{
          header: () => <Navbar />, // Custom Navbar for each screen
        }}
      >
        <Stack.Screen name="Home" component={Home} options={{ title: 'Home' }} />
        <Stack.Screen name="Login" component={Login} options={{ title: 'Login' }} />
        <Stack.Screen name="SignUp" component={SignUp} options={{ title: 'SignUp' }} />
        <Stack.Screen name="Feed" component={Feed} options={{ title: 'Feed' }} />
        <Stack.Screen name="Details" component={Details} options={{ title: 'Recipe Details' }} />

        <Stack.Screen name="Profile" component={Profile} options={{ title: 'Profile' }} />
        <Stack.Screen name="RecipeForm" component={RecipeForm} options={{ title: 'Add Recipe' }} />
        <Stack.Screen name="RecipeList" component={RecipeList} options={{ title: 'List Recipes' }} />
      </Stack.Navigator>
      <StatusBar style="auto" />
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
