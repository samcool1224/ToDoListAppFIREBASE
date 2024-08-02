import { auth } from './firebaseConfig'; // Import the initialized auth instance
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, updateProfile } from 'firebase/auth';

export const signUp = async (email, password, name) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    await updateProfile(user, { displayName: name });
    console.log('User signed up and profile updated.');
  } catch (error) {
    console.error('Error signing up:', error);
  }
};

export const login = async (email, password) => {
  try {
    await signInWithEmailAndPassword(auth, email, password);
    console.log('User logged in.');
  } catch (error) {
    console.error('Error logging in:', error);
  }
};

export const logout = async () => {
  try {
    await signOut(auth);
    console.log('User logged out.');
  } catch (error) {
    console.error('Error logging out:', error);
  }
};
