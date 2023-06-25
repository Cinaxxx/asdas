const { Client, Collection } = require("discord.js");
const client = global.bot = new Client({
  fetchAllMembers: true,
  intents: [ 32767 ],
}); 
const Discord = require('discord.js');
const settings = require("./src/configs/settings.json");
const conf = require("./src/configs/sunucuayar.json");
const fs = require("fs");
client.commands = new Collection();
client.aliases = new Collection();
client.invites = new Collection();
client.cooldown = new Map();

//RANK KISMI//
client.ranks = [
  { role: "1118443572279128094", coin: 5000 },
  { role: "1118443569519267910", coin: 10000 },
  { role: "1118443599156224000", coin: 50000 },
  { role: "1118443590629216317", coin: 100000 },
  { role: "1118442526785929216", coin: 500000 },
  { role: "1118443594202746981", coin: 1000000 }
  ]
//KOMUT ÇALIŞTIRMA
fs.readdir('./src/commands/', (err, files) => {
  if (err) console.error(err);
  console.log(`Komutlar Yüklleniyor.`);
  files.forEach(f => {
    fs.readdir("./src/commands/" + f, (err2, files2) => {
      files2.forEach(file => {
        let props = require(`./src/commands/${f}/` + file);
        client.commands.set(props.conf.name, props);
        props.conf.aliases.forEach(alias => {
          client.aliases.set(alias, props.conf.name);
        });
      })
    })
  });
});
require("./src/handlers/eventHandler");
require("./src/handlers/mongoHandler");
require("./src/handlers/functionHandler")(client);

client
  .login(settings.token)
  .then(() => console.log("Bot Başarıyla Bağlandı!"))
  .catch(() => console.log("[HATA] Bot Bağlanamadı!"));

  process.on("uncaughtException", err => {
    const errorMsg = err.stack.replace(new RegExp(`${__dirname}/`, "g"), "./");
    console.error("Beklenmedik yakalanamayan hata: ", errorMsg);
    process.exit(1);
  });
  
  process.on("unhandledRejection", err => {
    console.error("Promise Hatası: ", err);
  });


  ///// slash commands
  /*const { REST } = require('@discordjs/rest');
  const { Routes } = require('discord-api-types/v9');  
  client.slashcommands = new Collection();
  var slashcommands = [];
  
  fs.readdirSync("./src/Slashcommands/").forEach((file) => {
    const command = require(`./src/Slashcommands/${file}`);
    client.slashcommands.set(command.data.name, command);
    slashcommands.push(command.data.toJSON());
  });
  
  const rest = new REST({ version: '9' }).setToken(settings.token);
  (async () => {
    try {
      console.log('[OZİ] Slash Komutlar yükleniyor.');
      await rest.put(
        Routes.applicationCommands(settings.BotClientID),
        { body: slashcommands },
      );
      console.log('[OZİ] Slash Komutlar yüklendi.');
    } catch (error) {
      console.error(error);
    }
  })();
  
  client.on('interactionCreate', (interaction) => {
    if (!interaction.isCommand()) return;
    const command = client.slashcommands.get(interaction.commandName);
    if (!command) return;
    try {
       command.execute(interaction, client);
    } catch (err) {
      if (err) console.error("Error: ", err);
    }
  });*/
