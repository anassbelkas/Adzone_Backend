import Reward from "../models/reward";

//find all rewards for a category
export function findAllRewardsForCategory(categoryId) {
	return Reward.find({ category: categoryId });
}
//find all rewards
export function findAllRewards() {
	return Reward.find({});
}
//find reward by id
export function findRewardById(rewardId) {
	return Reward.findById(rewardId);
}
//create reward
export function createReward(
	name,
	description,
	image,
	points,
	quantity,
	category
) {
	return Reward.create({
		name,
		description,
		image,
		points,
		quantity,
		category,
	});
}
//save reward
export function saveReward(reward) {
	return reward.save();
}
//delete reward
export function deleteReward(rewardId) {
	return Reward.findByIdAndRemove(rewardId);
}
//update reward
export function updateReward(
	rewardId,
	name,
	description,
	image,
	points,
	quantity,
	category
) {
	return Reward.findByIdAndUpdate(rewardId, {
		name,
		description,
		image,
		points,
		quantity,
		category,
	});
}
//find reward by name
export function findRewardByName(name) {
	return Reward.findOne({ name });
}
// get active rewards
export function getActiveRewards() {
	return Reward.find({ active: true });
}

// get recentaly created rewards
export function getRecentlyCreatedRewards() {
	return Reward.find({}).sort({ created_at: -1 }).limit(5);
}
