const { MessageEmbed, Discord } = require("discord.js");
const conf = require("../../configs/sunucuayar.json");
const ayar = require("../../configs/settings.json");
const { green, red, Jail } = require("../../configs/emojis.json")
const moment = require("moment");
moment.locale("tr");
const client = global.bot;

module.exports = {
  conf: {
    aliases: [],
    name: "şüphelibutton",
    owner: true,
  },

  run: async (client, message, args, embed) => {

    client.api.channels(message.channel.id).messages.post({
      data: {
        "content": `${Jail} Hoşgeldin, fakat... Nereye geldin böyle?

Sunucuda kanallara erişiminiz bulunmamakta çünkü hesabınız 7 günden yeni bir tarihte oluşturulmuş ve bu durumda sizi sunucuya kabul edemiyoruz. 
        
Sunucumuzun güvenliğini ve iç huzurunu önemsiyoruz. Hesabınızın oluşturulmasından itibaren geçen süre 7 günü geçtiyse ve sunucuya erişmek istiyorsanız sunucudan çık-gir yapınız. Yetkililerimize "beni buradan çıkarır mısın" gibi mesajlar atmayınız!`, "components": [{
          "type": 1, "components": [

            { "type": 2, "style": 4, "custom_id": "kontrol", "label": "Hesap Kontrol", "emoji": { "id": "916734243328114718" } },

          ]
        }]
      }
    })
  },
};

client.on('interactionCreate', async interaction => {

  const { green , red , star2} = require("../../configs/emojis.json")
  const ayarlar = require("../../configs/sunucuayar.json")
  const member = await client.guilds.cache.get(ayar.guildID).members.fetch(interaction.member.user.id)
  const members = await client.guilds.cache.get(ayar.guildID).members.fetch(interaction.member.user.id)

  let ay = moment(members.user.createdAt).format("MM");
  let gün = moment(members.user.createdAt).format("DD");
  let yıl = moment(members.user.createdAt).format("YYYY");
  let memberKuruluş = (`${gün}.${ay}.${yıl}`);

  const kurulus = new Date().getTime() - members.user.createdAt.getTime();  
  const time = moment.duration(kurulus).format(` YY **[Yıl,]** DD **[Gün,]** HH **[Saat,]** mm **[Dakika,]** ss **[Saniye]**`) 

const embed = new MessageEmbed ()
.setThumbnail(members.avatarURL)
.setDescription(`
Merhaba **${members}** (\`${members.id}\`)

Hesabının kuruluş tarihi: **${memberKuruluş}**
Hesabın <t:${Math.floor(members.user.createdTimestamp / 1000)}:R> önce kurulmuş
7 gün süreniz dolduktan sonra tekrar deneyiniz.`)

if (!member) return;

if (interaction.customId === "kontrol") {
let guvenilirlik = Date.now() - member.user.createdTimestamp < 1000 * 60 * 60 * 24 * 7;
if (guvenilirlik) {
await interaction.reply({ embeds: [embed] })
} else {
await interaction.reply({ content: `7 gün süreniz dolduğu için karantinadan çıkarıldınız.`, ephemeral: true })
await member.roles.set(conf.unregRoles)
await member.setNickname(`${conf.ikinciTag} Lütfen İsim Belirtin`)
} 
}
})
