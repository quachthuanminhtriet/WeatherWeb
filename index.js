const API_KEY = '352b30d123885da614b7227b45698fe0';

// get api forn open weather map
async function fetchWeatherData(city) {
    const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric`;
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Failed to fetch weather data');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error:', error);
        alert('Không tìm thấy thông tin thời tiết cho thành phố này.');
    }
}

function displayWeather(weatherData) {
    const cityNameElem = document.getElementById('cityname'); // get city name id
    const temperatureElem = document.getElementById('temperature'); // get temperatue id
    const temperature = weatherData.list[0].main.temp; // get temperatue now
    const cityName = weatherData.city.name; // get name city enter

    cityNameElem.textContent = cityName;
    temperatureElem.textContent = `${temperature} °C`;
}

function displayHourlyForecast(weatherData) {
    const hourly = document.getElementById('hourly');
    hourly.innerHTML = '';

    const today = new Date();
    const todayStr = today.toISOString().split('T')[0]; // change to YYYY-MM-DDTHH:mm.sssZ

    weatherData.list.forEach((entry) => {
        const entryDate = new Date(entry.dt * 1000); // change Unix to Date
        const entryDateStr = entryDate.toISOString().split('T')[0]; 

        // Check to day or not
        if (entryDateStr === todayStr) {
            const temperature = entry.main.temp; // get temperture hours
            const condition = entry.weather[0].description; // get condition hours
            const hour = entryDate.getHours(); // get hours

            const hourElem = document.createElement('div');
            hourElem.classList.add('hour');
            hourElem.innerHTML = `
                <div>${hour}:00</div>
                <div>${temperature} °C</div>
                <div>${condition.charAt(0).toUpperCase() + condition.slice(1)}</div>
            `;

            hourly.appendChild(hourElem); // add child to parent element
        }
    });
}

// event press enter when submit seaching
document.getElementById('searchbar').addEventListener('keypress', async (event) => {
    if (event.key === 'Enter') {
        const city = event.target.value.trim();
        if (city) {
            const weatherData = await fetchWeatherData(city);
            if (weatherData) {
                displayWeather(weatherData);
                displayHourlyForecast(weatherData);
            }
        }
        document.getElementById('searchbar').value  = '';
    }
});
