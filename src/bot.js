import { Client, GatewayIntentBits } from 'discord.js';
import { google } from 'googleapis';
import { checkFullVideo } from './modules/video.js';
import { checkLiveStream } from './modules/stream.js';


// Discord bot setup
const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages],
});

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY; // Replace with your YouTube Data API key
const DISCORD_BOT_TOKEN = process.env.DISCORD_BOT_TOKEN; // Replace with your Discord bot token
const DISCROD_VIDEO_CHANNEL_ID = process.env.DISCROD_VIDEO_CHANNEL_ID; // Replace with the Discord channel ID where notifications will be sent
const DISCORD_GUILD_ID = process.env.DISCORD_GUILD_ID; // Replace with the Discord channel ID where notifications will be sent
const POLL_INTERVAL = 60000; // Check every minute

// List of YouTube channel IDs to monitor
const YOUTUBE_CHANNEL_IDS = [
    'UCB3kT8dBQGIQy80kf80jBdw', // Melon
    'UCUMcq-86irJHQNB0Ril1Ykw', // Bik
    'UCMWzAi8fQtqxl86W7tT-mPQ', // Eric
    'UCXa_IA4ecqDO2AjfGFog_MQ' // Jaff
];

// Start Youtube
const youtube = google.youtube({
    version: 'v3',
    auth: YOUTUBE_API_KEY,
});


async function runCicle() {
    const guild = client.guilds.cache.get(DISCORD_GUILD_ID);
    const channel = guild.channels.cache.get(DISCROD_VIDEO_CHANNEL_ID);
    if (!channel) {
        console.log("channel not found");
        return;
    }

    for (const channelId of YOUTUBE_CHANNEL_IDS) {
        try {
            await checkFullVideo(youtube,channel, channelId);
            //await checkLiveStream(youtube,channel, channelId);
        } catch (error) {
            console.error(`Error fetching videos for channel ${channelId}:`, error);
        }
    }
}


client.once('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);

    // Start polling for new videos
    runCicle();
    setInterval(runCicle, POLL_INTERVAL);
});

client.login(DISCORD_BOT_TOKEN);
