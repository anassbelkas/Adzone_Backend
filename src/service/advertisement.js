import Advertisement from "../models/advertisement";

// find all
export function findAll() {
	return Advertisement.find({});
}

//find all active ads
export function findAllActive() {
	return Advertisement.find({ active: true });
}

//create advertisement
export function createAdvertisement(
	name,
	description,
	price,
	image,
	active,
	video
) {
	return Advertisement.create({
		name,
		description,
		price,
		image,
		video,
		active: active,
	});
}
