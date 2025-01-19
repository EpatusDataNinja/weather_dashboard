// DOM Elements
const cityInput = document.getElementById('cityInput');
const weatherInfo = document.getElementById('weatherInfo');
const errorMessage = document.getElementById('errorMessage');
const loading = document.querySelector('.loading');

// Event listener for Enter key
cityInput.addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        getWeather();
    }
});

// Weather icon mapping
const weatherIconMap = {
    '01d': '<i class="wi wi-day-sunny"></i>',
    '01n': '<i class="wi wi-night-clear"></i>',
    '02d': '<i class="wi wi-day-cloudy"></i>',
    '02n': '<i class="wi wi-night-alt-cloudy"></i>',
    '03d': '<i class="wi wi-cloud"></i>',
    '03n': '<i class="wi wi-cloud"></i>',
    '04d': '<i class="wi wi-cloudy"></i>',
    '04n': '<i class="wi wi-cloudy"></i>',
    '09d': '<i class="wi wi-showers"></i>',
    '09n': '<i class="wi wi-showers"></i>',
    '10d': '<i class="wi wi-day-rain"></i>',
    '10n': '<i class="wi wi-night-alt-rain"></i>',
    '11d': '<i class="wi wi-thunderstorm"></i>',
    '11n': '<i class="wi wi-thunderstorm"></i>',
    '13d': '<i class="wi wi-snow"></i>',
    '13n': '<i class="wi wi-snow"></i>',
    '50d': '<i class="wi wi-fog"></i>',
    '50n': '<i class="wi wi-fog"></i>'
};

// Main function to fetch weather data
async function getWeather() {
    const city = cityInput.value.trim();
    
    if (!city) {
        showError('Please enter a city name');
        return;
    }

    try {
        showLoading();
        hideError();

        const response = await fetch(`/weather/get_weather/?city=${encodeURIComponent(city)}`);
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Failed to fetch weather data');
        }

        updateWeatherUI(data);
    } catch (error) {
        showError(error.message);
    } finally {
        hideLoading();
    }
}

// Update UI with weather data
function updateWeatherUI(data) {
    // Update weather icon with new animated icons
    const iconCode = data.weather[0].icon;
    const weatherIconContainer = document.getElementById('weatherIcon');
    weatherIconContainer.innerHTML = weatherIconMap[iconCode] || '<i class="wi wi-day-sunny"></i>';

    // Update temperature
    const temp = Math.round(data.main.temp);
    document.getElementById('temperature').textContent = `${temp}°C`;

    // Update weather description
    const description = data.weather[0].description;
    document.getElementById('description').textContent = 
        description.charAt(0).toUpperCase() + description.slice(1);

    // Update weather details
    document.getElementById('feelsLike').textContent = `${Math.round(data.main.feels_like)}°C`;
    document.getElementById('humidity').textContent = `${data.main.humidity}%`;
    document.getElementById('windSpeed').textContent = `${Math.round(data.wind.speed * 3.6)} km/h`;
    document.getElementById('pressure').textContent = `${data.main.pressure} hPa`;

    // Show weather info with animation
    weatherInfo.style.display = 'grid';
    weatherInfo.style.opacity = '0';
    setTimeout(() => {
        weatherInfo.style.transition = 'opacity 0.5s ease-in-out';
        weatherInfo.style.opacity = '1';
    }, 100);
}

// Utility functions
function showLoading() {
    loading.style.display = 'block';
    weatherInfo.style.display = 'none';
}

function hideLoading() {
    loading.style.display = 'none';
}

function showError(message) {
    errorMessage.textContent = message;
    errorMessage.style.display = 'block';
}

function hideError() {
    errorMessage.style.display = 'none';
}

// Add smooth hover effects
document.querySelectorAll('.weather-card').forEach(card => {
    card.addEventListener('mouseover', function() {
        this.style.transform = 'translateY(-10px)';
    });

    card.addEventListener('mouseout', function() {
        this.style.transform = 'translateY(0)';
    });
});
