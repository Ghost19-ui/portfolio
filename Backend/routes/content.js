const express = require('express');
const router = express.Router();
const Skill = require('../models/Skill');
const Blog = require('../models/Blog');

// === SKILLS ENDPOINTS ===

// Get all skills
router.get('/skills', async (req, res) => {
  try {
    const skills = await Skill.find().sort({ createdAt: 1 });
    res.json(skills);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// Add a Skill (Smart Update)
router.post('/skills', async (req, res) => {
  const { category, name, level } = req.body;
  try {
    // Check if category exists
    let skillDoc = await Skill.findOne({ category });

    if (skillDoc) {
      // Add to existing category
      skillDoc.skills.push({ name, level });
      await skillDoc.save();
      res.status(200).json(skillDoc);
    } else {
      // Create new category
      const newDoc = await Skill.create({
        category,
        skills: [{ name, level }]
      });
      res.status(201).json(newDoc);
    }
  } catch (err) { res.status(400).json({ error: err.message }); }
});

// Delete a specific skill from a category
router.delete('/skills/:categoryId/:skillId', async (req, res) => {
  try {
    await Skill.updateOne(
      { _id: req.params.categoryId },
      { $pull: { skills: { _id: req.params.skillId } } }
    );
    res.json({ message: 'Skill removed' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// Delete entire category
router.delete('/skills/:id', async (req, res) => {
  try { await Skill.findByIdAndDelete(req.params.id); res.json({ message: 'Deleted' }); } 
  catch (err) { res.status(500).json({ error: err.message }); }
});

// === BLOG ENDPOINTS ===

router.get('/blogs', async (req, res) => {
  try { const blogs = await Blog.find().sort({ createdAt: -1 }); res.json(blogs); } 
  catch (err) { res.status(500).json({ error: err.message }); }
});

router.post('/blogs', async (req, res) => {
  try { const blog = await Blog.create(req.body); res.status(201).json(blog); } 
  catch (err) { res.status(400).json({ error: err.message }); }
});

router.delete('/blogs/:id', async (req, res) => {
  try { await Blog.findByIdAndDelete(req.params.id); res.json({ message: 'Deleted' }); } 
  catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;