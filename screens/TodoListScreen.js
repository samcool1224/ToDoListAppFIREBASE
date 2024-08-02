import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet, Alert } from 'react-native';
import { auth, db } from '../firebaseConfig'; // Ensure correct path
import { logout } from '../AuthService';
import { collection, query, where, onSnapshot, addDoc, serverTimestamp } from 'firebase/firestore';

const TodoListScreen = ({ navigation }) => {
  const [task, setTask] = useState('');
  const [tasks, setTasks] = useState([]);
  const user = auth.currentUser;

  useEffect(() => {
    if (user) {
      const q = query(collection(db, 'tasks'), where('userId', '==', user.uid));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const newTasks = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setTasks(newTasks);
      });

      return () => unsubscribe();
    }
  }, [user]);

  const handleAddTask = async () => {
    if (task.length > 0) {
      try {
        await addDoc(collection(db, 'tasks'), {
          userId: user.uid,
          task,
          createdAt: serverTimestamp(),
        });
        setTask('');
      } catch (error) {
        Alert.alert('Error', 'Failed to add task. Please try again.');
      }
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigation.navigate('Login');
    } catch (error) {
      Alert.alert('Error', 'Failed to log out. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Todo List</Text>
      <TextInput
        style={styles.input}
        placeholder="New Task"
        value={task}
        onChangeText={setTask}
      />
      <Button title="Add Task" onPress={handleAddTask} />
      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <Text style={styles.task}>{item.task}</Text>}
      />
      <Button title="Logout" onPress={handleLogout} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    fontSize: 24,
    marginBottom: 16,
    textAlign: 'center',
  },
  input: {
    height: 40,
    borderColor: '#ddd',
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 8,
  },
  task: {
    fontSize: 18,
    padding: 8,
  },
});

export default TodoListScreen;
