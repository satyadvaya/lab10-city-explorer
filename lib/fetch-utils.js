const fetch = require('node-fetch');

async function weatherData(lat, lon) {
  const weather = await fetch(
    `https://api.weatherbit.io/v2.0/forecast/daily?key=${process.env.WEATHER_KEY}&lat=${lat}&lon=${lon}`
  );
  const weatherJSON = await weather.json();
  const data = weatherJSON.data.map((weatherObject) => {
    return {
      forecast: weatherObject.weather.description,
      time: new Date(weatherObject.ts * 1000).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }),
    };
  });
  return data;
}

async function getReviewsData(lat, lon) {
  let url = `https://api.yelp.com/v3/businesses/search?latitude=${lat}&longitude=${lon}`;
  const bearer = 'Bearer ' + process.env.YELP_KEY;
  const apiResp = await fetch(url, {
    method: 'GET',
    withCredentials: true,
    credentials: 'include',
    headers: {
      'Authorization': bearer,
      'Content-Type': 'application/json'
    } });
  const apiData = await apiResp.json();
  const data = apiData.businesses.map((b) => {
    return {
      name: b.name,
      image_url: b.image_url,
      price: b.price,
      rating: b.rating,
      url: b.url,
    };
  });
  return data;
}


module.exports = {
  weatherData, getReviewsData
};