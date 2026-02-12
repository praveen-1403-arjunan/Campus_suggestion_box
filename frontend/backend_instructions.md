
# MERN Backend Implementation Guide

To turn this SPA into a real MERN application, follow these steps to build the Node.js backend.

## 1. Directory Structure
```
/backend
  /models
    Suggestion.js
  /routes
    suggestionRoutes.js
  /controllers
    suggestionController.js
  server.js
  package.json
```

## 2. Server (server.js)
```javascript
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const suggestionRoutes = require('./routes/suggestionRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/suggestions', suggestionRoutes);

// Database Connection
mongoose.connect('mongodb://localhost:27017/campus_suggestions', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('MongoDB Connected');
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}).catch(err => console.log(err));
```

## 3. Model (models/Suggestion.js)
```javascript
const mongoose = require('mongoose');

const SuggestionSchema = new mongoose.Schema({
  name: { type: String, default: 'Anonymous' },
  category: { 
    type: String, 
    required: true, 
    enum: ['Academics', 'Facilities', 'Events', 'Others'] 
  },
  message: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Suggestion', SuggestionSchema);
```

## 4. Routes (routes/suggestionRoutes.js)
```javascript
const express = require('express');
const router = express.Router();
const Suggestion = require('../models/Suggestion');

// POST /api/suggestions
router.post('/', async (req, res) => {
  try {
    const { name, category, message } = req.body;
    const newSuggestion = new Suggestion({ name, category, message });
    await newSuggestion.save();
    res.status(201).json(newSuggestion);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// GET /api/suggestions (Admin)
router.get('/', async (req, res) => {
  try {
    const suggestions = await Suggestion.find().sort({ createdAt: -1 });
    res.json(suggestions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/suggestions/:id (Admin)
router.delete('/:id', async (req, res) => {
  try {
    await Suggestion.findByIdAndDelete(req.params.id);
    res.json({ message: 'Suggestion deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
```

## How to Run:
1. Install MongoDB on your machine.
2. In the `backend` folder: `npm init -y`, `npm install express mongoose cors`.
3. Start the server: `node server.js`.
4. In the React app, update `services/storage.ts` to use `fetch('http://localhost:5000/api/suggestions')`.
