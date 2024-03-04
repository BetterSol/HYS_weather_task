import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, TextInput, Button, TouchableOpacity, FlatList, Switch } from 'react-native';

const API_KEY = 'de45b08dad3d48434689160f2237a99e';

export default function WeatherApp() {
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState(null);
  // const [forecast, setForecast] = useState([]);
  const [enteredCities, setEnteredCities] = useState([]);
  const [units, setUnits] = useState('metric');

  useEffect(() => {
    if (city) {
      fetchWeatherData()
    }
  }, [units]);

  const fetchWeatherData = async () => {
    try {
      const response = await fetch(
        `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=${units}&APPID=${API_KEY}`
      );
      const data = await response.json();
      setWeather(data);

      if (!enteredCities.includes(city)) {
        setEnteredCities([...enteredCities, city]);
      }

    } catch (error) {
      console.error('error', error);
    }
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => setCity(item)}>
      <Text style={styles.item}>{item}</Text>
    </TouchableOpacity>
  )

  // const fetchWeatherForecast = async () => {
  //   try {
  //     const response = await fetch(
  //       `http://api.openweathermap.org/data/2.5/forecast?q=${city}&units=${units}&APPID=${API_KEY}`
  //     );

  //     const data = await response.json();
  //     setForecast(data.list);
  //   } catch (error) {
  //     console.error('error', error);
  //   }
  // }

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.inputContainer}
        placeholder="Enter your city"
        value={city}
        onChangeText={city => setCity(city)}
      />

      <Button
        title="Get Weather in the City"
        onPress={
          fetchWeatherData
        }
      />

      {weather && (
        <View style={styles.weatherContainer}>

          <View style={styles.switchContainer}>
            <Text>C</Text>
            <Switch
              value={units === 'imperial'}
              onValueChange={() => setUnits(units === 'metric' ? 'imperial' : 'metric')}
            />
            <Text>F</Text>
          </View>
          
          <Text>City: {weather.name}</Text>
          <Text>Temperature: {weather.main.temp}°{units === 'metric' ? 'C' : 'F'}</Text>
          <Text>Weather: {weather.weather[0].description}</Text>
          <Text>Humidity: {weather.main.humidity}%</Text>
        </View>
      )}
      <FlatList
        data={enteredCities}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    top: 200,
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
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    gap: 10,
  },
  item: {
    padding: 10,
    fontSize: 10,
  }
});
