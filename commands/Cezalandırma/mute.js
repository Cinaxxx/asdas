const coin = require("../../schemas/coin");
const moment = require("moment");
const ceza = require("../../schemas/ceza");
const cezapuan = require("../../schemas/cezapuan")
const muteLimit = new Map();
moment.locale("tr");
const ms = require("ms");
const conf = require("../../configs/sunucuayar.json")
const { red, green, Mute, revusome, kirmiziok } = require("../../configs/emojis.json")
const settings = require("../../configs/settings.json")
module.exports = {
  conf: {
    aliases: ["mute","cmute"],
    name: "mute",
    help: "mute"
  },

  run: async (client,message, args, embed) => {
    if (!message.member.permissions.has(8n) && !conf.cmuteHammer.some(x => message.member.roles.cache.has(x))) {
    message.react(red)
    message.channel.send({ content:"Yeterli yetkin bulunmuyor!"}).then((e) => setTimeout(() => { e.delete(); }, 5000)); 
    return } 
    const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
    if (!member) { message.channel.send({ content:"Bir üye belirtmelisin!"}) 
    message.react(red)
    return }
    if (conf.chatMute.some(x => member.roles.cache.has(x))) { message.channel.send({ content:"Bu üye zaten susturulmuş!"}).then((e) => setTimeout(() => { e.delete(); }, 5000));
    message.react(red)
    return }
    const duration = args[1] ? ms(args[1]) : undefined;
    if (!duration) { message.channel.send({ content:`Geçerli bir süre belirtmelisin!`})
    message.react(red)
    return }
    const reason = args.slice(2).join(" ") || "Belirtilmedi!";
    if (message.member.roles.highest.position <= member.roles.highest.position) {
    message.react(red)
    message.channel.send({ content:"Kendinle aynı yetkide ya da daha yetkili olan birini susturamazsın!"}).then((e) => setTimeout(() => { e.delete(); }, 5000)); 
    return }
    if (!member.manageable) {
    message.react(red)
    message.channel.send({ content:"Bu üyeyi susturamıyorum!"}).then((e) => setTimeout(() => { e.delete(); }, 5000)); 
    return }
    if (settings.chatmutelimit > 0 && muteLimit.has(message.author.id) && muteLimit.get(message.author.id) == settings.chatmutelimit) {
    message.react(red)
    message.channel.send({ content:"Saatlik susturma sınırına ulaştın!"}).then((e) => setTimeout(() => { e.delete(); }, 5000)); 
    return }

    await ceza.findOneAndUpdate({ guildID: message.guild.id, userID: member.user.id}, { $set: {time: duration}})
    await ceza.findOneAndUpdate({ guildID: message.guild.id, userID: member.user.id }, { $push: { ceza: 1 } }, { upsert: true });
    await ceza.findOneAndUpdate({ guildID: message.guild.id, userID: member.user.id }, { $inc: { top: 1 } }, { upsert: true });
    await ceza.findOneAndUpdate({ guildID: message.guild.id, userID: message.author.id }, { $inc: { MuteAmount: 1 } }, {upsert: true});
    await coin.findOneAndUpdate({ guildID: member.guild.id, userID: member.user.id }, { $inc: { coin: -20 } }, { upsert: true });
    await cezapuan.findOneAndUpdate({ guildID: message.guild.id, userID: member.user.id }, { $inc: { cezapuan: 20 } }, { upsert: true });
    const cezapuanData = await cezapuan.findOne({ guildID: message.guild.id, userID: member.user.id });
    if(conf.cezapuanlog) message.guild.channels.cache.get(conf.cezapuanlog).send({ content:`${member} üyesi \`chat mute cezası\` alarak toplam \`${cezapuanData ? cezapuanData.cezapuan : 0} ceza puanına\` ulaştı!`});
    message.react(green)
    member.roles.add(conf.chatMute);
    const penal = await client.penalize(message.guild.id, member.user.id, "CHAT-MUTE", true, message.author.id, reason, true, Date.now() + duration);
    message.channel.send({ content:`${green} ${member.toString()} üyesi, ${message.author} tarafından, \`${reason}\` nedeniyle susturuldu! \`(Ceza ID: #${penal.id})\``}).then((e) => setTimeout(() => { e.delete(); }, 50000));
    message.react(green)
    const time = ms(duration).replace("h", " saat").replace("m", " dakika").replace("s", " saniye");
    if (settings.dmMessages) member.send({ content: `**${message.guild.name}** sunucusunda, **${message.author.tag}** tarafından, **${reason}** sebebiyle, **${time}** boyunca susturuldunuz!`}).catch(() => {});

    const log = embed
      .setAuthor({ name: member.user.username, iconURL:  member.user.displayAvatarURL({ dynamic: true }) })
      .setColor("#2f3136")
      .setDescription(`
${member.toString()} Adlı Kişiye Chat Mutesi Atıldı

${Mute} Mute Atan Kişi : ${message.author} (\`${message.author.id}\`)
${revusome} Ceza Süresi: \`${time}\`
${kirmiziok} Ceza Sebebi: \`${reason}\`
      `)
      .setFooter({ text:`${moment(Date.now()).format("LLL")}    (Ceza ID: #${penal.id})` })
    message.guild.channels.cache.get(conf.cmuteLogChannel).wsend({ embeds : [log]});

    if (settings.chatmutelimit > 0) {
      if (!muteLimit.has(message.author.id)) muteLimit.set(message.author.id, 1);
      else muteLimit.set(message.author.id, muteLimit.get(message.author.id) + 1);
      setTimeout(() => {
        if (muteLimit.has(message.author.id)) muteLimit.delete(message.author.id);
      }, 1000 * 60 * 60);
    }
  },
};
