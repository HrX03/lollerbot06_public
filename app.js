const Discord = require('discord.js');
const bot = new Discord.Client();

const config = require("./config.json");


bot.on('ready', () => {
    bot.user.setGame('-help','(Optional Twitch URL)');
    bot.user.setStatus('online');
});

bot.on('ready', () => {
  console.log('Im online! Lets have fun!');
});

bot.on("guildMemberAdd", memeber => {
  let guild = memeber.guild;
  guild.defaultChannel.send(`Welcome, ${memeber.user} to this server.`);
});

bot.on("guildCreate", guilde => {
  console.log(`New guild added : ${guild.name}, owned by ${guild.owner.user.username}`);
});

bot.on("presenceUpdate", (oldMember, newMember) => {
  let guild = newMember.guild;
  let playRole = guild.roles.find("name", "Playing Geometry Dash");
  if(!playRole) return;

  if(newMember.user.presence.game && newMember.user.presence.game.name === "Geometry Dash") {
    newMember.addRole(playRole);
  } else if(!newMember.user.presence.game && newMember.roles.has(playRole.id)) {
    newMember.removeRole(playRole);
  }
});

bot.on('message', message => {
  if(message.author.bot) return;
  	message.guild.fetchMember(message.author).then(m => {
		if (m.roles.exists("name", "Muted")) return message.delete();
  })
  if(!message.content.startsWith(config.prefix)) return;

  let command = message.content.split(" ")[0];
  command = command.slice(config.prefix.length);

  let args = message.content.split(" ").slice(1);

  if (command === "add") {
    let numArray = args.map(n=> parseInt(n));
    let total = numArray.reduce( (p, c) => p+c).catch(console.error);

    message.channel.send(total);
  }

  if (command === "substract") {
    let numArray = args.map(n=> parseInt(n));
    let total = numArray.reduce( (p, c) => p-c).catch(console.error);

    message.channel.send(total);
  }

  if (command === "multiply") {
    let numArray = args.map(n=> parseInt(n));
    let total = numArray.reduce( (p, c) => p*c).catch(console.error);

    message.channel.send(total);
  }

  if (command === "divide") {
    let numArray = args.map(n=> parseInt(n));
    let total = numArray.reduce( (p, c) => p/c).catch(console.error);

    message.channel.send(total);
  }

  if (command === 'help') {
      message.channel.send('List of avaiable commands: \n**-help**: For help\n**-add**: for additions, use -add n1 n2 n3...\n**-substract**: for substractions, use -substract n1 n2 n3...\n**-multiply**: for multiplications, use -multiply n1 n2 n3...\n**-divide**: for divisions, use -divide n1 n2 n3...\n**-say**: to let the bot say something, use -say <your phrase>\n**-kick**: kick a member, usage: -kick @user\n**-ban**: bans a member, usage: -ban @user\n**-mute**: mute a member, usage -mute @user <reason>\n**-unmute**: unmute a member that has been muted, usage -mute @user <reason>').catch(console.error);
    }

    if (command === 'gimmemoney') {
      let modRole = message.guild.roles.find("name", "Admin");
      if(message.member.roles.has(modRole.id)) {
        message.channel.send('Im poor ;-;');
      } else {
        message.reply("Hey! What are you trying to do? This command is Admin exclusive!").catch(console.error);
      }

    }

  if (command === 'say') {
    message.channel.send(args.join(" ")).catch(console.error);
  }

    if (command === "kick") {
      let modRole = message.guild.roles.find("name", "Admin");
      if(!message.member.roles.has(modRole.id)) {
      message.reply("Hey! What are you trying to do? This command is Admin exclusive!");
      }
      if(message.mentions.users.size === 0) {
        return message.reply("Please mention a user to kick, or i'll kick you, right in your ***BUTT***");
      }
      let kickMember = message.guild.member(message.mentions.users.first());
      if(!kickMember) {
        return message.reply("Are you drunk? Because that user doesn't even exist!!! Maybe think the next time");
      }
      if(!message.guild.member(bot.user).hasPermission("KICK_MEMBERS")) {
        return message.reply("If you give me the permission (KICK_MEMBER) i'll kick whoever you want.");
      }
      kickMember.kick().then(member => {
        message.reply(`${member.user.username} was kicked right in his butt. BOOM!`);
      }).catch(console.error);
    }

    if (command === "ban") {
      let modRole = message.guild.roles.find("name", "Admin");
      if(!message.member.roles.has(modRole.id)) {
      message.reply("Hey! What are you trying to do? This command is Admin exclusive!");
      }
      if(message.mentions.users.size === 0) {
        return message.reply("Please mention a user to ban, or i'll ban you. ***You have been warned***");
      }
      let banMember = message.guild.member(message.mentions.users.first());
      if(!banMember) {
        return message.reply("Are you drunk? Because that user doesn't even exist!!! Maybe think the next time");
      }
      if(!message.guild.member(bot.user).hasPermission("BAN_MEMBERS")) {
        return message.reply("If you give me the permission (BAN_MEMBER) i'll ban whoever you want.");
      }
      banMember.ban().then(member => {
        message.reply(`${member.user.username} was banned because he did some bad things and bla bla`);
      }).catch(console.error);
    }
if (command === "mute") {
    const muted = message.mentions.users.first();
    const reason = message.content.split(" ").splice(2).join(" ");
    message.guild.fetchMember(message.author).then(m => {
	if (!m.roles.exists("name", "Owner") && m.roles.exists("name", "Owner")) return message.reply("You do not have the rights to do this.")
    if (m.roles.exists("name", "Muted")) return;
    if (!muted || !reason) return message.reply(`You are incorrectly using the !mute command. Please follow it up with @userToMute and a reason.`);
    const mutedRole = message.guild.roles.find("name", "Muted");
    message.guild.fetchMember(muted).then(m => {
      if (m.roles.exists("name", "Muted")) return message.reply(`This user has already been muted. If you wish to unmute him, please use the !unmute command.`);
      if (m.roles.exists("name", "Owner") || m.roles.exists("name", "Owner")) return message.reply(`You cannot mute another moderator.`);
      m.addRole(mutedRole);
      message.channel.sendMessage(`${muted} has been successfully muted.`);
		});
	})
  }
if (command === "unmute") {
    const unmuted = message.mentions.users.first();
    message.guild.fetchMember(message.author).then(m => {
    if (m.roles.exists("name", "Muted")) return;
	if (!m.roles.exists("name", "Owner") && !m.roles.exists("name", "Admin")) return message.reply("You do not have the rights to do this.")
    if (!unmuted) return message.reply(`You are incorrectly using the !unmute command. Please follow it up with @userToUnmute.`);
    const mutedRole = message.guild.roles.find("name", "Muted");
    message.guild.fetchMember(unmuted).then(m => {
      if (!m.roles.exists("name", "Muted")) return message.reply(`You cannot unmute someone who isn't muted.`);
      m.removeRole(mutedRole);
      message.channel.sendMessage(`${unmuted} has been successfully unmuted.`);
    });
    })
  }
});

bot.login(config.token);
