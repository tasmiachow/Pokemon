const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Root route
app.get('/', (req, res) => {
    res.send('Welcome to the Express Backend!');
});

// Example API route
app.get('/api', (req, res) => {
    res.json({ message: "Welcome to the API endpoint!" });
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
