const Course = require('../models/Course');

exports.createCourse = async (req, res) => {
  try {
    const course = await Course.create(req.body);
    return res.status(201).json(course);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};

exports.listCourses = async (req, res) => {
  try {
    const courses = await Course.find().lean();
    return res.status(200).json(courses);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

exports.getCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id).lean();
    if (!course) return res.status(404).json({ error: 'Course not found' });
    return res.status(200).json(course);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
exports.getAllcourses = async(req,res)=>{
  try {
    const courses =  await Course.find().lean();
    return res.status(200).json(courses);
    
  } catch (error) {
    return res.status(500).json({ error: err.message });
  }
}
exports.updateCourse = async (req, res) => {
  try {
    const allowed = (({ title, description, category, level, thumbnailUrl, price, isPublished }) => 
      ({ title, description, category, level, thumbnailUrl, price, isPublished }))(req.body);
    const course = await Course.findByIdAndUpdate(req.params.id, allowed, { new: true, runValidators: true });
    if (!course) return res.status(404).json({ error: 'Course not found' });
    return res.status(200).json(course);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};

exports.deleteCourse = async (req, res) => {
  try {
    const course = await Course.findByIdAndDelete(req.params.id);
    if (!course) return res.status(404).json({ error: 'Course not found' });
    return res.status(200).json({ message: 'Course deleted' });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
