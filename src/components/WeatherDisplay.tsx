import React from 'react'
import { Sun, Cloud, CloudRain, Wind } from 'lucide-react'

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

interface WeatherDisplayProps {
  data: WeatherData
}

const WeatherDisplay: React.FC<WeatherDisplayProps> = ({ data }) => {
  const getWeatherIcon = (main: string) => {
    switch (main.toLowerCase()) {
      case 'clear':
        return <Sun className="text-yellow-400" size={48} />
      case 'clouds':
        return <Cloud className="text-gray-400" size={48} />
      case 'rain':
        return <CloudRain className="text-blue-400" size={48} />
      default:
        return <Sun className="text-yellow-400" size={48} />
    }
  }

  return (
    <div className="text-center">
      <h2 className="text-2xl font-semibold mb-2">{data.name}</h2>
      <div className="flex justify-center mb-4">
        {getWeatherIcon(data.weather[0].main)}
      </div>
      <p className="text-4xl font-bold mb-2">{Math.round(data.main.temp)}°C</p>
      <p className="text-lg mb-4">{data.weather[0].description}</p>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="font-semibold">Humidity</p>
          <p>{data.main.humidity}%</p>
        </div>
        <div>
          <p className="font-semibold">Wind Speed</p>
          <p>{data.wind.speed} m/s</p>
        </div>
      </div>
    </div>
  )
}

export default WeatherDisplay