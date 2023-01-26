import RewardCategory from "../models/rewardCategory";

// find all
export function findAll() {
	return RewardCategory.find({});
}
//find by id
export function findById(id) {
	return RewardCategory.findById(id);
}
//create
export function create(name, description, image) {
	return RewardCategory.create({
		name,
		description,
		image,
	});
}
//save
export function save(rewardCategory) {
	return rewardCategory.save();
}
//delete
export function deleteById(id) {
	return RewardCategory.findByIdAndRemove(id);
}
//update
export function update(id, name, description, image) {
	return RewardCategory.findByIdAndUpdate(id, {
		name,
		description,
		image,
	});
}
//find by name
export function findByName(name) {
	return RewardCategory.findOne({ name });
}
//delete reward in category
export function deleteRewardInCategory(rewardId, categoryId) {
	return RewardCategory.findByIdAndUpdate(categoryId, {
		$pull: { rewards: rewardId },
	});
}
