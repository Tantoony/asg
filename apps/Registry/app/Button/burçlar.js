const Discord = require('discord.js');
const { ButtonCommand } = require("../../../../base/utils");

class RolSeçim extends ButtonCommand {
    constructor(client) {
        super(client, {
            name: "alan",
            intChannel: "rol-al",
            cooldown: 10000
        });
    }

    async run(client, interaction) {
        const client = this.client;
        const utils = await low(client.adapters('utils'));
        const roles = await low(client.adapters('roles'));
        const channels = await low(client.adapters('channels'));
        const emojis = await low(client.adapters('emojis'));
        const guild = client.guilds.cache.get(ctx.guildID);
        const mentioned = client.guild.members.cache.get(ctx.user.id);
        if (!interaction.customId === "clear") return await mentioned.roles.remove(Object.keys(client.data.roles).filter(key => key.startsWith("burc_")).map(key => client.data.roles[key]));
        const roleIDs = ctx.data.data.values.map(v => client.data.roles[v]);
        const rolArray = roleIDs.map(rID => client.guild.roles.cache.get(rID));
        await mentioned.roles.remove(Object.keys(client.data.roles).filter(key => key.startsWith("burc_")).map(key => client.data.roles[key]));
        await mentioned.roles.add(roleIDs);
        const responseEmbed = new Discord.MessageEmbed().setDescription(`Sana;\n ${rolArray.join('\n')}\nrollerini verdim.`);
    }
}

module.exports = RolSeçim;