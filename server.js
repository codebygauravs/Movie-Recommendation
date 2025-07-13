const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());

// Dummy genre data
const genres = [
  { id: 1, name: 'Action' },
  { id: 2, name: 'Comedy' },
  { id: 3, name: 'Drama' },
  { id: 4, name: 'Horror' },
  { id: 5, name: 'Romance' },
];

// Endpoint to get genres
app.get('/api/genres', (req, res) => {
  res.json({ genres });
});

const PORT = 7000;
app.listen(PORT, () => {
  console.log(`✅ Backend API running at http://localhost:${PORT}`);
});
