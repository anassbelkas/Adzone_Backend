import multer from "multer";
import path from "path";

const imageStorage = multer.diskStorage({
	// Destination to store image
	destination: "public/images/",
	filename: (req, file, cb) => {
		cb(null, file.fieldname + "_" + Date.now() + ".webp");
	},
});

const imageUpload = multer({
	storage: imageStorage,
	limits: {
		fileSize: 1000000, // 1000000 Bytes = 1 MB
	},
	fileFilter(req, file, cb) {
		if (!file.originalname.match(/\.(png|jpg)$/)) {
			// upload only png and jpg format
			return cb(new Error("Please upload a Image"));
		}
		cb(undefined, true);
	},
});

export default imageUpload;
