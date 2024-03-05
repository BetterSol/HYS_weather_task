import React, { useEffect, useState } from 'react';
import { 
  View, 
  StyleSheet, 
  Text, 
  TextInput, 
  FlatList, 
  Switch, 
  ImageBackground,
  TouchableOpacity,
} from 'react-native';

const API_KEY = 'a7d88b73aded8bb39c3d3c12f382758c';
const backgroundImage = {url: 'https://images.unsplash.com/photo-1530908295418-a12e326966ba?q=80&w=2187&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'};

// const STYLES = ['default', 'dark-content', 'light-content'];
// const TRANSITIONS = ['fade', 'slide', 'none'];

export default function WeatherApp() {
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  // const [enteredCities, setEnteredCities] = useState([]);
  const [units, setUnits] = useState('metric');

  useEffect(() => {
    if (city) {
      if (weather !== null) {
        fetchWeatherData();
      }
      if (forecast.length > 1) {
        fetchWeatherForecast();
      }
    }
  }, [units]);

  const fetchWeatherData = async () => {
    try {
      const response = await fetch(
        `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=${units}&APPID=${API_KEY}`
      );
      const data = await response.json();
      setWeather(data);

    } catch (error) {
      console.error('error', error);
    }
  };

  const fetchWeatherForecast = async () => {
    try {
      const response = await fetch(
        `http://api.openweathermap.org/data/2.5/forecast?q=${city}&units=${units}&APPID=${API_KEY}`
        );
        
        const data = await response.json();
        setForecast(data.list);
        console.log(forecast);

      } catch (error) {
        console.error('error', error);
      }
    }

  return (
    <View style={styles.container}>

      <ImageBackground source={backgroundImage} resizeMode="cover" style={styles.backgroundImage}>
        <View style={styles.switchContainer}>
          <Text style={styles.buttonText}>C</Text>
          <Switch
            trackColor={{false: '#767577', true: '#8BABB0'}}
            value={units === 'imperial'}
            onValueChange={() => setUnits(units === 'metric' ? 'imperial' : 'metric')}
          />
          <Text style={styles.buttonText}>F</Text>
        </View>

        <TouchableOpacity
          onPress={ fetchWeatherData }
          style={styles.button}
        >
          <Text style={styles.buttonText}>Get Weather in the City</Text>
        </TouchableOpacity>

        <TextInput
          style={styles.inputContainer}
          placeholder="Enter your city"
          value={city}
          onChangeText={city => setCity(city)}
          />

        {weather && (
          <View style={styles.weatherContainer}>
            <View style={styles.weatherBackground}/>
            <View style={styles.weatherText}>
              <Text style={styles.text}>City: {weather.name}</Text>
              <Text style={styles.text}>Temperature: {weather.main.temp}°{units === 'metric' ? 'C' : 'F'}</Text>
              <Text style={styles.text}>Sky: {weather.weather[0].description}</Text>
              <Text style={styles.text}>Humidity: {weather.main.humidity}%</Text>
            </View>
          </View>
        )}

        <TouchableOpacity
          onPress={fetchWeatherForecast}
          style={styles.button}
        >
          <Text style={styles.buttonText}>Get 5-day forecast</Text>
        </TouchableOpacity>

        {forecast && (
          <FlatList
            style={styles.forecastContainer}
            data={forecast}
            renderItem={({ item }) => (
              <View style={styles.dayForecastContainer}>
                <Text>{item.dt_txt}</Text>
                <Text>{item.main.temp}°{units === 'metric' ? 'C' : 'F'}</Text>
                <Text>Sky: {item.weather[0].description}</Text>
              </View>
            )}
          />
        )}
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: '#000000c0',
  },
  inputContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    backgroundColor: '#fff',
    opacity: 0.7,
    padding: 10,
    marginBottom: 10,
    width: '60%',
  },
  weatherContainer: {
    position: 'relative',
    width: '60%',
    margin: 10,
    padding: 10,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: '#ccc',
  },
  weatherBackground:{
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#ccc',
    opacity: 0.3,
  },
  text: {
    color: '#767B7C',
    fontSize: 15,
    fontWeight: 'bold',
  },
  forecastContainer: {
    width: '90%',
    marginTop: 10,
    padding: 10,
  },
  dayForecastContainer: {
    marginTop: 10,
    padding: 10,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: '#ccc',
  },
  switchContainer: {
    right: -65,
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 10,
    gap: 10,
  },
  item: {
    padding: 10,
    fontSize: 10,
  },

  backgroundImage: {
    flex: 1,
    width: '100%',
    paddingTop: 100,
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: '#000000c0',
  },
  button: {
    padding: 12,
    marginBottom: 5,
    borderRadius: 5,
    backgroundColor: '#8BABB0',
    opacity: 0.8,
  },
  buttonText: {
    fontSize: 20,
    lineHeight: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#fff',
  }

});
