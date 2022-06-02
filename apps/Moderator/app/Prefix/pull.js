const children = require("child_process");
const { PrefixCommand } = require("../../../../base/utils");
class Kur extends PrefixCommand {

    constructor(client) {
        super(client, {
            name: "pull",
            description: "Açıklama Belirtilmemiş.",
            usage: "Kullanım Belirtilmemiş.",
            examples: ["Örnek Bulunmamakta"],
            category: "OWNER",
            aliases: [],
            acceptedRoles: [],
            cooldown: 5000,
            enabled: true,
            adminOnly: false,
            ownerOnly: true,
            onTest: false,
            rootOnly: false,
            dmCmd: false
        });
    }

    async run(client, message, args) {

        function Process() {
            var ls = children.exec(`git pull`);
            ls.stdout.on('data', function (data) {
                message.reply(`\`\`\`${data.slice(0, 1980)}...\`\`\``);
            });
            ls.stderr.on('data', function (data) {
                message.reply(`\`\`\`${data.slice(0, 1980)}...\`\`\``);
            });
            ls.on('close', function (code) {
                if (code == 0)
                    console.log('Stop');
                else
                    console.log('Start');
            });
            setTimeout(() => {
                ls.kill();
            }, 100);
        }
        Process();
        
    }

}

module.exports = Kur;