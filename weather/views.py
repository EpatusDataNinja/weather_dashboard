import requests
from django.shortcuts import render
from django.http import JsonResponse
from django.conf import settings

def index(request):
    """Render the main weather dashboard page."""
    return render(request, 'weather/index.html')

def get_weather(request):
    """Fetch weather data for the specified city."""
    city = request.GET.get('city', '').strip()  # Ensure the city name is stripped of leading/trailing spaces

    if not city:
        return JsonResponse({'error': 'Please enter a valid city name.'}, status=400)

    api_key = settings.WEATHER_API_KEY  # Use the API key from settings
    url = f'http://api.openweathermap.org/data/2.5/weather?q={city}&appid={api_key}&units=metric'

    try:
        response = requests.get(url)
        # Check if the API call was successful
        response.raise_for_status()  # Raise an exception for 4xx/5xx responses
        data = response.json()

        if data.get('cod') == 200:
            # Ensure the 'weather' array exists and has at least one element
            weather = data.get('weather', [{}])[0] if data.get('weather') else {}
            
            # Return the necessary data if the response is valid
            return JsonResponse({
                'name': data.get('name', 'N/A'),
                'temp': data.get('main', {}).get('temp', 'N/A'),
                'humidity': data.get('main', {}).get('humidity', 'N/A'),
                'feels_like': data.get('main', {}).get('feels_like', 'N/A'),
                'wind_speed': data.get('wind', {}).get('speed', 'N/A'),
                'pressure': data.get('main', {}).get('pressure', 'N/A'),
                'weather': {
                    'icon': weather.get('icon', '01d'),  # Default icon if not available
                    'description': weather.get('description', 'N/A'),
                },
            })
        else:
            # Return error message from the API
            return JsonResponse({'error': data.get('message', 'An error occurred while fetching weather data.')}, status=500)

    except requests.exceptions.RequestException as e:
        # Handle request exceptions like connection errors, timeouts, etc.
        return JsonResponse({'error': str(e)}, status=500)

    except Exception as e:
        # Catch any other unexpected errors
        return JsonResponse({'error': 'An unexpected error occurred: ' + str(e)}, status=500)