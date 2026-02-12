const express = require('express');
const router = express.Router();
const Suggestion = require('../models/Suggestion');
const { protect } = require('../middleware/authMiddleware');

// POST /api/suggestions
// POST /api/suggestions (Private)
router.post('/', protect, async (req, res) => {
    try {
        const { name, category, message } = req.body;
        const newSuggestion = new Suggestion({
            name: req.user ? req.user.name : name,
            category,
            message
        });
        await newSuggestion.save();
        res.status(201).json(newSuggestion);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// GET /api/suggestions (Admin)
// GET /api/suggestions (Private/Admin)
router.get('/', protect, async (req, res) => {
    try {
        const suggestions = await Suggestion.find().sort({ createdAt: -1 });
        res.json(suggestions);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// DELETE /api/suggestions/:id (Admin)
// DELETE /api/suggestions/:id (Private/Admin)
router.delete('/:id', protect, async (req, res) => {
    try {
        await Suggestion.findByIdAndDelete(req.params.id);
        res.json({ message: 'Suggestion deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
