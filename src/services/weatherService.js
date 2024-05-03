import { DateTime } from "luxon";

const API_KEY='6fd639d2d22ce6ce80ca0f4381a9de68';
const BASE_URL="https://api.openweathermap.org/data/2.5/weather";
const forcastApi='beb4b50959dc45e9990140447242204';

//next image code 
const getWeatherData=  (BASE_URL,searchParams)=>{
    const url=new URL(BASE_URL);
    
    url.search= new URLSearchParams({...searchParams,appid:API_KEY});

    console.log(fetch(url)
    .then((res)=>res.json()));
    return fetch(url)
    .then((res)=>res.json())
    
};

const getWeatherDataForecast=(forecastURL,searchParams)=>{
    const newforecastURL=new URL(forecastURL+"/v1/forecast.json");
    let queryParameter = '';

    if (searchParams.q) {
      // If city is passed, use it as the query parameter
      queryParameter = searchParams.q;
    } else if (searchParams.lat && searchParams.lon) {
      // If lat and lon are passed, use them as the query parameter
      queryParameter = `${searchParams.lat},${searchParams.lon}`;
    }
    
    newforecastURL.search=new URLSearchParams({q:queryParameter,key:forcastApi,days:5,aqi:"no",alerts:"no"})
    console.log(`this is url being passed ${newforecastURL}`);
    console.log(fetch(newforecastURL)
    .then((res)=>res.json()));
    return fetch(newforecastURL)
    .then((res)=>res.json());
    
}


const formatCurrentWeather=(data)=>{

    const {
        coord:{lat,lon},
        main:{temp,feels_like,temp_min,temp_max,humidity},
        name,
        dt,
        sys:{country,sunrise,sunset},
        weather,
        wind:{speed},
        timezone
    }=data;

    const{description,icon}=weather[0];

    console.log({lat,lon,temp,feels_like,temp_min,temp_max,humidity,
        name,
        dt,country,sunrise,sunset,
        description,icon,speed,timezone});

    return {lat,lon,temp,feels_like,temp_min,temp_max,humidity,
    name,
    dt,country,sunrise,sunset,
    description,icon,speed,timezone};

};
function formatForecastWeather(weatherData) {
    const { forecast,location } = weatherData; // assuming 'forecast' holds daily and hourly data
    
    
    
    // Get the next 4 days of weather data
    const next4Days = forecast.forecastday.slice(1,5).map(day => {
      const { date, day: { avgtemp_c, avgtemp_f, condition: { icon :display ,code} } } = day;
       // Convert date string to day of the week
  const dateObj = new Date(date); // Convert "year-month-day" to Date object
  const dayOfWeek = new Intl.DateTimeFormat('en-GB', { weekday: 'long' }).format(dateObj); // Get day of the week in full

      return { time:dayOfWeek, avgtemp_c, avgtemp_f ,display,code};
    });


  




    const fromtime=location.localtime.split(' ')[1];
    console.log(fromtime);
    const formattedHours = extractFormattedHour(fromtime);
    console.log(formattedHours);

    function extractFormattedHour(fromtime) {
      const parts = fromtime.split(':'); // Split the string at ':'
      const hourss = parseInt(parts[0],10); // Extract the hour part
      return hourss; // Format it with ":00" for consistency
    }

  
    // Get the next 4 hours of weather data for today
    const todayHourly = forecast.forecastday[0].hour;
    const upcoming4Hours = todayHourly.slice(formattedHours+1, formattedHours + 5).map(hour => {
      const { time, temp_c, temp_f, condition: { icon: display,code} } = hour;
    
      const formattedTime = time.split(' ')[1]; // Extracting the 'hour' from time
      return { time: formattedTime, avgtemp_c: temp_c, avgtemp_f: temp_f,display,code };
    });
    console.log(upcoming4Hours);

  
    return { next4Days, upcoming4Hours,location,forecast};
  }
  
  // Example usage:
  // Assuming 'weatherData' is the JSON object containing weather forecast information
  // const weatherData = { ... }; // your weather JSON data
  // const result = extractWeatherData(weatherData);
  // console.log(result);
  

       

const getFormattedWeatherData = async(searchParams)=>{
    const formattedCurrentWeather = await getWeatherData
    ("https://api.openweathermap.org/data/2.5/weather",searchParams).then(formatCurrentWeather);

    const {lat,lon}=formatCurrentWeather;

    const formattedForecastWeather= await getWeatherDataForecast('https://api.weatherapi.com'    //this onecall is used to get more detailed forecast hourly and daily we are exculding
                                         // current coz it is already being displayed ,units are celsius and farenheit.
     ,searchParams).then(formatForecastWeather);
     const { location } = formattedForecastWeather;
     const formattedLocalTime = getFormattedLocalTime(location);

    return {...formattedCurrentWeather,...formattedForecastWeather,formattedLocalTime};

};

export default getFormattedWeatherData;

