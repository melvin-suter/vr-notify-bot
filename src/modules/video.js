
import { getVideoType } from './get-video-type.js';
import { setTimestamps, getTimestamps } from './timestamps.js';
import { parseStringPromise } from 'xml2js';

export const checkFullVideo = async (youtube, channel, channelID) => {

    // Prepare
    let lastVideoTimestamps = getTimestamps('full-video');
    const possibleMessages = [
        "$channel$ dropped a new video. Check it out here: $link$",
        "Look at that! $channel$ has done a video. Go watch it.\n$link$",
        "YEEEEAH! A new vid from $channel$.\n$link$",
    ];

    const RSS_FEED_URL = `https://www.youtube.com/feeds/videos.xml?channel_id=${channelID}`;
    const RSS_RAW_DATA = await (await fetch(RSS_FEED_URL)).text();
    const rssData = await parseStringPromise(RSS_RAW_DATA);

    const latestVideo = rssData.feed.entry[0];
    const videoId = latestVideo['yt:videoId'][0];
    const videoTitle = latestVideo.title[0];
    const videoPublishedAt = new Date(latestVideo.published[0]).getTime();
    const videoType = await getVideoType(videoId);

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
            message.replace('$channel$',latestVideo.author[0].name).replace('$link$',`[${videoTitle}](https://www.youtube.com/watch?v=${videoId})`)
        );

        // Save timestamps
        setTimestamps("full-video",lastVideoTimestamps);
    }
};
