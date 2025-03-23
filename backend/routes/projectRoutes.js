const express = require('express');
const { createProject, uploadFiles, getProject, getUserProjects, deleteProject } = require('../controllers/projectController');
const upload = require('../middleware/uploadMiddleware');

const router = express.Router();

router.post('/create', createProject);
router.post('/upload', upload.array('files'), uploadFiles);
router.get('/user/:userId', getUserProjects);
router.get('/:userId/:projectId', getProject);
router.delete('/:projectId', deleteProject);

module.exports = router;