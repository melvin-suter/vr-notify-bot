import * as puppeteer from 'puppeteer';
import axios from 'axios';

export const getVideoType = async (videoID) => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    try{


        // Looking for <meta itemprop="isLiveBroadcast" content="True">
        await page.goto('https://www.youtube.com/watch?v=' + videoID, {waitUntil: 'networkidle2'});
        const liveStream = await page.evaluate(() => {
            const liveMeta = document.querySelector('meta[itemprop="isLiveBroadcast"]');
            return liveMeta ? liveMeta.getAttribute('content') === 'True' : false;
        });

        if(liveStream) { return "live"};

        
        // Checking if it's a short
        const shortResponse = await axios.head('https://www.youtube.com/shorts/' + videoID, {
            validateStatus: () => true,
            maxRedirects: 3,
        });
        let endURL = shortResponse.request.res.responseUrl;
        if(endURL.startsWith('https://www.youtube.com/shorts/')) { return "short"};


        return "video";
        
    } catch (error) {
        console.error('Error checking live stream:', error);
        await browser.close();
        throw error;
    }
    throw "stuff";
};