import React from 'react';
import { Wind, Droplets, Gauge, Eye, Thermometer } from 'lucide-react';
import WeatherCard from './WeatherCard';

const CurrentWeather = ({ data }) => {
    if (!data) return null;

    const { current, location } = data;

    return (
        <div className="weather-grid">
            <WeatherCard className="main-card">
                <h2>{location.name}, {location.country}</h2>
                <p className="subtitle">{current.weather_descriptions[0]}</p>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem' }}>
                    <img
                        src={current.weather_icons[0]}
                        alt={current.weather_descriptions[0]}
                        style={{ width: '64px', height: '64px', borderRadius: '8px' }}
                    />
                    <h1 style={{ margin: 0 }}>{current.temperature}°C</h1>
                </div>
                <p>Feels like {current.feelslike}°C</p>
            </WeatherCard>

            <WeatherCard title="Details">
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div className="weather-detail-item">
                        <Wind size={20} />
                        <span>Wind: {current.wind_speed} km/h {current.wind_dir}</span>
                    </div>
                    <div className="weather-detail-item">
                        <Droplets size={20} />
                        <span>Humidity: {current.humidity}%</span>
                    </div>
                    <div className="weather-detail-item">
                        <Gauge size={20} />
                        <span>Pressure: {current.pressure} mb</span>
                    </div>
                    <div className="weather-detail-item">
                        <Eye size={20} />
                        <span>Visibility: {current.visibility} km</span>
                    </div>
                    <div className="weather-detail-item">
                        <Thermometer size={20} />
                        <span>UV Index: {current.uv_index}</span>
                    </div>
                </div>
            </WeatherCard>
        </div>
    );
};

export default CurrentWeather;
