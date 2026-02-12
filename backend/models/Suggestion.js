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
