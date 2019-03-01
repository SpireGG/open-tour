const TwitchClient = require('twitch').default;

const clientId = '1q7edsgvalfat0zes1mbmutmfhb2dx';
const accessToken = 'fzqwgitpg01shmkxsvo9ifghes1d9l';
const twitchClient = TwitchClient.withCredentials(clientId, accessToken);

exports.isStreamLive = async (userName) => {
	const user = await twitchClient.users.getUserByName(userName);
	if (!user) {
		return false;
	}
	return await twitchClient.streams.getStreamByChannel(user.id) !== null;
};

exports.getStream = async (id) => {
	const user = await twitchClient.users.getUserByName(id);
	if (!user) {
		return false;
	}
	return await twitchClient.streams.getStreamByChannel(user.id);
};

exports.twitchClient = twitchClient;
