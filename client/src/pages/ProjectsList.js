import React, { useEffect, useState } from 'react';
import axios from '../axios';
import { Link, useNavigate } from 'react-router-dom';
import { FaCopy, FaShareAlt, FaEllipsisV } from 'react-icons/fa';

const ProjectsList = () => {
  const [projects, setProjects] = useState([]);
  const [projectName, setProjectName] = useState('');
  const [files, setFiles] = useState([]);
  const [showUploadForm, setShowUploadForm] = useState(false);
  const navigate = useNavigate();

  const fetchProjects = async () => {
    const data = JSON.parse(localStorage.getItem('userInfo'));
    try {
      console.log(data);
      const res = await axios.get(`/projects/user/${data.id}`);
      setProjects(res.data);
      // console.log(res.data);
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/', { replace: true });
      return;
    } else {
      fetchProjects();
    }
  }, []);

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    const validFiles = selectedFiles.filter(file =>
      file.name.endsWith('.html') || file.name.endsWith('.css') || file.name.endsWith('.js') ||
      file.name.endsWith('.jpg') || file.name.endsWith('.jpeg') || file.name.endsWith('.png') ||
      file.name.endsWith('.gif') || file.name.endsWith('.bmp') || file.name.endsWith('.svg')
    );
    if (validFiles.length !== selectedFiles.length) {
      alert('Only .html, .css, .js, and image files are allowed.');
    }
    setFiles(validFiles);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = JSON.parse(localStorage.getItem('userInfo'));
    const projectData = { projectName, userId: data.id };

    try {
      const token = localStorage.getItem('token');
      // Step 1: Create the project
      const response = await axios.post('/projects/create', projectData, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      // console.log('Project created:', response.data);

      const projectId = response.data.projectId;

      // Step 2: Upload the files
      const formData = new FormData();
      formData.append('userId', data.id);
      formData.append('projectId', projectId);
      for (let i = 0; i < files.length; i++) {
        formData.append('files', files[i]);
      }

      // console.log('FormData:', formData.getAll('userId'), formData.getAll('projectId'), formData.getAll('files'));

      await axios.post('/projects/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        }
      });
      console.log('Files uploaded successfully');

      alert('Project uploaded successfully');
      setShowUploadForm(false);
      setProjectName('');
      setFiles([]);
      fetchProjects();
    } catch (error) {
      console.error('Error uploading project:', error.response || error.message);
      alert('Error uploading project. Please try again.');
    }
  };

  const handleCopyLink = (projectId, createdAt, userId) => {
    const year = new Date(createdAt).getFullYear();
    const link = `http://localhost:5000/uploads/uploads${year}/${userId}/${projectId}/index.html`;
    navigator.clipboard.writeText(link);
    alert('Project link copied to clipboard!');
  };

  const handleShareLink = (projectId, createdAt, userId) => {
    const year = new Date(createdAt).getFullYear();
    const link = `http://localhost:5000/uploads/uploads${year}/${userId}/${projectId}/index.html`;
    if (navigator.share) {
      navigator.share({
        title: 'Check out this project!',
        url: link,
      }).catch((error) => console.error('Error sharing:', error));
    } else {
      alert('Sharing is not supported in your browser.');
    }
  };

  const handleDeleteProject = async (projectId) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`/projects/${projectId}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        alert('Project deleted successfully!');
        fetchProjects();
      } catch (error) {
        console.error('Error deleting project:', error);
        alert('Failed to delete the project. Please try again.');
      }
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-extrabold text-gray-800 mb-2">Your Projects Dashboard</h1>
        <p className="text-gray-600">Manage and showcase your projects effortlessly.</p>
      </div>

      <div className="text-center mb-6">
        <button
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded shadow transition duration-300"
          onClick={() => setShowUploadForm(true)}
        >
          + Upload New Project
        </button>
      </div>

      {showUploadForm && (
        <div className="bg-white p-6 rounded-lg shadow-lg mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Upload New Project</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <label className="block text-gray-700 font-medium mb-2">Project Name</label>
            <input
              type="text"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              placeholder="Enter Project Name"
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <label className="block text-gray-700 font-medium mb-2">Upload Files</label>
            <input
              type="file"
              multiple
              onChange={handleFileChange}
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="flex justify-end space-x-4">
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded shadow transition duration-300"
              >
                Upload
              </button>
              <button
                type="button"
                onClick={() => setShowUploadForm(false)}
                className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-6 rounded shadow transition duration-300"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <hr className="my-8 border-gray-300" />

      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Your Projects</h2>
        <p className="text-gray-600">Browse through your uploaded projects below.</p>
      </div>

      <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <li key={project._id} className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition duration-300 border border-gray-200 relative">
            <Link to={`http://localhost:5000/uploads/uploads${new Date(project.createdAt).getFullYear()}/${project.userId}/${project._id}`} className="block">
              <img
                src={`http://localhost:5000/uploads/uploads${new Date(project.createdAt).getFullYear()}/${project.userId}/${project._id}/preview.png`}
                alt={project.projectName}
                className="rounded-lg mb-4 w-full object-cover"
              />
              <h2 className="text-lg font-bold text-gray-800">{project.projectName}</h2>
              <p className="text-sm text-gray-500">Project ID: {project._id}</p>
              <p className="text-sm text-gray-500">Files: {project.files.length}</p>
              <p className="text-sm text-gray-500">Last updated: {new Date(project.updatedAt).toLocaleString('en-IN', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' })}</p>
            </Link>
            <div className="mt-4 flex justify-between items-center">
              <button
                onClick={() => handleCopyLink(project._id, project.createdAt, project.userId)}
                className="flex items-center text-blue-500 hover:text-blue-700 transition duration-300"
              >
                <FaCopy className="mr-2" /> Copy Link
              </button>
              <button
                onClick={() => handleShareLink(project._id, project.createdAt, project.userId)}
                className="flex items-center text-green-500 hover:text-green-700 transition duration-300"
              >
                <FaShareAlt className="mr-2" /> Share
              </button>
            </div>
            <div className="absolute top-2 right-2 border border-gray-200 rounded-full bg-white shadow-lg">
              <div className="relative group">
                <button className="text-gray-500 hover:text-gray-700 bg-fuchsia-100 p-2 rounded-full focus:outline-none border border-gray-200">
                  <FaEllipsisV />
                </button>
                <div className="hidden group-hover:block absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                  <button
                    onClick={() => handleDeleteProject(project._id)}
                    className="block w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-100"
                  >
                    Delete
                  </button>
                  <button
                    onClick={() => alert('Edit functionality coming soon!')}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => alert('More options coming soon!')}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    More Options
                  </button>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProjectsList;
