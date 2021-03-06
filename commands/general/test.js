module.exports = {
    name: "test",
    aliases: ["prova", "ping"],
    onlyStaff: false,
    availableOnDM: true,
    description: "Info di debug del bot",
    syntax: "!test",
    category: "general",
    channelsGranted: [settings.idCanaliServer.commands],
    async execute(message, args, client, property) {
        var embed = new Discord.MessageEmbed()
            .setTitle("GiulioAndCommunity BOT")
            .setThumbnail("https://i.postimg.cc/pLYkGfD1/Profilo-bot.png")
            .setColor("#6CA1FF")
            .addField(":stopwatch: Uptime", "```" + `${ms(client.uptime, { long: true })} - ${moment(new Date().getTime() - client.uptime).format("ddd DD MMM, HH:mm:ss")}` + "```")
            .addField(":turtle: Ping", "```" + `${client.ws.ping}ms` + "```", true)
            .addField(":floppy_disk: Ram", "```" + `${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB` + "```", true)

        message.channel.send(embed)
            .catch(() => { })
    },
};
