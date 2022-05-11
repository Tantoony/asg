const Discord = require('discord.js');
const { DotCommand } = require("../../../../base/utils");
class CMute extends DotCommand {
    constructor(client) {
        super(client, {
            name: "cmute",
            description: "Belirtilen kullanıcıyı geçici olarak metin kanallarından susturur.",
            usage: "cmute etiket/id dakika sebep",
            examples: ["cmute 674565119161794560 10 botları kötü yapıyor"],
            category: "Moderasyon",
            aliases: ["cm", "chatmute", "mute"],
            accaptedPerms: ["root", "owner", "cmd-ceo", "cmd-double", "cmd-single", "cmd-mute"],
            cooldown: 10000
        })
    }
    async run(client, message, args) {
        let mentioned = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        if (!mentioned) {
            return message.reply({
                embeds: [new Discord.MessageEmbed().setDescription(`Kullanıcı bulunamadı!`).setColor('BLACK')]
            }).then(msg => msg.delete({ timeout: 1000 }));
        }
        const sebep = args.slice(2).join(" ");
        if (!sebep) {
            return message.reply({
                embeds: [new Discord.MessageEmbed().setColor('BLACK').setDescription(`Bir sebep girmelisin`)]
            }).then(msg => msg.delete({ timeout: 1000 }));
        }
        if (message.member.roles.highest.rawPosition <= mentioned.roles.highest.rawPosition) {
            return message.reply({
                embeds: [new Discord.MessageEmbed().setColor('BLACK').setDescription(`Bunu yapmak için yeterli yetkiye sahip değilsin`)]
            }).then(msg => msg.delete({ timeout: 1000 }));
        }
        if (!mentioned.bannable) {
            return message.reply({
                embeds: [new Discord.MessageEmbed().setColor('BLACK').setDescription(`Bu kişiyi mutelemek için yeterli yetkiye sahip değilim`)]
            }).then(msg => msg.delete({ timeout: 1000 }));
        }
        if (!client.func.sayi(args[1])) {
            return message.reply({
                embeds: [new Discord.MessageEmbed().setColor('BLACK').setDescription(`Geçerli bir dakika girmelisin`)]
            }).then(msg => msg.delete({ timeout: 1000 }));
        }
        client.handler.emit('cmute', mentioned, message.author.id, sebep, args[1]);
        await message.react("👍");
        /*
        this.client.cmdCooldown[message.author.id][this.info.name] = Date.now() + this.info.cooldown;
        const logChannel = message.guild.channels.cache.get(data.channels["cmd-mod"]);
        const embed = new Discord.MessageEmbed().setColor('BLACK').setDescription(`${data.emojis["cmute"]} ${mentioned} kullanıcısı ${message.member} tarafından susturuldu!`);
        await logChannel.send(embed);
        */
    }
}
module.exports = CMute;