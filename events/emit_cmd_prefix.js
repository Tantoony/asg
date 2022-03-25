const { ClientEvent } = require('../base/utils');
class PrefixCommandCreate extends ClientEvent {
    constructor(client) {
        super(client, {
            name: "message"
        });
        this.client = client;
        this.data = this.loadMarks();
    }
    async run(message) {
        if (!message.content.startsWith(client.config.prefix)) return;
        if (message.author.bot) return;
        let command = message.content.split(' ')[0].slice(client.config.prefix.length);
        let cmd;
        let args = message.content.split(' ').slice(1);
        if (client.commands.has(command)) {
            cmd = client.commands.get(command);
        } else if (client.aliases.has(command)) {
            cmd = client.commands.get(client.aliases.get(command));
        } else return;
        const embed = new Discord.MessageEmbed();
        if (!cmd.config.enabled) return message.channel.send(new Discord.MessageEmbed().setDescription(`${emojis.get("disabledcmd").value()} Bu komut şuan için **devredışı**`).setColor('#2f3136'));
        if (cmd.config.dmCmd && (message.channel.type !== 'dm')) return message.channel.send(new Discord.MessageEmbed().setDescription(`${emojis.get("dmcmd").value()} Bu komut bir **DM** komutudur.`).setColor('#2f3136'));
        if (cmd.config.ownerOnly && (message.author.id !== client.config.owner)) return message.channel.send(new Discord.MessageEmbed().setDescription(`${emojis.get("tantus").value()} Bu komutu sadece ${client.owner} kullanabilir.`).setColor('#2f3136'));
        if (cmd.config.onTest && !utils.get("testers").value().includes(message.author.id) && (message.author.id !== client.config.owner)) return message.channel.send(new Discord.MessageEmbed().setDescription(`${emojis.get("ontest").value()} Bu komut henüz **test aşamasındadır**.`).setColor('#2f3136'));
        if (cmd.config.rootOnly && !utils.get("root").value().includes(message.author.id) && (message.author.id !== client.config.owner)) return message.channel.send(new Discord.MessageEmbed().setDescription(`${emojis.get("rootonly").value()} Bu komutu sadece **yardımcılar** kullanabilir.`).setColor('#2f3136'));
        if (cmd.config.adminOnly && !message.member.permissions.has("ADMINISTRATOR") && (message.author.id !== client.config.owner)) return message.channel.send(new Discord.MessageEmbed().setDescription(`${emojis.get("modonly").value()} Bu komutu sadece **yöneticiler** kullanabilir.`).setColor('#2f3136'));
        if (cmd.info.cmdChannel & message.guild && message.guild.channels.cache.get(channels.get(cmd.info.cmdChannel).value()) && (message.channel.id !== channels.get(cmd.info.cmdChannel).value())) return message.channel.send(new Discord.MessageEmbed().setDescription(`${emojis.get("text").value()} Bu komutu ${message.guild.channels.cache.get(channels.get(cmd.info.cmdChannel).value())} kanalında kullanmayı dene!`).setColor('#2f3136'));
        if (message.guild && !cmd.config.dmCmd) {
            const requiredRoles = cmd.info.accaptedPerms || [];
            let allowedRoles = [];
            await requiredRoles.forEach(rolValue => {
                allowedRoles.push(message.guild.roles.cache.get(roles.get(rolValue).value()))
            });
            let deyim = `${emojis.get("rolereq").value()} Bu komutu kullanabilmek için ${allowedRoles[0]} rolüne sahip olmalısın!`;
            if (allowedRoles.length > 1) deyim = `${emojis.get("rolereq").value()} Bu komutu kollanabilmek için aşağıdaki rollerden birisine sahip olmalısın:\n${requiredRoles.map(r => `${emojis.get("rolereq").value()} ${message.guild.roles.cache.get(roles.get(r).value())}`).join(` `)}`;
            if ((allowedRoles.length >= 1) && !allowedRoles.some(role => message.member.roles.cache.has(role.id)) && !message.member.permissions.has("ADMINISTRATOR") && (message.author.id !== client.config.owner)) {
                return message.channel.send(embed.setDescription(deyim).setColor('#2f3136'));
            }
        }
        let uCooldown = client.cmdCoodown[message.author.id];
        if (!uCooldown) {
            client.cmdCoodown[message.author.id] = {};
            uCooldown = client.cmdCoodown[message.author.id];
        }
        let time = uCooldown[cmd.info.name] || 0;
        if (time && (time > Date.now())) return message.channel.send(`${emojis.get("time").value()} Komutu tekrar kullanabilmek için lütfen **${Math.ceil((time - Date.now()) / 1000)}** saniye bekle!`);
        client.log(`[(${message.author.id})] ${message.author.username} ran command [${cmd.info.name}]`, "cmd");
        try {
            cmd.run(client, message, args);
        } catch (e) {
            console.log(e);
            return message.channel.send(new Discord.MessageEmbed().setDescription(`${emojis.get("error").value()} | Sanırım bir hata oluştu...`).setColor('#2f3136'));
        }
    }
}

module.exports = PrefixCommandCreate;