import requests
from dotenv import load_dotenv
import os

load_dotenv()

def climateSocre(lat, long, timeStamp):
    try:
        day = timeStamp[0:10]
        hour = int(timeStamp[11:13])
        url = "https://api.open-meteo.com/v1/forecast"
        params = {
            "latitude": lat,
            "longitude": long,
            "hourly": ["temperature_2m", "visibility", "wind_speed_10m", "precipitation", "relative_humidity_2m"],
            "start_date": day,
            "end_date": day  
        }
        response = requests.get(url, params=params, timeout=5)
        if response.status_code != 200:
            return 0.15
        data = response.json()
        hourly_data = data.get('hourly', {})
        curr_temp = hourly_data.get("temperature_2m", [25]*24)[hour]
        curr_vis = hourly_data.get("visibility", [20000]*24)[hour]
        curr_wind = hourly_data.get("wind_speed_10m", [5]*24)[hour]
        curr_prec = hourly_data.get("precipitation", [0]*24)[hour]
        curr_humid = hourly_data.get("relative_humidity_2m", [50]*24)[hour]
        norm_prec = min(curr_prec / 40, 1)
        norm_wind = min(curr_wind / 30, 1)
        norm_vis = 1 - min(curr_vis / 25000, 1)
        norm_humid = curr_humid / 100
        norm_temp = abs(curr_temp - 25) / 25
        climate_score = (0.3 * norm_prec + 0.25 * norm_vis + 0.2 * norm_wind + 0.15 * norm_humid + 0.2 * norm_temp)
        return round(climate_score, 2)
    except Exception as e:
        print(f"Climate Scoring Fallback Triggered: {e}")
        return 0.15

def LocationScore(lat, long):
    try:
        key = os.getenv("TOMTOM_KEY")
        if not key:
            return 0.25
        flowUrl = f"https://api.tomtom.com/traffic/services/4/flowSegmentData/relative0/10/json?point={lat}%2C{long}&unit=KMPH&openLr=false&key={key}"
        response = requests.get(flowUrl, timeout=5)
        if response.status_code != 200:
            return 0.25
        json_data = response.json()
        data = json_data.get('flowSegmentData')
        if not data:
            return 0.25
        curr_speed = data.get('currentSpeed', 1)
        free_speed = data.get('freeFlowSpeed', 1)
        confidence = data.get('confidence', 0.5)
        if free_speed == 0: free_speed = 1
        congestion = 1 - (curr_speed / free_speed)
        congestion *= confidence
        weights = {1: 1.0, 6: 0.7, 7: 0.8, 8: 1.0, 9: 0.5, 14: 0.9}
        delta = 0.05
        bbox = f"{long - delta},{lat - delta},{long + delta},{lat + delta}"
        incidentUrl = f"https://api.tomtom.com/traffic/services/5/incidentDetails?bbox={bbox}&key={key}"
        inc_response = requests.get(incidentUrl, timeout=5)
        incidents = 0
        if inc_response.status_code == 200:
            inc_data = inc_response.json()
            incident_list = inc_data.get('incidents', [])
            if incident_list:
                for i in incident_list:
                    cat = i.get("properties", {}).get("iconCategory")
                    incidents += weights.get(cat, 0.3)
                incidents /= len(incident_list)
        result = congestion * 0.5 + incidents * 0.5
        return round(min(result, 1), 2)
    except Exception as e:
        print(f"Location Scoring Fallback Triggered: {e}")
        return 0.20
