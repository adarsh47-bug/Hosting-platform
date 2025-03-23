// import React, { useEffect, useState } from 'react';
// import { useParams } from 'react-router-dom';
// import axios from '../axios';

// const Project = () => {
//   const { userId, projectId } = useParams();
//   const [project, setProject] = useState(null);

//   useEffect(() => {
//     const fetchProject = async () => {
//       try {
//         const res = await axios.get(`/projects/${userId}/${projectId}`);
//         setProject(res.data);
//       } catch (error) {
//         console.error(error);
//       }
//     };
//     fetchProject();
//   }, [userId, projectId]);

//   useEffect(() => {
//     if (project && project.files.length > 0) {
//       const htmlFile = project.files.find(file => file.endsWith('.html'));
//       if (htmlFile) {
//         window.location.href = `http://localhost:5000/${htmlFile}`;
//       }
//     }
//   }, [project]);

//   return null; // No need to render anything
// };

// export default Project;
