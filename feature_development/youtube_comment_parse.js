/*
node youtube_comment_parse.js "https://www.youtube.com/watch?v=LOmod3V9pZw"
*/

const htmlparser2 = require('htmlparser2');
const https = require('https');

async function getChannelIdFromVideo(videoUrl) {
    try {
        // Validate URL
        const videoId = extractVideoId(videoUrl);
        if (!videoId) {
            throw new Error('Invalid YouTube URL');
        }

        const html = await fetchVideoPage(videoUrl);
        return extractChannelId(html);
    } catch (error) {
        console.error('Error:', error.message);
        return null;
    }
}

function extractVideoId(url) {
    const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
}

function fetchVideoPage(url) {
    return new Promise((resolve, reject) => {
        https.get(url, (response) => {
            let data = '';
            response.on('data', (chunk) => data += chunk);
            response.on('end', () => resolve(data));
            response.on('error', reject);
        }).on('error', reject);
    });
}

function extractChannelId(html) {
    let channelId = null;
    
    const parser = new htmlparser2.Parser({
        onopentag(name, attributes) {
            // Look for meta tag with channel ID
            if (name === 'meta' && attributes.itemprop === 'channelId') {
                channelId = attributes.content;
            }
        }
    });

    parser.write(html);
    parser.end();

    return channelId;
}

module.exports = {
    getChannelIdFromVideo
};

if (require.main === module) {
    const videoUrl = process.argv[2];
    if (!videoUrl) {
        console.error('Please provide a YouTube URL as an argument');
        process.exit(1);
    }

    getChannelIdFromVideo(videoUrl)
        .then(channelId => {
            if (channelId) {
                console.log('Channel ID:', channelId);
            } else {
                console.log('Could not find channel ID');
            }
        })
        .catch(error => {
            console.error('Error:', error.message);
            process.exit(1);
        });
}
