class Ready {

    constructor(client) {
        this.client = client;
    }

    async run(client) {
        client = this.client.handler.hello(this.client);
        client.logger.log(`${client.user.tag}, ${client.users.cache.size} kişi için hizmet vermeye hazır!`, "ready");
        client.user.setPresence({ activity: client.config.status, status: "idle" });
    }
}
module.exports = Ready;