import requests
from django.shortcuts import render
from django.http import JsonResponse
from django.conf import settings

def index(request):
    """Render the main weather dashboard page."""
    return render(request, 'weather/index.html')

def get_weather(request):
    """Fetch weather data for the specified city."""
    city = request.GET.get('city', '')
    if city:
        api_key = settings.WEATHER_API_KEY  # Use the API key from settings
        url = f'http://api.openweathermap.org/data/2.5/weather?q={city}&appid={api_key}&units=metric'
        response = requests.get(url)
        data = response.json()

        if data.get('cod') == 200:  # Ensure the API call is successful
            return JsonResponse({
                'name': data['name'],
                'temp': data['main']['temp'],
                'humidity': data['main']['humidity'],
            })
        else:
            return JsonResponse({'error': data.get('message', 'An error occurred.')})
    
    return JsonResponse({'error': 'Please enter a valid city name.'})
