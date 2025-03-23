const multer = require('multer');
const path = require('path');
const fs = require('fs');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const userId = req.body.userId;
    const projectId = req.body.projectId;
    const currentYear = new Date().getFullYear();
    const userDir = path.join('uploads', `uploads${currentYear}`, userId, projectId);
    if (!fs.existsSync(userDir)) {
      fs.mkdirSync(userDir, { recursive: true });
    }
    cb(null, userDir);
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  }
});

const upload = multer({ storage });

module.exports = upload;
