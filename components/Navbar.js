// components/Navbar.js
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Modal from 'react-native-modal';

const Navbar = () => {
  const navigation = useNavigation();
  const [isDropdownVisible, setDropdownVisible] = useState(false);

  const toggleDropdown = () => setDropdownVisible(!isDropdownVisible);

  return (
    <View style={styles.navbar}>
      <Text style={styles.title}>MyApp</Text>

      {/* Menu button to toggle dropdown */}
      <TouchableOpacity onPress={toggleDropdown}>
        <Text style={styles.menuButton}>Menu ▼</Text>
      </TouchableOpacity>

      {/* Full Dropdown Modal */}
      <Modal
        isVisible={isDropdownVisible}
        backdropOpacity={0.3}
        onBackdropPress={toggleDropdown}
        style={styles.modal}
      >
        <View style={styles.dropdown}>
          <TouchableOpacity onPress={() => { navigation.navigate('Home'); toggleDropdown(); }}>
            <Text style={styles.dropdownItem}>Home</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => { navigation.navigate('Login'); toggleDropdown(); }}>
            <Text style={styles.dropdownItem}>Login</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => { navigation.navigate('Profile'); toggleDropdown(); }}>
            <Text style={styles.dropdownItem}>Profile</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => { navigation.navigate('RecipeForm'); toggleDropdown(); }}>
            <Text style={styles.dropdownItem}>Add Recipe</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => { navigation.navigate('RecipeList'); toggleDropdown(); }}>
            <Text style={styles.dropdownItem}>Recipe List</Text>
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
    backgroundColor: '#333',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
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
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 10,
    paddingBottom: 20,
    alignItems: 'flex-start',
    position: 'absolute',
    top: 60,
    right: 20,
    width: 150,
  },
  dropdownItem: {
    paddingVertical: 10,
    fontSize: 16,
    color: '#333',
  },
});
