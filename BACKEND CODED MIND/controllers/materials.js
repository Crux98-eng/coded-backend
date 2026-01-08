const Material = require('../models/Material');
const cloud = require('../services/cloudinary');

exports.createMaterial = async (req, res) => {
  try {
    // Expect multipart/form-data with field 'file' (pdf/doc) and lessonId/title/fileType in body
    if (!req.file) return res.status(400).json({ error: 'File is required (field: file)' });

    const mime = req.file.mimetype || 'application/pdf';
    const dataUri = `data:${mime};base64,${req.file.buffer.toString('base64')}`;

    // Upload PDF/doc to Cloudinary as raw/auto
    const uploadResult = await cloud.uploadDataUri(dataUri, { resource_type: 'auto' });

    const payload = {
      lessonId: req.body.lessonId,
      title: req.body.title,
      fileType: req.body.fileType || 'pdf',
      fileUrl: uploadResult.secure_url,
      filePublicId: uploadResult.public_id,
    };

    const material = await Material.create(payload);
    return res.status(201).json(material);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};

exports.listMaterials = async (req, res) => {
  try {
    const filter = req.query.lessonId ? { lessonId: req.query.lessonId } : {};
    const materials = await Material.find(filter).lean();
    return res.status(200).json(materials);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

exports.getMaterial = async (req, res) => {
  try {
    const material = await Material.findById(req.params.id).lean();
    if (!material) return res.status(404).json({ error: 'Material not found' });
    return res.status(200).json(material);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

exports.updateMaterial = async (req, res) => {
  try {
    const allowed = (({ title, fileType, fileUrl }) => ({ title, fileType, fileUrl }))(req.body);
    const material = await Material.findByIdAndUpdate(req.params.id, allowed, { new: true, runValidators: true });
    if (!material) return res.status(404).json({ error: 'Material not found' });
    return res.status(200).json(material);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};

exports.deleteMaterial = async (req, res) => {
  try {
    const material = await Material.findByIdAndDelete(req.params.id);
    if (!material) return res.status(404).json({ error: 'Material not found' });
    try {
      if (material.filePublicId) await cloud.destroy(material.filePublicId, { resource_type: 'auto' });
    } catch (e) {
      console.error('Cloudinary delete error (material):', e.message || e);
    }
    return res.status(200).json({ message: 'Material deleted' });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
