const Project = require('../models/Project');
const path = require('path');
const fs = require('fs');
const puppeteer = require('puppeteer');

const createProject = async (req, res) => {
  const { userId, projectName } = req.body;
  try {
    // First, create the project in the database
    const project = await Project.create({ userId, projectName, files: [] });
    res.status(201).json({ message: 'Project created successfully', projectId: project._id });
  } catch (error) {
    console.error('Error creating project:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const uploadFiles = async (req, res) => {
  const { userId, projectId } = req.body;

  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ message: 'No files uploaded' });
  }

  const currentYear = new Date().getFullYear();
  const userDir = path.join('uploads', `uploads${currentYear}`, userId, projectId);

  try {
    // Ensure the directory exists
    if (!fs.existsSync(userDir)) {
      fs.mkdirSync(userDir, { recursive: true });
    }

    // Move the uploaded files to the correct directory
    const files = req.files.map(file => {
      const newPath = path.join(userDir, file.originalname);
      fs.renameSync(file.path, newPath);
      return newPath;
    });

    console.log('Files moved to:', userDir);

    const mainFile = files.find(file => file.endsWith('.html'));
    const hasJsFile = files.some(file => file.endsWith('.js'));

    if (mainFile && !hasJsFile) {
      const browser = await puppeteer.launch();
      const page = await browser.newPage();
      await page.goto(`file://${path.resolve(mainFile)}`);
      const previewPath = path.join(userDir, 'preview.png');
      await page.screenshot({ path: previewPath });
      files.push(previewPath);
      await browser.close();
    } else if (mainFile && hasJsFile) {
      const previewPath = path.join(userDir, 'preview.png');
      fs.copyFileSync(path.join(__dirname, '../assets/previewIMG.png'), previewPath);
      files.push(previewPath);
    }

    // Update the project with the file paths
    const project = await Project.findById(projectId);
    project.files = files;
    await project.save();

    console.log('Project updated with files:', project);
    res.status(201).json({ message: 'Files uploaded successfully', project });
  } catch (error) {
    console.error('Error uploading files:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const getProject = async (req, res) => {
  const { userId, projectId } = req.params;
  try {
    const project = await Project.findOne({ userId, _id: projectId });
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    res.json(project);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const getUserProjects = async (req, res) => {
  const { userId } = req.params;
  try {
    const projects = await Project.find({ userId }).sort({ updatedAt: -1 });
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const deleteProject = async (req, res) => {
  const { projectId } = req.params;
  try {
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Delete project files from the filesystem
    const projectYear = new Date(project.createdAt).getFullYear();
    const projectDir = path.join('uploads', `uploads${projectYear}`, project.userId.toString(), projectId);
    if (fs.existsSync(projectDir)) {
      fs.rmSync(projectDir, { recursive: true, force: true });
    }

    // Delete the project from the database
    await Project.findByIdAndDelete(projectId);

    res.status(200).json({ message: 'Project deleted successfully' });
  } catch (error) {
    console.error('Error deleting project:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { createProject, uploadFiles, getProject, getUserProjects, deleteProject };
