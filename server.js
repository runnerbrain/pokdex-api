require('dotenv').config();
const express = require('express');
const res = require('express/lib/response');
const morgan = require('morgan');
const cors = require('cors');

const POKEDEXDATA = require('./pokedex.json');
const { response } = require('express');
const app = express();

const morganSetting = process.env.NODE_ENV === 'production' ? 'tiny' : 'common';

app.use(morgan(morganSetting));
app.use(cors());

function handleGetTypes(req, res) {
  const validTypes = [
    `Bug`,
    `Dark`,
    `Dragon`,
    `Electric`,
    `Fairy`,
    `Fighting`,
    `Fire`,
    `Flying`,
    `Ghost`,
    `Grass`,
    `Ground`,
    `Ice`,
    `Normal`,
    `Poison`,
    `Psychic`,
    `Rock`,
    `Steel`,
    `Water`,
    `Clay`,
  ];

  res.json(validTypes);
}

function handleGetPokemon(req, res) {
  const { name, type } = req.query;
  let result = POKEDEXDATA.pokemon;

  if (name) {
    result = result.filter((item) => item.name.includes(name.toLowerCase()));
  }

  if (type) {
    result = result.filter((item) => item.type.includes(type));
  }

  res.json(result);
}

app.use(function validateBearerToken(req, res, next) {
  const authToken = req.get('Authorization');
  const apiToken = process.env.API_TOKEN;
  debugger;
  if (!authToken || authToken.split(' ')[1] !== apiToken) {
    return res.status(401).json({ error: 'Unauthorized request' });
  }
  next();
});

app.get('/types', handleGetTypes);
app.get('/pokemon', handleGetPokemon);

app.use((error, req, res, next) => {
  let response;
  if (process.env.NODE_ENV === 'production') {
    response = { error: { message: 'server error' } };
  } else {
    response = { error };
  }
  res.status(500).json(response);
});

// const PORT = 8000;
const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`Server listening on port : ${PORT}`);
});
