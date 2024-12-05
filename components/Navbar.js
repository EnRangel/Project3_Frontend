import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Modal from 'react-native-modal';

const Navbar = () => {
  const navigation = useNavigation();
  const [isDropdownVisible, setDropdownVisible] = useState(false);

  const toggleDropdown = () => setDropdownVisible(!isDropdownVisible);

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to log out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          onPress: () => {
            console.log('User logged out');
            toggleDropdown();
            navigation.navigate('Login'); // Navigate to login page
          },
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <View style={styles.navbar}>
      <Text style={styles.title}>MyApp</Text>

      <TouchableOpacity onPress={toggleDropdown}>
        <Text style={styles.menuButton}>Menu ▼</Text>
      </TouchableOpacity>

      <Modal
        isVisible={isDropdownVisible}
        backdropOpacity={0.5}
        onBackdropPress={toggleDropdown}
        animationIn="fadeInDown"
        animationOut="fadeOutUp"
        style={styles.modal}
      >
        <View style={styles.dropdown}>
          <TouchableOpacity
            style={styles.dropdownItemContainer}
            onPress={() => {
              navigation.navigate('Home');
              toggleDropdown();
            }}
          >
            <Text style={styles.dropdownItem}>🏠 Home</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.dropdownItemContainer}
            onPress={() => {
              navigation.navigate('Feed');
              toggleDropdown();
            }}
          >
            <Text style={styles.dropdownItem}>📢 Feed</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.dropdownItemContainer}
            onPress={() => {
              navigation.navigate('Profile');
              toggleDropdown();
            }}
          >
            <Text style={styles.dropdownItem}>👤 Profile</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.dropdownItemContainer}
            onPress={() => {
              navigation.navigate('RecipeForm');
              toggleDropdown();
            }}
          >
            <Text style={styles.dropdownItem}>📖 Add Recipe</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.dropdownItemContainer}
            onPress={handleLogout}
          >
            <Text style={[styles.dropdownItem, styles.logout]}>🚪 Logout</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
};

export default Navbar;

const styles = StyleSheet.create({
  navbar: {
    height: 60,
    backgroundColor: '#1f1f1f',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  title: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  menuButton: {
    color: '#fff',
    fontSize: 16,
  },
  modal: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  dropdown: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    paddingVertical: 15,
    paddingHorizontal: 20,
    position: 'absolute',
    top: 80,
    right: 20,
    width: '80%',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
  },
  dropdownItemContainer: {
    width: '100%',
    marginVertical: 8,
    alignItems: 'flex-start',
  },
  dropdownItem: {
    fontSize: 18,
    color: '#333',
    fontWeight: '600',
    paddingVertical: 5,
  },
  logout: {
    color: 'red',
    fontWeight: '700',
  },
});
