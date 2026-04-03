export const checkWeatherTrigger = async () => {
  try {
    const res = await fetch(
      "https://api.openweathermap.org/data/2.5/weather?q=Bangalore&appid=YOUR_API_KEY"
    );

    const data = await res.json();

    const condition = data.weather[0].main;

    return condition === "Rain";
  } catch {
    return false;
  }
};