
import { getVideoType } from './get-video-type.js';
import { sendMessage } from './message.js';
import { setTimestamps, getTimestamps } from './timestamps.js';
import { parseStringPromise } from 'xml2js';

export const checkFeed = async (youtube, guild,channelID) => {
    // Prepare
    let lastVideoTimestamps = getTimestamps('feed');

    const RSS_FEED_URL = `https://www.youtube.com/feeds/videos.xml?channel_id=${channelID}`;
    const RSS_RAW_DATA = await (await fetch(RSS_FEED_URL)).text();
    const rssData = await parseStringPromise(RSS_RAW_DATA);

    const latestVideo = rssData.feed.entry[0];
    const videoId = latestVideo['yt:videoId'][0];
    const videoTitle = latestVideo.title[0];
    const videoPublishedAt = new Date(latestVideo.published[0]).getTime();
    const videoType = await getVideoType(videoId);
    const videoAuthor = latestVideo.author[0].name;


    if (
        !lastVideoTimestamps[channelID] ||
        videoPublishedAt > lastVideoTimestamps[channelID]
    ) { // Video has been posted since last run


        // Set new Timestamp
        lastVideoTimestamps[channelID] = videoPublishedAt;
        let possibleMessages=[];
        let message = "";


        if(videoType === "short" ) {
            console.log(videoId, videoTitle, "is a short");
            possibleMessages = [
                "$channel$ just dropped a new short! $link$",
                "New short alert! $channel$ has a new video for you.\n$link$",
                "Don't miss the latest short from $channel$! $link$",
                "Short video time! Check out the newest from $channel$. $link$",
                "Look what $channel$ just uploaded! A new short is live.\n$link$",
                "🚨 $channel$ dropped a new short! 🚨 Check it out now: $link$",
                "New short from $channel$! $link$",
                "🔥 Hot off the press! 🔥 New short from $channel$. $link$",
                "Quick watch! $channel$ has a new short. $link$",
                "New short alert! $channel$ just uploaded a new video. $link$",
                "Don't sleep on this! 😴 New short from $channel$. $link$",
                "🎬 Short video action! 🎬 $channel$ has a new upload. $link$",
                "$channel$ just dropped a short! Watch it here: $link$",
                "New short incoming! 🚨 From $channel$. $link$",
                "Short video alert! 🚨 Check out the latest from $channel$. $link$",
                "👀 You won't want to miss this! 👀 New short from $channel$. $link$",
                "🔥 New short from $channel$ is live! 🔥 $link$",
                "🎬 Short video time! 🎬 From $channel$. $link$",
                "🚨 Don't miss it! 🚨 New short from $channel$. $link$",
                "$channel$ has a new short! $link$" 
              ];
                    
            // Get a random message
            message = possibleMessages[Math.floor(Math.random() * possibleMessages.length)];
            message = message.replace('$channel$',"**" + videoAuthor + "**");
            message = message.replace('$link$',`[${videoTitle}](https://www.youtube.com/shorts/${videoId})`);

            sendMessage(guild, process.env.DISCROD_SHORTS_CHANNEL_ID, message);
        } else if(videoType === "video" ) {
            console.log(videoId, videoTitle, "is a video");
            possibleMessages = [
                "$channel$ uploaded a new video! $link$",
                "New video from $channel$! Check it out: $link$",
                "Don't miss the latest video from $channel$. $link$",
                "New video alert! $channel$ has a new upload. $link$",
                "🎬 New video from $channel$! 🎬 $link$",
                "🔥 Check out the new video from $channel$! 🔥 $link$",
                "New video time! Watch the latest from $channel$. $link$",
                "A new video from $channel$ is live! $link$",
                "$channel$ just uploaded a new video! Watch now: $link$",
                "New video alert! 🚨 $channel$ has a new video for you. $link$",
                "Don't sleep on this! 😴 New video from $channel$. $link$",
                "🎬 New video from $channel$! 🎬 Watch it here: $link$",
                "🔥 Hot off the press! 🔥 New video from $channel$. $link$",
                "New video incoming! 🚨 From $channel$. $link$",
                "You don't want to miss this! 👀 New video from $channel$. $link$",
                "New video from $channel$ is live! $link$",
                "🎬 Don't miss the latest video from $channel$! $link$",
                "🚨 New video alert! $channel$ has a new video. $link$",
                "New video from $channel$! $link$", 
                "Check out the new video from $channel$! $link$" 
              ];
                    
            // Get a random message
            message = possibleMessages[Math.floor(Math.random() * possibleMessages.length)];
            message = message.replace('$channel$',"**" + videoAuthor + "**");
            message = message.replace('$link$',`[${videoTitle}](https://www.youtube.com/watch?v=${videoId})`);

            sendMessage(guild, process.env.DISCROD_VIDEO_CHANNEL_ID, message);
        } else if(videoType === "live" ) {
            console.log(videoId, videoTitle, "is a live");
            if(videoTitle.toLowerCase().indexOf('rendezvous') >= 0) { // Only alert for vape rendezvous
                
                possibleMessages = [
                    "🚨 Upcoming **Vape Rendezvous**! Don't miss our live stream this Sunday at 4 PM CEST / 9 AM EST. $link$",
                    "Get ready! 🔥 **Vape Rendezvous** is coming live this Sunday at 4 PM CEST / 9 AM EST. $link$",
                    "Upcoming: **Vape Rendezvous**! 👀 We will be live this Sunday at 4 PM CEST / 9 AM EST. $link$",
                    "⏰ Reminder: **Vape Rendezvous** live stream this Sunday at 4 PM CEST / 9 AM EST. $link$",
                    "**Vape Rendezvous** is coming soon! ⏰ We will be live this Sunday at 4 PM CEST / 9 AM EST. $link$",
                    "Don't miss the upcoming **Vape Rendezvous**! 🗓️ Live on $channel$'s channel this Sunday at 4 PM CEST / 9 AM EST. $link$",
                    "Mark your calendars! 🗓️ **Vape Rendezvous** live stream from $channel$ this Sunday at 4 PM CEST / 9 AM EST. $link$",
                    "👀 Upcoming **Vape Rendezvous**! Watch live this Sunday at 4 PM CEST / 9 AM EST with $channel$. $link$",
                    "**Vape Rendezvous** is happening soon! ⏰ Join us on $channel$ live this Sunday at 4 PM CEST / 9 AM EST. $link$",
                    "🔥 Get excited! Upcoming **Vape Rendezvous** live stream this Sunday at 4 PM CEST / 9 AM EST. $link$",
                    "Save the date! 🗓️ **Vape Rendezvous** live stream from $channel$ this Sunday at 4 PM CEST / 9 AM EST. $link$",
                    "⏰ Reminder: **Vape Rendezvous** live stream at $channel$ this Sunday at 4 PM CEST / 9 AM EST. $link$",
                    "👀 Don't miss it! 👀 Upcoming **Vape Rendezvous** live stream from us this Sunday at 4 PM CEST / 9 AM EST. $link$",
                    "**Vape Rendezvous** is coming soon! ⏰ Watch live this Sunday at 4 PM CEST / 9 AM EST. $link$",
                    "Get ready for **Vape Rendezvous**! 🔥 We will be live this Sunday at 4 PM CEST / 9 AM EST. $link$",
                    "Upcoming: **Vape Rendezvous** live stream this Sunday at 4 PM CEST / 9 AM EST. $link$",
                    "⏰ Reminder: **Vape Rendezvous** live stream at $channel$ this Sunday at 4 PM CEST / 9 AM EST. $link$",
                    "👀 Don't miss the upcoming **Vape Rendezvous**! Watch live this Sunday at 4 PM CEST / 9 AM EST. $link$",
                    "**Vape Rendezvous** is coming soon! ⏰ Join the live stream this Sunday at 4 PM CEST / 9 AM EST. $link$",
                    "🔥 Get excited for **Vape Rendezvous**! 🔥 Live this Sunday at 4 PM CEST / 9 AM EST. $link$"
                ];
                        
                // Get a random message
                message = possibleMessages[Math.floor(Math.random() * possibleMessages.length)];
                message = message.replace('$channel$',"**" + videoAuthor + "**");
                message = message.replace('$link$',`[${videoTitle}](https://www.youtube.com/watch?v=${videoId})`);

                sendMessage(guild, process.env.DISCROD_LIVE_CHANNEL_ID, message);
            }
        }


        // Save timestamps
        setTimestamps("feed",lastVideoTimestamps);   
    }
};