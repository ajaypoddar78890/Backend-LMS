// multerConfig.js
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

// Get the directory name of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Set the storage engine
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../uploads")); // Specify the destination folder
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname); // Use the original file name
  },
});

// Check file type
const checkFileType = (file, cb) => {
  // Allowed ext
  const filetypes = /zip/;
  // Check ext
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  // Check mime
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb("Error: ZIP files only!");
  }
};

// Init upload
const upload = multer({
  storage,
  limits: { fileSize: 100000000 }, // Limit file size to 100MB
  fileFilter: (req, file, cb) => {
    checkFileType(file, cb);
  },
});

export default upload;
