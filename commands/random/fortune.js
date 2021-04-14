module.exports = {
    name: 'fortune',
    description: 'Gives you a fortune',
    cooldown: 4,
    execute() {
        let fortunes = ["For the next coming bot war, you should be on the side of Minco Penguin", "Thanos will come alive again and *snap*", "Tomorrow you will wake up with a cockroach under your pillow", "Your internet will break down tomorrow", "There will be **no** tomorrow", "You will grow a mustache tomorrow (if you are a boy)"]

        let random = Math.floor(Math.random() * fortunes.length)
        return fortunes[random];
    }
}