const Suggestion = require("../models/Suggestion.js");

exports.createSuggestion = async (req, res) => {
  try {
    const { name, email, anonymous, message, category } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({ error: "Message is required" });
    }

    const suggestion = await Suggestion.create({
      name: name || null,
      email: email || null,
      anonymous: Boolean(anonymous),
      message: message.trim(),
      category: category || "General Feedback",
    });

    return res.status(201).json({
      message: "Suggestion submitted successfully",
      suggestion,
    });
  } catch (error) {
    console.error("Create suggestion error:", error);
    return res.status(500).json({ error: error.message || "Failed to create suggestion" });
  }
};

exports.getSuggestions = async (req, res) => {
  try {
    const suggestions = await Suggestion.find().sort({ createdAt: -1 });

    return res.status(200).json(suggestions);
  } catch (error) {
    console.error("Get suggestions error:", error);
    return res.status(500).json({ error: error.message || "Failed to fetch suggestions" });
  }
};
