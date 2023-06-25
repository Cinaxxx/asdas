const { MessageEmbed } = require("discord.js");
const afk = require("../../schemas/afk");
const moment = require("moment");
require("moment-duration-format");
moment.locale("tr");
const { green, red} = require("../../configs/emojis.json")
client = global.bot
module.exports = {
    conf: {
      aliases: ["afk"],
      name: "afk",
      help: "afk"
    },
  
run: async (client, message, args, embed, prefix) => {
if (message.member.displayName.includes("[AFK]")) return
const reason = args.join(" ") || "Belirtilmedi!";
await afk.findOneAndUpdate({ guildID: message.guild.id, userID: message.author.id }, { $set: { reason, date: Date.now() } }, { upsert: true });
message.react(green)
message.channel.send({ content:"Başarıyla afk moduna girdiniz! Bir şey yazana kadar [AFK] kalacaksınız."}).then((e) => setTimeout(() => { e.delete(); }, 10000)); 
if (message.member.manageable) message.member.setNickname(`[AFK] ${message.member.displayName}`);
}
  };
  
  client.on('messageCreate', async message => {
    if (message.author.bot || !message.guild) return;
    const data = await afk.findOne({ guildID: message.guild.id, userID: message.author.id });
    const embed = new MessageEmbed().setColor(message.member.diplayHexColor).setAuthor({ name: message.member.displayName, iconURL: message.author.displayAvatarURL({ dynamic: true })});
    if (data) {
      const afkData = await afk.findOne({ guildID: message.guild.id, userID: message.author.id });
      await afk.deleteOne({ guildID: message.guild.id, userID: message.author.id });
      if (message.member.displayName.includes("[AFK]") && message.member.manageable) await message.member.setNickname(message.member.displayName.replace("[AFK]", ""));
      message.channel.send({ content:`Afk modundan çıktınız. **${moment.duration(Date.now() - afkData.date).format("d [gün] H [saat], m [dakika] s [saniye]")}** süredir AFK'ydınız.`}).then((e) => setTimeout(() => { e.delete(); }, 5000)); 
    }
    
    const member = message.mentions.members.first();
    if (!member) return;
    const afkData = await afk.findOne({ guildID: message.guild.id, userID: member.user.id });
    if (!afkData) return;
    embed.setDescription(`${member.toString()} kullanıcısı, \`${afkData.reason}\` sebebiyle, **${moment.duration(Date.now() - afkData.date).format("d [gün] H [saat], m [dakika] s [saniye]")}** önce afk oldu!`);
    message.channel.send({ embeds: [embed]})
  })