import { useEffect, useState } from "react";
import { Button, Input } from "@nextui-org/react";
import { CircularProgress } from "@nextui-org/react";
import Toggle from "./toggle";
import axios from "axios";
import Footer from "./footer";

import { toast } from "sonner";

type LatLonType = {
  lat: number;
  lon: number;
};

type WeatherType = {
  name: string;
  temperature: number;
  humidity: number;
  weather: string;
  wind: number;
  visibility: number;
};

export default function WeatherCard() {
  const [place, setPlace] = useState<string>("");
  const [location, setLocation] = useState<LatLonType>({ lat: 0, lon: 0 });
  const [data, setData] = useState<WeatherType | null>(null);
  const [currentDate, setCurrentDate] = useState<string>("");

  const refresh = () => {
    setPlace(""); // Clear the place state
    return;
  };

  const submit = async () => {
    try {
      if (!place) {
        toast.warning("Enter a place name");
        return;
      }
      const response = await axios.get(`http://api.openweathermap.org/geo/1.0/direct?q=${place}&limit=5&appid=${import.meta.env.VITE_API_KEY}`);
      console.log("result", response.data);
      if (response.data && response.data.length > 0) {
        setLocation({
          lat: response.data[0].lat,
          lon: response.data[0].lon
        });
        fetchWeatherData(response.data[0].lat, response.data[0].lon);
        refresh(); // Call refresh to clear the input field
      } else {
        console.error("Location not found");
        toast.warning("Location not found");
      }
    } catch (error) {
      console.error("Error fetching location data:", error);
    }
  };

  const fetchWeatherData = async (lat: number, lon: number) => {
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${import.meta.env.VITE_API_KEY}`
      );
      const data = await response.json();
      if (response.ok) {
        setData({
          name: data.name,
          temperature: data.main.temp,
          humidity: data.main.humidity,
          weather: data.weather[0].main,
          wind: data.wind.speed,
          visibility: data.visibility / 1000
        });
      } else {
        console.error("Error fetching weather data:", data.message);
      }
    } catch (error) {
      console.error("Error fetching weather data:", error);
    }
  };

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocation({ lat: latitude, lon: longitude });

          fetchWeatherData(latitude, longitude);
        },
        (error) => {
          console.error("Error fetching location:", error);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }

    // Get the current date and format it
    const currentDate = new Date().toLocaleDateString(undefined, {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric"
    });
    setCurrentDate(currentDate);
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      {data ? (
        <div className="bg-white bg-opacity-20 backdrop-filter backdrop-blur-lg border border-gray-300 rounded-md shadow-lg p-4 w-[30rem]">
          <div className="flex flex-col items-center">
            <div className="flex w-full justify-between items-center">
              <Input type="text" placeholder="Location" className="flex-1 mr-2 h-10" value={place} onChange={(e) => setPlace(e.target.value)} />
              <Button color="default" variant="ghost" className="w-[4rem] mr-3" onClick={submit}>
                Search
              </Button>
              <Toggle />
            </div>
            <div className="font-bold text-xl mt-4">{data.name}</div>
            <div className="text-sm text-gray-500">{currentDate}</div>
            <div className="mt-6 text-6xl text-indigo-400">{data.temperature}°C</div>
            <div className="flex flex-row justify-between mt-6 w-full">
              <div className="flex flex-col items-center">
                <div className="font-medium text-sm">Wind</div>
                <div className="text-sm text-gray-500">{data.wind} m/s</div>
              </div>
              <div className="flex flex-col items-center">
                <div className="font-medium text-sm">Humidity</div>
                <div className="text-sm text-gray-500">{data.humidity}%</div>
              </div>
              <div className="flex flex-col items-center">
                <div className="font-medium text-sm">Visibility</div>
                <div className="text-sm text-gray-500">{data.visibility} km</div>
              </div>
              <div className="flex flex-col items-center">
                <div className="font-medium text-sm">Weather</div>
                <div className="text-sm text-gray-500">{data.weather}</div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-center min-h-screen">
          <CircularProgress size="lg" aria-label="Loading..." />
        </div>
      )}
      <Footer />
    </div>
  );
}
