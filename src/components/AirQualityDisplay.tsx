import React from 'react'

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

interface AirQualityDisplayProps {
  data: AirQualityData
}

const AirQualityDisplay: React.FC<AirQualityDisplayProps> = ({ data }) => {
  const { aqi } = data.list[0].main
  const { co, no2, o3, pm2_5, pm10 } = data.list[0].components

  const getAQIDescription = (aqi: number) => {
    switch (aqi) {
      case 1:
        return 'Good'
      case 2:
        return 'Fair'
      case 3:
        return 'Moderate'
      case 4:
        return 'Poor'
      case 5:
        return 'Very Poor'
      default:
        return 'Unknown'
    }
  }

  const getAQIColor = (aqi: number) => {
    switch (aqi) {
      case 1:
        return 'text-green-500'
      case 2:
        return 'text-yellow-500'
      case 3:
        return 'text-orange-500'
      case 4:
        return 'text-red-500'
      case 5:
        return 'text-purple-500'
      default:
        return 'text-gray-500'
    }
  }

  return (
    <div className="mt-6 border-t pt-4">
      <h3 className="text-xl font-semibold mb-2">Air Quality</h3>
      <p className={`text-2xl font-bold ${getAQIColor(aqi)} mb-2`}>
        {getAQIDescription(aqi)} (AQI: {aqi})
      </p>
      <div className="grid grid-cols-2 gap-2 text-sm">
        <div>
          <p className="font-semibold">CO:</p>
          <p>{co.toFixed(2)} μg/m³</p>
        </div>
        <div>
          <p className="font-semibold">NO₂:</p>
          <p>{no2.toFixed(2)} μg/m³</p>
        </div>
        <div>
          <p className="font-semibold">O₃:</p>
          <p>{o3.toFixed(2)} μg/m³</p>
        </div>
        <div>
          <p className="font-semibold">PM2.5:</p>
          <p>{pm2_5.toFixed(2)} μg/m³</p>
        </div>
        <div>
          <p className="font-semibold">PM10:</p>
          <p>{pm10.toFixed(2)} μg/m³</p>
        </div>
      </div>
    </div>
  )
}

export default AirQualityDisplay