const { MessageEmbed } = require("discord.js");
module.exports = {
  name: 'embed',
  description: 'Sends an embed to a channel',
  usage: '!embed <Title> <Description>',
  async execute(message, args) {
    let td = args.join(' ').split('|');
    let embed = new MessageEmbed()
      .setTitle(td[0])
      .setDescription(td[1])
    message.channel.send(embed);
  }
}