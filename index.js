const searchButton = document.getElementById('searchButton');
const cityInput = document.getElementById('cityInput');
const weatherData = document.getElementById('weatherData');

// Функція для обробки натискання кнопки "Enter"
function handleEnterKey(event) {
    if (event.key === 'Enter') {
        searchWeather();
    }
}

// Функція для пошуку погоди
async function searchWeather() {
    const cityName = cityInput.value;
    if (cityName) {
        try {
            const response = await fetch(`http://127.0.0.1:5000/weather/${cityName}`);
            const data = await response.json();

            if (response.status === 200) {
                const { name, main, weather } = data.data;
                const temperature = main.temp - 273.15;

                const weatherInfo = `
                    <strong>Погода в місті ${name}:</strong><br>
                    Температура: ${temperature.toFixed(2)}°C<br>
                    Вологість: ${main.humidity}%<br>
                    Тиск: ${main.pressure} гПа<br>
                    Опис: ${weather[0].description}
                `;
                weatherData.innerHTML = weatherInfo;
            } else if (response.status === 404) {
                weatherData.textContent = 'Місто не знайдено';
            }
        } catch (error) {
            console.error(error);
            weatherData.textContent = 'Помилка на сервері';
        }
    } else {
        weatherData.textContent = 'Введіть назву міста';
    }
}

// Додавання обробників подій
searchButton.addEventListener('click', searchWeather);
cityInput.addEventListener('keyup', handleEnterKey);