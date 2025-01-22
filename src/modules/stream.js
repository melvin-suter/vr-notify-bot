
import { setTimestamps, getTimestamps } from './timestamps.js';

export const checkLiveStream = async (youtube, channel, channelID) => {

    // Prepare
    let lastVideoTimestamps = getTimestamps('stream');
    const possibleMessages = [
        "$channel$ is live! Join in now: $link$",
        "Did you see? $channel$ is streaming. \n$link$",
        "YEEEEAH! A new live from $channel$.\n$link$",
    ];

    const response = await youtube.search.list({
        channelId: channelID,
        part: 'snippet',
        order: 'date',
        eventType: 'stream',
        type: 'video',
        maxResults: 1
    });

    const video = response.data.items[0];
    const videoId = video.id.videoId;
    const videoTitle = video.snippet.title;
    const videoPublishedAt = new Date(video.snippet.publishedAt).getTime();

    if (
        !lastVideoTimestamps[channelID] ||
        videoPublishedAt > lastVideoTimestamps[channelID]
    ) { // Video has been posted since last run

        // Set new Timestamp
        lastVideoTimestamps[channelID] = videoPublishedAt;

        // Get a random message
        const message = possibleMessages[Math.floor(Math.random() * possibleMessages.length)];
        
        // Send Message
        await channel.send(
            message.replace('$channel$',video.snippet.channelTitle).replace('$link$',`[${videoTitle}](https://www.youtube.com/watch?v=${videoId})`)
        );

        // Save timestamps
        setTimestamps("stream",lastVideoTimestamps);
    }
};
