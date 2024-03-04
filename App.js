import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, Button, View } from 'react-native';

const API_KEY = 'de45b08dad3d48434689160f2237a99e';

export default function WeatherApp() {
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState(null);
  
  const fetchWeatherData = async() => {
    try {
      const response = await fetch (
        `http://api.openweathermap.org/data/2.5/weather?q=${city}&APPID=${API_KEY}`
      );
      const data = await response.json();
      setWeather(data);
    } catch (error) {
      console.error('error', error);
    }
  }
  return (
    <View style={styles.container}>
      <TextInput
        style={styles.inputContainer}
        placeholder="Enter your city"
        value={city}
        onChangeText={city => setCity(city)}
      />
      <Button 
        title="Get Weather in My City"
        onPress={fetchWeatherData}
      />
      {weather && (
        <View style={styles.weatherContainer}> 
          <Text>City: {weather.name}</Text>
          <Text>Temperature: {weather.main.temp}°C</Text>
          <Text>Weather: {weather.description}</Text>
          <Text>Humidity: {weather.main.humidity}%</Text>
        </View>
      )}
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    width: '60%',
  },
  weatherContainer: {
    marginTop: 10,
    padding: 10,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: '#ccc',
  },
});
