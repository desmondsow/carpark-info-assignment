import fs from 'fs';
import path from 'path';

/**
 * Middleware to validate uploaded file types
 * @param {string[]} allowedMimeTypes - Array of allowed MIME types
 * @param {string[]} allowedExtensions - Array of allowed file extensions (with dot)
 * @returns {Function} Express middleware function
 */
export function validateFileType(allowedMimeTypes, allowedExtensions) {
    return (req, res, next) => {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        // Check MIME type
        if (!allowedMimeTypes.includes(req.file.mimetype)) {
            // Clean up the uploaded file
            fs.unlinkSync(req.file.path);
            return res.status(415).json({ 
                error: `Only ${allowedExtensions.join(', ')} files are supported` 
            });
        }

        // Check file extension
        const fileExtension = path.extname(req.file.originalname).toLowerCase();
        if (!allowedExtensions.includes(fileExtension)) {
            // Clean up the uploaded file
            fs.unlinkSync(req.file.path);
            return res.status(415).json({ 
                error: `Only ${allowedExtensions.join(', ')} files are supported` 
            });
        }

        next();
    };
}
