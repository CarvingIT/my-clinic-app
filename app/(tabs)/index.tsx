import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import * as SecureStore from 'expo-secure-store';
import { fetch } from 'expo/fetch';
import { useRouter } from 'expo-router';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    console.log('Email:', email, 'Password:', password);
    // Here, you would typically handle authentication logic
    const response = await fetch(process.env.EXPO_PUBLIC_API_BASE + '/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

    if (response.ok) {
      const json = await response.json();
      console.log(json.status);
      if(json.status == 1 && json.token){
        const token = json.token; 
        console.log(token);
        // Store the token
        try{
            await SecureStore.setItemAsync('token', token);
        } catch (error: any){
            console.error("An error occurred:", error.message);
        }
        finally{
            //Navigate to the authenticated screen or perform other actions
            const router = useRouter();
            router.push('/users/dashboard');
        }
      }
      else{
        console.error('Login failed:', response.status);
      }
    } else {
      // Handle errors (e.g., display an error message)
      console.error('Login failed:', response.status);
    }
  };

  return (
    <View style={styles.container}>
      <ThemedText style={styles.title}>Login</ThemedText>
      <TextInput
        style={styles.input}
        placeholder="Email"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <Button title="Login" onPress={handleLogin} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    backgroundColor:'#eee',
  },
});

export default LoginForm;
