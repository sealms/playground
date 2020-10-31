const wa = require('@open-wa/wa-automate');

function startBOT() {
    return wa.create('bot', {
        executablePath: "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
        headless: false,
        bypassCSP: true,
        autoRefresh: true,
    })
        .then(async client => {
            start(client);
        })
        .catch(async err => {
            console.log(err)
        })
};

async function start(client) {

    client.onMessage(async message => {

        if (message.type == 'image' && message.caption == '#stiker') {
            const mediaData = await wa.decryptMedia(message);
            const imageBase64 = `data:${message.mimetype};base64,${mediaData.toString(
                'base64'
            )}`;
            try {
                const a = await client.sendImageAsSticker(message.from, imageBase64)
            } catch (err) {
                await client.sendText(message.from, 'Foto tidak valid, coba kirim ulang foto dengan sedikit dicrop.')
            }
        } else if (message.body == '#stiker') {
            if (message.quotedMsgObj == null) {
                await client.sendText(message.from, 'Maaf, tidak ditemukan foto.')
            } else
                if (message.quotedMsgObj !== null) {
                    if (message.quotedMsgObj.type == 'image') {
                        try {
                            const mediaData = await wa.decryptMedia(message.quotedMsgObj);
                            const imageBase64 = `data:${message.quotedMsgObj.mimetype};base64,${mediaData.toString(
                                'base64'
                            )}`;
                            try {
                                const a = await client.sendImageAsSticker(message.from, imageBase64)
                            } catch (err) {
                                await client.sendText(message.from, 'Foto tidak valid, coba kirim ulang foto dengan sedikit dicrop.')
                            }


                        } catch (err) {
                            console.log(err)
                        }

                    } else {
                        await client.sendText(message.from, 'Maaf, tidak ditemukan foto.')
                    }
                }
        }
    })
}

startBOT();