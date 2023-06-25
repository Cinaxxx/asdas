const dolar = require("../../schemas/dolar");
const conf = require("../../configs/sunucuayar.json")

module.exports = {
  conf: {
    aliases: ["toppara","topara"],
    name: "topcoin",
    help: "topcoin"
  },
  
  run: async (client, message, args, embed) => { 
const dolarData = await dolar.find({ guildID: message.guild.id }).sort({ dolar: -1 });
let dolarSum = 0;
const dolarUsers = dolarData.splice(0, 10).map((x, index) => {
  dolarSum += x.dolar;
return `\`${index+1}.\` <@${x.userID}>: \`${Number(x.dolar).toLocaleString()} coin\``
}).join(`\n`);
message.channel.send({ embeds: [embed.setDescription(`
** ${message.guild} Toplam Coin Bilgileri: \`(Toplam ${dolarSum})\`**
${dolarUsers.length > 0 ? dolarUsers : "Veri Bulunmuyor."}
`)]})   
}}