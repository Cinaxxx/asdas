const { Discord, MessageEmbed, MessageAttachment, ClientUser } = require("discord.js");
const dolar = require("../../schemas/dolar");
const { altin2 } = require("../../configs/emojis.json");

module.exports = {
    conf: {
      aliases: ["bakiyem","param","para","money"],
      name: "bakiye",
      help: "bakiye"
    },

    run: async (client, message, args,embed) => {
let member = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.author;
let dolarData = await dolar.findOne({ guildID: message.guild.id, userID: member.id });  
if (!dolarData || dolarData && !dolarData.dolar) return await message.channel.send({ content:"Komutu kullanabilmek için Hesap oluşturmanız gerekmektedir. \`!hesapoluştur\`"})
  message.channel.send({ content: `${member} kişisinin <:coin:1032335966758768740> **${dolarData ? Math.floor(parseInt(dolarData.dolar)) : 0}** Coini var`})
}
    }