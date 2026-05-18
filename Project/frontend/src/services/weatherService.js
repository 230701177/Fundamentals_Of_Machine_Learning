/**
 * Using Open-Meteo API (Free, No API Key required)
 * https://open-meteo.com/
 */

export const fetchEnvironmentalData = async (lat, lon) => {
  try {
    const response = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,weather_code&timezone=auto`
    );
    const data = await response.json();

    if (!data.current) throw new Error('Failed to fetch weather data');

    const weatherCode = data.current.weather_code;
    const { condition, description } = translateWMOCode(weatherCode);
    const temp = data.current.temperature_2m;
    const humidity = data.current.relative_humidity_2m;

    // Flood risk analysis based on weather codes (Rain/Thunderstorm codes)
    const floodRiskCodes = [61, 63, 65, 80, 81, 82, 95, 96, 99];
    const floodRisk = floodRiskCodes.includes(weatherCode);

    return {
      temp: temp,
      condition: condition,
      description: description,
      humidity: humidity,
      floodRisk: floodRisk,
      isHeatwave: temp > 35,
      heatIndex: calculateHeatIndex(temp, humidity),
      isMock: false
    };
  } catch (error) {
    console.error('Error fetching weather data from Open-Meteo:', error);
    return simulateWeatherData();
  }
};

/**
 * WMO Weather interpretation codes (WW)
 */
function translateWMOCode(code) {
  if (code === 0) return { condition: 'Clear', description: 'Clear sky' };
  if (code >= 1 && code <= 3) return { condition: 'Cloudy', description: 'Partly cloudy' };
  if (code >= 45 && code <= 48) return { condition: 'Fog', description: 'Foggy conditions' };
  if (code >= 51 && code <= 55) return { condition: 'Drizzle', description: 'Light drizzle' };
  if (code >= 61 && code <= 65) return { condition: 'Rain', description: 'Rainy' };
  if (code >= 71 && code <= 77) return { condition: 'Snow', description: 'Snowfall' };
  if (code >= 80 && code <= 82) return { condition: 'Storm', description: 'Rain showers' };
  if (code >= 95 && code <= 99) return { condition: 'Thunderstorm', description: 'Thunderstorm' };
  return { condition: 'Other', description: 'Atmospheric conditions' };
}

const simulateWeatherData = () => {
  const conditions = ['Sunny', 'Rain', 'Cloudy', 'Clear', 'Storm'];
  const condition = conditions[Math.floor(Math.random() * conditions.length)];
  const temp = Math.floor(Math.random() * (42 - 15) + 15);
  const humidity = Math.floor(Math.random() * (90 - 30) + 30);
  
  return {
    temp: temp,
    condition: condition,
    description: condition.toLowerCase(),
    humidity: humidity,
    floodRisk: condition === 'Rain' || condition === 'Storm',
    isHeatwave: temp > 38,
    heatIndex: calculateHeatIndex(temp, humidity),
    isMock: true
  };
};

function calculateHeatIndex(temp, humidity) {
  return (temp + (0.5555 * (6.11 * Math.exp(5417.7530 * (1/273.16 - 1/(273.15 + temp))) - 10))).toFixed(1);
}
