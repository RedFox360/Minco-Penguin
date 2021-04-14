module.exports = {
    name: 'yeeyeet',
    description: 'Yees + Yeets = The Future of Memes!',
    execute(message) {
        let yeets = ['https://tenor.com/view/yeet-lion-king-simba-rafiki-throw-gif-16194362', 'https://tenor.com/view/see-ya-ya-yeet-ash-chucks-pikachu-im-sick-of-you-now-throw-gif-16987702', 'https://tenor.com/view/rainbow-yeet-gif-14521966', 'https://tenor.com/view/yeet-colorful-gif-15791260']
        let yees = ['https://tenor.com/view/yee-yeedinasour-dinasour-gif-4930781', 'https://tenor.com/view/yee-dinosaur-meme-smile-gif-15696659', 'https://tenor.com/view/yeet-yee-yeee-meme-gif-13537661'];

        let random1 = Math.floor(Math.random() * yees.length);
        message.channel.send(yees[random1]);
        let random2 = Math.floor(Math.random() * yeets.length);
        message.channel.send(yeets[random2]);
    }
}