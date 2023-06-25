const client = global.bot;
const conf = require("../configs/sunucuayar.json");
const settings = require("../configs/settings.json")
const penals = require("../schemas/penals");
const ceza = require("../schemas/ceza");
const bannedTag = require("../schemas/bannedTag");
const {MessageEmbed} = require("discord.js")
module.exports = async () => {

  client.guilds.cache.forEach(guild => {
    guild.invites.fetch()
    .then(invites => {
      const codeUses = new Map();
      invites.each(inv => codeUses.set(inv.code, inv.uses));
      client.invites.set(guild.id, codeUses);
  })
})

let guild = client.guilds.cache.get(settings.guildID);
await guild.members.fetch();

  client.user.setActivity(settings.botDurum, {
    type: "STREAMING",
    url: "https://www.twitch.tv/cinaxshu"});

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  const newData = new bannedTag({ guildID: settings.guildID })
  newData.save().catch(e => console.log(e))

setInterval(() => { TagAlıncaKontrol(); }, 20 * 1000);
setInterval(() => { TagBırakanKontrol(); }, 25 * 1000);
setInterval(() => { RolsuzeKayitsizVerme(); }, 10 * 1000);

async function RolsuzeKayitsizVerme()  { // Rolü olmayanı kayıtsıza atma
const guild = client.guilds.cache.get(settings.guildID);
let ozi = guild.members.cache.filter(m => m.roles.cache.filter(r => r.id !== guild.id).size == 0)
   ozi.forEach(r => {
   r.roles.add(conf.unregRoles)
   })
 
};

async function TagAlıncaKontrol() { // Tag alınca tarama
const guild = client.guilds.cache.get(settings.guildID)
const members = [...guild.members.cache.filter(member => member.user.tag.includes(conf.tag) && !member.user.bot && !member.roles.cache.has(conf.jailRole) && !member.roles.cache.has(conf.ekipRolu)).values()].splice(0, 10)
for await (const member of members) {
await member.roles.add(conf.ekipRolu);
}
};

async function TagBırakanKontrol() { // Tagı olmayanın family rol çekme
const guild = client.guilds.cache.get(settings.guildID)
const memberss = [...guild.members.cache.filter(member => !member.user.tag.includes(conf.tag) && !member.user.bot && member.roles.cache.has(conf.ekipRolu)).values()].splice(0, 10)
for await (const member of memberss) {
 await member.roles.remove(conf.ekipRolu);
}
};

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

setInterval(async () => {  
  const guild = client.guilds.cache.get(settings.guildID);
  if (!guild) return;
  const finishedPenals = await penals.find({ guildID: guild.id, active: true, temp: true, finishDate: { $lte: Date.now() } });
  finishedPenals.forEach(async (x) => {
    const member = guild.members.cache.get(x.userID);
    if (!member) return;
    if (x.type === "CHAT-MUTE") {
      x.active = false;
      await x.save();
      await member.roles.remove(conf.chatMute);
      let data2 = await ceza.findOne({ userID: member.user.id, guildID: guild.id})
      let penal = await penals.findOne({ userID: member.user.id, guildID: guild.id});
      const cmutelog = new Discord.MessageEmbed()
      .setColor("#57f288")
      .setDescription(`
${member.toString()} üyesinin ${data2.time} sürelik metin kanallarındaki susturulması otomatik olarak kaldırıldı.

• Chat Mute Atılma: <t:${Math.floor(Date.now() / 1000)}> (<t:${Math.floor(Date.now() / 1000)}:R>)
• Chat Mute Bitiş: <t:${Math.floor((Date.now() + data2.time) / 1000)}> (<t:${Math.floor((Date.now() + data2.time) / 1000)}:R>)
• Chat Mute Sebebi: ${penal.reason}`)
      client.channels.cache.get(conf.cmuteLogChannel).send({ embeds: [cmutelog]});
    }
    if (x.type === "TEMP-JAIL") {
      x.active = false;
      await x.save();
      await member.setRoles(conf.unregRoles);
      const tjaillog = new Discord.MessageEmbed()
      .setColor("#57f288")
      .setDescription(`${member.toString()} üyesinin jail, süresi bittiği için kaldırıldı!`)
      client.channels.cache.get(conf.jailLogChannel).send({ embeds: [tjaillog]});
    } 
    if (x.type === "VOICE-MUTE") {
      if (member.voice.channelId) {
        x.removed = true;
        await x.save();
        if (member.voice.serverMute) member.voice.setMute(false);
      }
      x.active = false;
      await x.save();
      member.roles.remove(conf.voiceMute);
      let data2 = await ceza.findOne({ userID: member.user.id, guildID: guild.id})
      let penal = await penals.findOne({ userID: member.user.id, guildID: guild.id});
      const vmutelog = new Discord.MessageEmbed()
      .setColor("#57f288")
      .setDescription(`
${member.toString()} üyesinin ${data2.time} sürelik ses kanallarındaki susturulması otomatik olarak kaldırıldı.

• Voice Mute Atılma: <t:${Math.floor(Date.now() / 1000)}> (<t:${Math.floor(Date.now() / 1000)}:R>)
• Voice Mute Bitiş: <t:${Math.floor((Date.now() + data2.time) / 1000)}> (<t:${Math.floor((Date.now() + data2.time) / 1000)}:R>)
• Voice Mute Sebebi: ${penal.reason}`)
      client.channels.cache.get(conf.vmuteLogChannel).send({ embeds: [vmutelog]});
    }
  });

  const activePenals = await penals.find({ guildID: guild.id, active: true });
  activePenals.forEach(async (x) => {
    const member = guild.members.cache.get(x.userID);
    if (!member) return;
    if (x.type === "CHAT-MUTE" && !conf.chatMute.some((x) => member.roles.cache.has(x))) return member.roles.add(conf.chatMute);
    if ((x.type === "JAIL" || x.type === "TEMP-JAIL") && !conf.jailRole.some((x) => member.roles.cache.has(x))) return member.setRoles(conf.jailRole);
    if (x.type === "VOICE-MUTE") {
      if (!conf.voiceMute.some((x) => member.roles.cache.has(x))) member.roles.add(conf.voiceMute);
      if (member.voice.channelId && !member.voice.serverMute) member.voice.setMute(true);
    }
  });
}, 750);
};

module.exports.conf = {
  name: "ready",
};
