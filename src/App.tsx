import React, { useState, useEffect } from 'react'
import { Sun, Cloud, CloudRain, Wind, MapPin } from 'lucide-react'
import WeatherDisplay from './components/WeatherDisplay'
import SearchBar from './components/SearchBar'
import AirQualityDisplay from './components/AirQualityDisplay'

const API_KEY = 'fc99827e009f404fb38b97c3aefb4fea'
const API_BASE_URL = 'https://api.openweathermap.org/data/2.5'

interface WeatherData {
  main: {
    temp: number
    humidity: number
  }
  weather: Array<{
    main: string
    description: string
  }>
  wind: {
    speed: number
  }
  name: string
}

interface AirQualityData {
  list: Array<{
    main: {
      aqi: number
    }
    components: {
      co: number
      no2: number
      o3: number
      pm2_5: number
      pm10: number
    }
  }>
}

function App() {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null)
  const [airQualityData, setAirQualityData] = useState<AirQualityData | null>(null)
  const [location, setLocation] = useState<{ lat: number; lon: number } | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    requestLocation()
  }, [])

  useEffect(() => {
    if (location) {
      fetchWeatherAndAirQuality(location.lat, location.lon)
    }
  }, [location])

  const requestLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lon: position.coords.longitude,
          })
        },
        (err) => {
          setError('Unable to retrieve your location. Please search for a city manually.')
          console.error(err)
        }
      )
    } else {
      setError('Geolocation is not supported by your browser. Please search for a city manually.')
    }
  }

  const fetchWeatherAndAirQuality = async (lat: number, lon: number) => {
    setLoading(true)
    setError('')
    try {
      const [weatherResponse, airQualityResponse] = await Promise.all([
        fetch(`${API_BASE_URL}/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`),
        fetch(`${API_BASE_URL}/air_pollution?lat=${lat}&lon=${lon}&appid=${API_KEY}`)
      ])

      if (!weatherResponse.ok || !airQualityResponse.ok) {
        throw new Error('Failed to fetch data')
      }

      const weatherData = await weatherResponse.json()
      const airQualityData = await airQualityResponse.json()

      setWeatherData(weatherData)
      setAirQualityData(airQualityData)
    } catch (err) {
      setError('Failed to fetch weather and air quality data. Please try again.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = async (cityName: string) => {
    setLoading(true)
    setError('')
    try {
      const response = await fetch(`${API_BASE_URL}/weather?q=${cityName}&units=metric&appid=${API_KEY}`)
      if (!response.ok) {
        throw new Error('City not found')
      }
      const data = await response.json()
      setWeatherData(data)
      fetchWeatherAndAirQuality(data.coord.lat, data.coord.lon)
    } catch (err) {
      setError('Failed to fetch weather data. Please try again.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">Weather & Air Quality</h1>
        <SearchBar onSearch={handleSearch} />
        {loading && <p className="text-center mt-4">Loading...</p>}
        {error && <p className="text-center mt-4 text-red-500">{error}</p>}
        {weatherData && <WeatherDisplay data={weatherData} />}
        {airQualityData && <AirQualityDisplay data={airQualityData} />}
        <button
          onClick={requestLocation}
          className="mt-4 w-full bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center justify-center"
        >
          <MapPin className="mr-2" size={20} />
          Use My Location
        </button>
      </div>
    </div>
  )
}

export default App