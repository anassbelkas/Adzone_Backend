import mongoose from "mongoose";

// rewardSchema with popularity and reward

		





const rewardSchema = new mongoose.Schema({
	name: { type: String, default: null },
	description: { type: String, default: null },
	image: { type: String, default: null },
	points: { type: Number, default: null },
	quantity: { type: Number, default: null },
	category: { type: mongoose.ObjectId, default: null },
	active: { type: Boolean, default: true },
	
	created_at: { type: Date, default: Date.now },
	updated_at: { type: Date, default: Date.now },
});

const Reward = mongoose.model("Reward", rewardSchema);
export default Reward;
