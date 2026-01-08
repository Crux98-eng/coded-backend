const Module = require('../models/Module');

exports.createModule = async (req, res) => {
  try {
    const moduleDoc = await Module.create(req.body);
    return res.status(201).json(moduleDoc);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};

exports.listModules = async (req, res) => {
  try {
    const filter = req.query.courseId ? { courseId: req.query.courseId } : {};
    const modules = await Module.find(filter).lean();
    return res.status(200).json(modules);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

exports.getModule = async (req, res) => {
  try {
    const moduleDoc = await Module.findById(req.params.id).lean();
    if (!moduleDoc) return res.status(404).json({ error: 'Module not found' });
    return res.status(200).json(moduleDoc);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

exports.updateModule = async (req, res) => {
  try {
    const allowed = (({ title, description, order }) => ({ title, description, order }))(req.body);
    const moduleDoc = await Module.findByIdAndUpdate(req.params.id, allowed, { new: true, runValidators: true });
    if (!moduleDoc) return res.status(404).json({ error: 'Module not found' });
    return res.status(200).json(moduleDoc);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};

exports.deleteModule = async (req, res) => {
  try {
    const moduleDoc = await Module.findByIdAndDelete(req.params.id);
    if (!moduleDoc) return res.status(404).json({ error: 'Module not found' });
    return res.status(200).json({ message: 'Module deleted' });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
