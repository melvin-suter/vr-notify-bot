export const  sendMessage = async(guild, channelID, message) => {
    const channel = guild.channels.cache.get(channelID);
    if (!channel) {
        console.log("channel not found");
        return;
    }
    // Send Message
    await channel.send(message);

};
