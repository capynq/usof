import { ERROR_CODES } from "../constants/errorCodes.js";
import multer from "multer";
import { AppError } from "../errors/AppError.js";

export const uploadAvatar = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 2 * 1024 * 1024, files: 1, fields: 0, parts: 2 },
  fileFilter(request, file, callback) {
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.mimetype))
      return callback(
        new AppError(
          400,
          ERROR_CODES.VALIDATION_ERROR,
          "Avatar must be JPEG, PNG or WebP",
        ),
      );
    callback(null, true);
  },
}).single("avatar");
