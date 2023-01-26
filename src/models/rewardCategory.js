import mongoose from "mongoose";

const rewardCategorySchema = new mongoose.Schema({
	name: { type: String, default: null },
	description: { type: String, default: null },
	image: { type: String, default: null },
	rewards: { type: [mongoose.ObjectId], default: [] },
	created_at: { type: Date, default: Date.now },
	updated_at: { type: Date, default: Date.now },
});

const RewardCategory = mongoose.model("RewardCategory", rewardCategorySchema);

export default RewardCategory;
