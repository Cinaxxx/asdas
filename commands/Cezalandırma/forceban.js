const moment = require("moment");
moment.locale("tr");
const forceBans = require("../../schemas/forceBans");
const conf = require("../../configs/sunucuayar.json")
const settings = require("../../configs/settings.json")
const { red, green, Cezaa, Revuu, kirmiziok } = require("../../configs/emojis.json")
module.exports = {
  conf: {
    aliases: ["forceban","yargı"],
    name: "forceban",
    help: "forceban",
    owner: true
  },

  run: async (client, message, args, embed) => {
    if (!args[0]) { message.channel.send({ content:"Bir üye belirtmelisin!"}).then((e) => setTimeout(() => { e.delete(); }, 5000));
    message.react(red)
    return }
    const user = message.mentions.users.first() || await client.fetchUser(args[0]);
    if (!user) { message.channel.send({ content:"Böyle bir kullanıcı bulunamadı!"}).then((e) => setTimeout(() => { e.delete(); }, 5000));
    message.react(red)
    return }
    const ban = await forceBans.findOne({ guildID: message.guild.id, userID: user.id });
    if (ban) {
    message.react(red)
    message.channel.send({ content :"Bu üye zaten banlı!"}).then((e) => setTimeout(() => { e.delete(); }, 5000)); 
    return }
    const reason = args.slice(1).join(" ") || "Belirtilmedi!";
    const member = message.guild.members.cache.get(user.id);
    if (message.guild.members.cache.has(user.id) && message.member.roles.highest.position <= message.guild.members.cache.get(user.id).roles.highest.position) return message.channel.send({ content:"Kendinle aynı yetkide ya da daha yetkili olan birini banlayamazsın!"}).then((e) => setTimeout(() => { e.delete(); }, 5000));
    if (member && !member.bannable) {
    message.react(red)
    message.channel.send({ content :"Bu üyeyi banlayamıyorum!"}).then((e) => setTimeout(() => { e.delete(); }, 5000)); }

    if (settings.dmMessages) user.send({ content :`**${message.guild.name}** sunucusundan, **${message.author.tag}** tarafından, **${reason}** sebebiyle **kalıcı olarak** banlandınız!`}).catch(() => {});

    message.guild.members.ban(user.id, { reason }).catch(() => {});
    await new forceBans({ guildID: message.guild.id, userID: user.id, staff: message.author.id }).save();
    const penal = await client.penalize(message.guild.id, user.id, "FORCE-BAN", true, message.author.id, reason);

    let gifler = [
      "https://media.discordapp.net/attachments/751526628340793427/781384793207472158/bangif4.gif",
      "https://toasty.is-pretty.cool/8RYCH7S.gif",
      "https://media1.tenor.com/images/4732faf454006e370fa9ec6e53dbf040/tenor.gif?itemid=14678194",
      "https://media.giphy.com/media/fe4dDMD2cAU5RfEaCU/giphy.gif",
      "https://media1.tenor.com/images/ed33599ac8db8867ee23bae29b20b0ec/tenor.gif?itemid=14760307",
      "https://tenor.com/view/bane-no-banned-and-you-are-explode-gif-16047504"
    ];

    const chat = embed
    .setColor("#ed4245")
    .setImage(gifler.random())
    .setDescription(`
    ${member ? member.toString() : user.username} sunucudan kalıcı olarak yasaklandı! "${reason}" (Ceza ID: \`#${penal.id}\`)`)
    message.channel.send(chat)
    message.react(green)

    const log = embed
    .setColor("#ed4245")
    .setDescription(`
**${member ? member.toString() : user.username}** (\`${user.id}\`) üyesi sunucudan kalıcı olarak yasaklandı!

• Banlanma Zamanı: <t:${Math.floor(Date.now() / 1000)}> (<t:${Math.floor(Date.now() / 1000)}:R>)
• Banlayan Yetkili: ${message.author} \`${message.author.id}\`
• Ban Sebebi: \`${reason}\`
      `)
      message.guild.channels.cache.get(conf.banLogChannel).send({ embeds: [log]});
  },
};

