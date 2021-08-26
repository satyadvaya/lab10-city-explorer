const fetch = require('node-fetch');

async function locationData(search) {
  const location = await fetch(
    `https://us1.locationiq.com/v1/search.php?key=${process.env.GEOCODING_KEY}&q=${search}&format=json`
  );
  const locationJSON = await location.json();
  const data = {
    formatted_query: locationJSON[0].display_name,
    latitude: locationJSON[0].lat,
    longitude: locationJSON[0].lon,
  };
  console.log(locationJSON);
  return data;
}

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

async function reviewsData(lat, lon) {
  let url = `https://api.yelp.com/v3/businesses/search?latitude=${lat}&longitude=${lon}`;
  const bearer = 'Bearer ' + process.env.YELP_KEY;
  const reviews = await fetch(url, {
    method: 'GET',
    withCredentials: true,
    credentials: 'include',
    headers: {
      'Authorization': bearer,
      'Content-Type': 'application/json'
    } });
  const reviewsJSON = await reviews.json();
  const data = reviewsJSON.businesses.map((bus) => {
    return {
      name: bus.name,
      image_url: bus.image_url,
      price: bus.price,
      rating: bus.rating,
      url: bus.url,
    };
  });
  return data;
}

module.exports = {
  locationData, weatherData, reviewsData
};