module.exports = {
    conf: {
      aliases: ["link","url"],
      name: "link",
      help: "link"
    },
  
run: async (client, message, args, embed, prefix) => {
if(!message.guild.vanityURLCode) return message.channel.send({ content:"Sunucuda bir özel url yok."});
const url = await message.guild.fetchVanityData();

message.channel.send({ content: `discord.gg/${message.guild.vanityURLCode}\n\`Toplam kullanım:\` **${url.uses}**`})
},
  };
