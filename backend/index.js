const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// Dynamic import for node-fetch
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

// Pokémon API Route
app.get('/api/pokemon/:nameOrId', async (req, res) => {
  const { nameOrId } = req.params;

  try {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${nameOrId}`);
    if (!response.ok) {
      return res.status(404).json({ error: 'Pokémon not found' });
    }
    const data = await response.json();

    const simplifiedData = {
      name: data.name,
      id: data.id,
      stats: data.stats.map((stat) => ({
        name: stat.stat.name,
        base_stat: stat.base_stat,
      })),
      moves: data.moves.slice(0, 4).map((move) => move.move.name),
      sprite: data.sprites.front_default,
    };

    res.json(simplifiedData);
  } catch (error) {
    console.error('Error fetching Pokémon data:', error);
    res.status(500).json({ error: 'Failed to fetch Pokémon data' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
