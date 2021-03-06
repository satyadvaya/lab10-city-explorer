require('dotenv').config();

const express = require('express');
const cors = require('cors');
// const client = require('./client.js');
const app = express();
const morgan = require('morgan');
const ensureAuth = require('./auth/ensure-auth');
const createAuthRoutes = require('./auth/create-auth-routes');
// const { default: fetch } = require('node-fetch');
const { locationData, weatherData, reviewsData } = require('./fetch-utils');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(morgan('dev')); // http logging

const authRoutes = createAuthRoutes();

// setup authentication routes to give user an auth token
// creates a /auth/signin and a /auth/signup POST route. 
// each requires a POST body with a .email and a .password
app.use('/auth', authRoutes);

// everything that starts with "/api" below here requires an auth token!
app.use('/api', ensureAuth);

// and now every request that has a token in the Authorization header will have a `req.userId` property for us to see who's talking
app.get('/api/test', (req, res) => {
  res.json({
    message: `in this proctected route, we get the user's id like so: ${req.userId}`
  });
});

// app.get('/animals', async(req, res) => {
//   try {
//     const data = await client.query('SELECT * from animals');
    
//     res.json(data.rows);
//   } catch(e) {
    
//     res.status(500).json({ error: e.message });
//   }
// });

app.get('/location', async (req, res) => {
  try {
    const search = req.query.search;
    const data = await locationData(search);
    res.json(data);

  } catch (event) { 
    res.status(500).json({ error: event.message });
  }
});

app.get('/weather', async (req, res) => {
  try {
    const lat = req.query.latitude;
    const lon = req.query.longitude;
    const data = await weatherData(lat, lon);
    res.json(data);

  } catch (event) {
    res.status(500).json({ error: event.message });
  }
});

app.get('/reviews', async (req, res) => {
  try {
    const lat = req.query.latitude;
    const lon = req.query.longitude;
    const data = await reviewsData(lat, lon);
    res.json(data);

  } catch (event) {
    res.status(500).json({ error: event.message });
  }
});

app.use(require('./middleware/error'));

module.exports = app;