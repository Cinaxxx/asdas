const client = global.bot;
const { Collection } = require("discord.js");
const inviterSchema = require("../schemas/inviter");
const inviteMemberSchema = require("../schemas/inviteMember");
const coin = require("../schemas/coin");
const gorev = require("../schemas/invite");
const otokayit = require("../schemas/otokayit");
const bannedTag = require("../schemas/bannedTag");
const regstats = require("../schemas/registerStats");
const conf = require("../configs/sunucuayar.json");
const ayar = require("../configs/sunucuayar.json")
const settings = require("../configs/settings.json")
const moment = require("moment");
const { star, green, red, hosgeldin } = require("../configs/emojis.json")
const emoji = require("../configs/emojis.json")
const forceBans = require("../schemas/forceBans");

module.exports = async (member) => {

  const data = await forceBans.findOne({ guildID: settings.guildID, userID: member.user.id });
  if (data) return member.guild.members.ban(member.user.id, { reason: "Sunucudan kalıcı olarak yasaklandı!" }).catch(() => {});
  
  let guvenilirlik = Date.now()-member.user.createdTimestamp < 1000*60*60*24*7;
  if (guvenilirlik) {
  if(ayar.fakeAccRole) 
  member.roles.add(ayar.fakeAccRole).catch();
  member.setNickname("• Şüpheli Hesap").catch();
  } else if(ayar.unregRoles) member.roles.add(ayar.unregRoles).catch();
  if (member.user.username.includes(ayar.tag)) { member.setNickname(`${ayar.tag} Lütfen İsim Belirtin`).catch(); }
  else { member.setNickname(`${ayar.ikinciTag} Lütfen İsim Belirtin`).catch();}
  
  if (member.user.username.includes(ayar.tag)) {
    await member.roles.add(ayar.ekipRolu)
    await member.roles.add(ayar.unregRoles)
    client.channels.cache.get(ayar.ekipLogChannel).send({ content:`<@${member.id}> adlı kişi sunucumuza taglı şekilde katıldı, isminde ${ayar.tag} sembolü bulunuyor.`})
  }

    let otoreg = await otokayit.findOne({
    userID: member.id
  })

 const tagModedata = await regstats.findOne({ guildID: settings.guildID })
  if (tagModedata && tagModedata.tagMode === false) {
    if (otoreg) {
      if (member.manageable) await member.roles.set(otoreg.roleID)
      member.setNickname(`${ayar.tag} ${otoreg.name} ' ${otoreg.age}`);
     if(ayar.chatChannel && client.channels.cache.has(ayar.chatChannel)) client.channels.cache.get(ayar.chatChannel).send({ content:`Aramıza hoşgeldin **${member}**! Sunucumuzda daha önceden kayıtın bulunduğu için direkt içeriye alındınız. Kuralları okumayı unutma!`})
    }
}

  let memberGün = moment(member.user.createdAt).format("DD");
  let memberTarih = moment(member.user.createdAt).format("YYYY HH:mm:ss");
  let memberAylar = moment(member.user.createdAt).format("MM").replace("01", "Ocak").replace("02", "Şubat").replace("03", "Mart").replace("04", "Nisan").replace("05", "Mayıs").replace("06", "Haziran").replace("07", "Temmuz").replace("08", "Ağustos").replace("09", "Eylül").replace("10", "Ekim").replace("11", "Kasım").replace("12", "Aralık");

  var üyesayısı = member.guild.memberCount.toString().replace(/ /g, "    ")
        var üs = üyesayısı.match(/([0-9])/g)
        üyesayısı = üyesayısı.replace(/([a-zA-Z])/g, "bilinmiyor").toLowerCase()
        if(üs) {
          üyesayısı = üyesayısı.replace(/([0-9])/g, d => {
            return {
              '0': `${emoji.sifir}`,
              '1': `${emoji.bir}`,
              '2': `${emoji.iki}`,
              '3': `${emoji.uc}`,
              '4': `${emoji.dort}`,
              '5': `${emoji.bes}`,
              '6': `${emoji.alti}`,
              '7': `${emoji.yedi}`,
              '8': `${emoji.sekiz}`,
              '9': `${emoji.dokuz}`}[d];
            })
          }     


  const channel = member.guild.channels.cache.get(ayar.invLogChannel);
  const kayitchannel = member.guild.channels.cache.get(ayar.teyitKanali);
  const kurallar = member.guild.channels.cache.get(ayar.kurallar);
  if (!channel) return;
  if (member.user.bot) return;

  const cachedInvites = client.invites.get(member.guild.id)
  const newInvites = await member.guild.invites.fetch();
  const usedInvite = newInvites.find(inv => cachedInvites.get(inv.code) < inv.uses);
  newInvites.each(inv => cachedInvites.set(inv.code, inv.uses));
  client.invites.set(member.guild.id, cachedInvites);

  const res = await bannedTag.findOne({ guildID: settings.guildID });
  if (!res) return
  
    res.taglar.forEach(async x => {

  if(res.taglar.some(x => member.user.tag.includes(x))) { 
    await member.roles.set(ayar.jailRole)
    await member.setNickname("• Yasaklı Tag")
    if (settings.dmMessages) member.send({ content:`${member.guild.name} adlı sunucumuza olan erişiminiz engellendi! Sunucumuzda yasaklı olan bir simgeyi (${x}) isminizde taşımanızdan dolayıdır. Sunucuya erişim sağlamak için simgeyi (${x}) isminizden çıkartmanız gerekmektedir.\n\nSimgeyi (${x}) isminizden kaldırmanıza rağmen üstünüzde halen Yasaklı Tag rolü varsa sunucudan gir çık yapabilirsiniz veya sağ tarafta bulunan yetkililer ile iletişim kurabilirsiniz. **-Yönetim**\n\n__Sunucu Tagımız__\n**${conf.tag}**`}).catch(() => {});
}
}) 

let seskanal = [
  `<#1027813204358864896>`,
  `<#1027813292917407834>`,
  `<#1027813302404915200>`
]; 

if (!usedInvite) {

kayitchannel.send({ content:`
${hosgeldin} Hoşgeldiniz ${member} ${hosgeldin}\n
\`❯\` Hesabın **${memberGün} ${memberAylar} ${memberTarih}** tarihinde oluşturulmuş. ${guvenilirlik ? `${red}` : `${green}` }\n 
\`❯\` Sunucu kurallarımız ${kurallar} kanalında belirtilmiştir. Unutma sunucu içerisinde ki ceza işlemlerin kuralları okuduğunu varsayarak gerçekleştirilecek.\n
\`❯\` Sunucumuzun **${üyesayısı}**. üyesisin! Tagımızı (\`${ayar.tag}\`) alarak bizlere destek olabilirsin.${tagModedata ? tagModedata.tagMode === true ? `(**Şuan da taglı alımdayız**)`:``:``}\n
> `+ seskanal.random() +` **Kanalına girerek saniyeler içerisinde kayıt olabilirsiniz.**`});

channel.send({ content:`<:join:1032329347316600994> ${member}, sunucuya katıldı! Davet Eden: **Sunucu Özel URL**`})
return }
if (!usedInvite) return;
await inviteMemberSchema.findOneAndUpdate({ guildID: member.guild.id, userID: member.user.id }, { $set: { inviter: usedInvite.inviter.id } }, { upsert: true });
if (Date.now() - member.user.createdTimestamp <= 1000 * 60 * 60 * 24 * 7) {
await inviterSchema.findOneAndUpdate({ guildID: member.guild.id, userID: usedInvite.inviter.id }, { $inc: { total: 1, fake: 1 } }, { upsert: true });
const inviterData = await inviterSchema.findOne({ guildID: member.guild.id, userID: usedInvite.inviter.id });
const total = inviterData ? inviterData.total : 0;

kayitchannel.send({ content:`${star} ${member} Sunucumuza katıldı fakat hesabı 7 gün içerisinde açıldığı için şüpheli kısmına atıldı. ${red}`});

channel.send({ content:`<:join:1032329347316600994> ${member} sunucumuza katıldı, Davet Eden: **${invite.inviter.tag}**`})
member.roles.set(ayar.fakeAccRole)
} else {
await inviterSchema.findOneAndUpdate({ guildID: member.guild.id, userID: usedInvite.inviter.id }, { $inc: { total: 1, regular: 1 } }, { upsert: true });
const inviterData = await inviterSchema.findOne({ guildID: member.guild.id, userID: usedInvite.inviter.id });
const total = inviterData ? inviterData.total : 0;

kayitchannel.send({ content:`
${hosgeldin} Hoşgeldiniz ${member} ${hosgeldin}\n
\`❯\` Hesabın **${memberGün} ${memberAylar} ${memberTarih}** tarihinde oluşturulmuş. ${guvenilirlik ? `${red}` : `${green}` }\n 
\`❯\`Sunucu kurallarımız ${kurallar} kanalında belirtilmiştir. Unutma sunucu içerisinde ki ceza işlemlerin kuralları okuduğunu varsayarak gerçekleştirilecek.\n
\`❯\` Sunucumuzun **${üyesayısı}**. üyesisin! Tagımızı (\`${ayar.tag}\`) alarak bizlere destek olabilirsin.${tagModedata ? tagModedata.tagMode === true ? `(**Şuan da taglı alımdayız**)`:``:``}\n
> `+ seskanal.random() +` **Kanalına girerek saniyeler içerisinde kayıt olabilirsiniz.**`});

channel.send({ content:`<:join:1032329347316600994> ${member} sunucumuza katıldı, Davet Eden: **${invite.inviter.tag}**`})
}
await coin.findOneAndUpdate({ guildID: member.guild.id, userID: usedInvite.inviter.id }, { $inc: { coin: 1 } }, { upsert: true });
const gorevData = await gorev.findOne({ guildID: member.guild.id, userID: usedInvite.inviter.id });
if (gorevData) { await gorev.findOneAndUpdate({ guildID: member.guild.id, userID: usedInvite.inviter.id }, { $inc: { invite: 1 } }, { upsert: true });}

const memberCount = member.guild.members.cache.size
client.channels.cache.get('1030513677570416731').setName(`• Toplam Üye : ${memberCount}`)
client.channels.cache.get('1030513791479332955').setName(`• Son Üye : ${member.username}`)

};

module.exports.conf = {
  name: "guildMemberAdd",
};