// This object maps WeatherAPI weather codes to icon URLs
const weatherIconLinks = {
    // Clear Sky
    1000: "https://cdn.weatherapi.com/weather/64x64/day/113.png", // Clear Day
    1003: "https://cdn.weatherapi.com/weather/64x64/day/116.png", // Partly Cloudy Day
    1006: "https://cdn.weatherapi.com/weather/64x64/day/119.png", // Cloudy
    1009: "https://cdn.weatherapi.com/weather/64x64/day/122.png", // Overcast
    
    // Rain
    1063: "https://cdn.weatherapi.com/weather/64x64/day/176.png", // Patchy Rain Possible
    1180: "https://cdn.weatherapi.com/weather/64x64/day/353.png", // Light Rain
    1183: "https://cdn.weatherapi.com/weather/64x64/day/356.png", // Moderate Rain
    
    // Thunderstorms
    1273: "https://cdn.weatherapi.com/weather/64x64/day/389.png", // Patchy Thunderstorm
    1276: "https://cdn.weatherapi.com/weather/64x64/day/392.png", // Thunderstorm
    1240: 'https://cdn.weatherapi.com/weather/64x64/night/353.png',
    1189:'https://cdn.weatherapi.com/weather/64x64/day/302.png',
    1195:'https://cdn.weatherapi.com/weather/64x64/day/308.png',
    
    // Snow
    1114: "https://cdn.weatherapi.com/weather/64x64/day/338.png", // Blowing Snow
    1117: "https://cdn.weatherapi.com/weather/64x64/day/338.png", // Blizzard
    1066: "https://cdn.weatherapi.com/weather/64x64/day/179.png", // Patchy Snow Possible
    
    // Fog and Mist
    1030: "https://cdn.weatherapi.com/weather/64x64/day/143.png", // Mist
    1135: "https://cdn.weatherapi.com/weather/64x64/day/248.png", // Fog
    1153:"https:////cdn.weatherapi.com/weather/64x64/day/266.png"
  };

const iconUrlFromCode=(code)=>{
    console.log(code);
    return weatherIconLinks[code];
}
const currenturlfromcurrent=(code)=>{
    return `http://openweathermap.org/img/wn/${code}@2x.png`;
}


const getFormattedLocalTime = (location) => {
    // Extract the local time from the given location
    const localtimeString = location.localtime;
  
    // Create a Date object from the local time string
    const localDate = new Date(localtimeString);
  
    // Array of day names
    const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  
    // Array of month names
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  
    // Get the day of the week
    const dayOfWeek = dayNames[localDate.getDay()];
  
    // Get the month
    const month = monthNames[localDate.getMonth()];
  
    // Get the day of the month
    const dayOfMonth = localDate.getDate();
  
    // Format the output with day of the week, day of the month, and month
    const formattedTime = `${dayOfWeek}, ${month} ${dayOfMonth} | Local Time: ${localtimeString}`;
  
    // Log and return the formatted time
    console.log(formattedTime);
    return formattedTime;
  };
  

export {currenturlfromcurrent,iconUrlFromCode,getFormattedLocalTime};

// Function to convert a Unix timestamp to a local time in a given time zone
const formatToLocalTime = (timestamp, timezone) => {
    // Convert the Unix timestamp to a DateTime object in the specified time zone
    const dateTime = DateTime.fromSeconds(timestamp).setZone(timezone);
  
    // Format to a 12-hour format with hours and minutes, with AM/PM notation
    const formattedTime = dateTime.toFormat('h:mm a'); // 'h' is for 12-hour format, 'a' is for AM/PM
    
    return formattedTime; // Return the formatted local time
  };
  export {formatToLocalTime};



























//the single quote after yyyy is used to escape everything after year as we dont need it this is working with luxon
//this escaping ends with other single quote in Local time where we format other time

// const formatToLocalTime=(secs,zone,format="cccc,dd LLL yyyy'| Local time:'hh:mm a") =>{
// DateTime .fromSeconds(secs).setZone(zone).toFormat(format);
// console.log(formatToLocalTime); 
// }




/*const formatForecastWeather=(data)=>{//to work with dates and time we install luxon
    let {timezone,daily,hourly}=data;
    console.log(data);
    daily=daily.slice(1,6).map(d=>{ //we slice from index 1 to 6 coz at index 0 we will get current data which is already fetched
        return {
            title:formatToLocalTime(d.dt,timezone,'ccc'),//in api date is dt so we acces it using d.dt
            temp:d.temp.day,
            icon:d.weather[0].icon

            
        }
    });

    hourly=hourly.slice(1,6).map(d=>{ //we slice from index 1 to 6 coz at index 0 we will get current data which is already fetched
        return {
            title:formatToLocalTime(d.dt,timezone,'hh:mm a'),//in api date is dt so we acces it using d.dt
            temp:d.temp.day,
            icon:d.weather[0].icon,

            
        }
    });
return {timezone,daily,hourly};

};*/