import React, { useEffect, useState } from 'react';
import { 
  View, 
  StyleSheet, 
  Text, 
  TextInput, 
  FlatList, 
  Switch,
  Image, 
  ImageBackground,
  TouchableOpacity,
  Keyboard,
} from 'react-native';

const API_KEY = 'a7d88b73aded8bb39c3d3c12f382758c';
const backgroundImage = {url: 'https://images.unsplash.com/photo-1530908295418-a12e326966ba?q=80&w=2187&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'};

export default function WeatherApp() {
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [units, setUnits] = useState('metric');
  const [, setErrorMessage] = useState('');
  
  useEffect(() => {
    if (city) {
      fetchWeatherData();
      fetchWeatherForecast();
      // if (weather !== null) {
      //   fetchWeatherData();
      // }
      // if (forecast.length) {
      //   fetchWeatherForecast();
      // }
    }
  }, [units]);

  const fetchWeatherData = async () => {
    try {
      const response = await fetch(
        `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=${units}&APPID=${API_KEY}`
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      setWeather(data);
      setErrorMessage('');

    } catch (error) {
      setWeather(null);
      setErrorMessage('Something went wrong', error);
      alert("Hmm, we can't find a city with such name", error);
    }
  };

  const fetchWeatherForecast = async () => {
    try {
      const response = await fetch(
        `http://api.openweathermap.org/data/2.5/forecast?q=${city}&units=${units}&APPID=${API_KEY}`
        );
        
        if (!response.ok) {
          throw new Error(`Failed to fetch: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        setForecast(data.list);

      } catch (error) {
        setForecast([]);
        setErrorMessage('Something went wrong', error);
        alert('You might want to check your city name again', error);
      }
    }

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  }

  const formatDateTime = (dateTimeString) => {
    const date = new Date(dateTimeString);
    const month = date.toLocaleString('default', { month: 'short' });
    const day = date.getDate();
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const formattedDate = `${month} ${day}, ${hours}:${minutes.toString().padStart(2, '0')}`;
    return formattedDate;
  };

  const toggleUnits = () => {
    setUnits(units === 'metric' ? 'imperial' : 'metric');
  };

  const handleGetWeather = () => {
    fetchWeatherData();
    dismissKeyboard();
    if (weather !== null) {
      fetchWeatherForecast();
    }
  };

  const handleGetForecast = () => {
      fetchWeatherForecast();
      dismissKeyboard();
      if (weather !== null) {
        fetchWeatherData();
      }
  };

  return (
      <View style={styles.container}>
        <ImageBackground 
          source={backgroundImage} 
          resizeMode="cover" 
          style={styles.backgroundImage}
        >
          <View style={styles.switchContainer}>
            <Text style={styles.buttonText}>C</Text>
            <Switch
              trackColor={{false: '#767577', true: '#8BABB0'}}
              value={units === 'imperial'}
              onValueChange={toggleUnits}
            />
            <Text style={styles.buttonText}>F</Text>
          </View>

          <TouchableOpacity
            style={styles.button}
            onPress={handleGetWeather}
          >
            <Text style={styles.buttonText}>Get Weather in the City</Text>
          </TouchableOpacity>

          <TextInput
            style={styles.inputContainer}
            placeholder="Enter your city"
            value={city}
            onChangeText={setCity}
            />

          {weather && (
            <View style={styles.weatherContainer}>
              <View style={styles.weatherBackground}/>
              <View style={styles.weatherText}>
                <Text style={styles.text}>City: {weather.name}</Text>
                <Text style={styles.text}>Temperature: {Math.ceil(weather.main.temp)}°{units === 'metric' ? 'C' : 'F'}</Text>
                <Image
                    style={{ width: 30, height: 30 }}
                    source={{ uri: `http://openweathermap.org/img/w/${weather.weather[0].icon}.png` }}
                  />
                <Text style={styles.text}>Sky: {weather.weather[0].description}</Text>
                <Text style={styles.text}>Humidity: {weather.main.humidity}%</Text>
              </View>
            </View>
          )}

          <TouchableOpacity
            onPress={handleGetForecast}
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
                  <View style={styles.weatherBackground}/>
                  <Text>{formatDateTime(item.dt_txt)}</Text>
                  <Text>{Math.ceil(item.main.temp)}°{units === 'metric' ? 'C' : 'F'}</Text>
                  <Image
                    style={{ width: 30, height: 30 }}
                    source={{ uri: `http://openweathermap.org/img/w/${item.weather[0].icon}.png` }}
                  />
                  <Text style={styles.forecastDescription}>{item.weather[0].description}</Text>
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
  },
  inputContainer: {
    width: '60%',
    margin: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    backgroundColor: '#fff',
    opacity: 0.7,
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
    margin: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  dropdown: {
    position: 'absolute',
    top: 60,
    left: 20,
    right: 20,
    backgroundColor: '#fff',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  item: {
    padding: 10,
    fontSize: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
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
    marginBottom: 5,
    padding: 12,
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
