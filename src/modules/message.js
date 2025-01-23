export const  sendVideoMessage = async(guild, videoTitle, videoId, videoAuthor) => {

    const possibleMessages = [
        "$channel$ dropped a new video. Check it out here: $link$",
        "Look at that! $channel$ has done a video. Go watch it.\n$link$",
        "YEEEEAH! A new vid from $channel$.\n$link$",
    ];

    const channel = guild.channels.cache.get(DISCROD_VIDEO_CHANNEL_ID);

    // Get a random message
    const message = possibleMessages[Math.floor(Math.random() * possibleMessages.length)];
        
    // Send Message
    await channel.send(
        message.replace('$channel$',videoAuthor).replace('$link$',`[${videoTitle}](https://www.youtube.com/watch?v=${videoId})`)
    );

};


export const  sendLiveMessage = async(guild, videoTitle, videoId, videoAuthor) => {

    const possibleMessages = [
        "$channel$ dropped a new video. Check it out here: $link$",
        "Look at that! $channel$ has done a video. Go watch it.\n$link$",
        "YEEEEAH! A new vid from $channel$.\n$link$",
    ];

    const channel = guild.channels.cache.get(DISCROD_VIDEO_CHANNEL_ID);

    // Get a random message
    const message = possibleMessages[Math.floor(Math.random() * possibleMessages.length)];
        
    // Send Message
    await channel.send(
        message.replace('$channel$',videoAuthor).replace('$link$',`[${videoTitle}](https://www.youtube.com/watch?v=${videoId})`)
    );

};