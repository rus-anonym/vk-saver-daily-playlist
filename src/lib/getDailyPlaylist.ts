import { API } from "vk-io";

export default async function getDailyPlaylist(api: API) {
	const musicSections = (await api.call("catalog.getAudio", {})).catalog
		.sections;

	const forYouSection = musicSections.find(
		(x: { title: string }) => x.title === "Для вас",
	);

	const playlistsRecommended = (
		await api.call("catalog.getSection", {
			section_id: forYouSection.id,
		})
	).section.blocks.find(
		(x: { ref: string }) => x.ref === "audio:for_you:playlists_recoms",
	).playlists_ids;

	return playlistsRecommended[0];
}
