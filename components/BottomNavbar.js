import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Modal from 'react-native-modal';

const BottomNavbar = () => {
  const navigation = useNavigation();
  const [isMenuVisible, setMenuVisible] = useState(false);

  const toggleMenu = () => setMenuVisible(!isMenuVisible);

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
            toggleMenu();
            navigation.navigate('Login'); // Navigate to login page
          },
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <View style={styles.navbar}>
      <TouchableOpacity
        style={styles.navButton}
        onPress={() => navigation.navigate('Home')}
      >
        <Text style={styles.navButtonText}>🏠 Home</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.navButton}
        onPress={() => navigation.navigate('Feed')}
      >
        <Text style={styles.navButtonText}>📢 Feed</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.navButton}
        onPress={toggleMenu}
      >
        <Text style={styles.navButtonText}> ☰ Menu</Text>
      </TouchableOpacity>

      <Modal
        isVisible={isMenuVisible}
        backdropOpacity={0.5}
        onBackdropPress={toggleMenu}
        style={styles.modal}
      >
        <View style={styles.menu}>
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => {
              navigation.navigate('Profile');
              toggleMenu();
            }}
          >
            <Text style={styles.menuItemText}>👤 Profile</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => {
              navigation.navigate('RecipeForm');
              toggleMenu();
            }}
          >
            <Text style={styles.menuItemText}>📖 Add Recipe</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={handleLogout}
          >
            <Text style={[styles.menuItemText, styles.logout]}>🚪 Logout</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
};

export default BottomNavbar;

const styles = StyleSheet.create({
  navbar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: 60,
    backgroundColor: '#1f1f1f',
    borderTopWidth: 1,
    borderTopColor: '#333',
  },
  navButton: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  navButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  modal: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  menu: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingVertical: 20,
    paddingHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 10,
  },
  menuItem: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  menuItemText: {
    fontSize: 18,
    color: '#333',
    fontWeight: '600',
  },
  logout: {
    color: 'red',
    fontWeight: '700',
  },
});
