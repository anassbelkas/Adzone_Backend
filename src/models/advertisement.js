import mongoose from "mongoose";

const advertisementSchema = new mongoose.Schema({
	name: { type: String, default: null },
	description: { type: String, default: null },
	image: { type: String, default: null },
	video: { type: String, default: null },
	created_at: { type: Date, default: Date.now },
	updated_at: { type: Date, default: Date.now },
	active: { type: Boolean, default: true },
});

const Advertisement = mongoose.model("Advertisement", advertisementSchema);
export default Advertisement;
