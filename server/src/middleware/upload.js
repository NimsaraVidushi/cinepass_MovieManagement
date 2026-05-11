import multer from "multer";
import path from "path";
import fs from "fs";

const uploadDir = "uploads/posters";
fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadDir);
  },
  filename: (_req, file, cb) => {
    const extension = path.extname(file.originalname);
    const sanitizedName = file.originalname
      .replace(extension, "")
      .replace(/[^a-zA-Z0-9_-]/g, "-")
      .toLowerCase();
    cb(null, `${Date.now()}-${sanitizedName}${extension}`);
  }
});

const imageFileFilter = (_req, file, cb) => {
  const allowed = ["image/jpeg", "image/png", "image/webp"];
  if (!allowed.includes(file.mimetype)) {
    cb(new Error("Only JPG, PNG, and WEBP poster images are allowed."));
    return;
  }
  cb(null, true);
};

export const uploadPoster = multer({
  storage,
  fileFilter: imageFileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }
});
