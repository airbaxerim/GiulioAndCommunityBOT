module.exports = {
    name: `channelDelete`,
    async execute(channel) {
        if (isMaintenance()) return

        if (channel.guild.id != settings.idServer) return

        if (!channel.guild) return

        const fetchedLogs = await channel.guild.fetchAuditLogs({
            limit: 1,
            type: 'CHANNEL_DELETE',
        });
        const logs = fetchedLogs.entries.first();

        if (logs.executor.bot) return

        var embed = new Discord.MessageEmbed()
            .setTitle(":wastebasket: Channel deleted :wastebasket:")
            .setColor("#e31705")
            .addField(":alarm_clock: Time", `${moment(new Date().getTime()).format("ddd DD MMM YYYY, HH:mm:ss")}`, false)
            .addField(":brain: Executor", `${logs.executor.toString()} - ID: ${logs.executor.id}`, false)
            .addField("Channel", `#${channel.name}`)
            .addField("Category", channel.parentID ? channel.parent : "_Null_")
            .addField("Type", channel.type == "text" ? "Text" : channel.type == "voice" ? "Voice" : channel.type == "news" ? "News" : channel.type)
            .addField("Topic", channel.topic ? (channel.topic.length > 300 ? (`${channel.topic.slice(0, 300)}...`) : channel.topic) : "_Null_")

        if (channel.rateLimitPerUser)
            embed.addField("Slowmode", ms(channel.rateLimitPerUser * 1000, { long: true }))

        var permissionsText = ""
        for (var permission in Object.fromEntries(channel.permissionOverwrites)) {
            permissionsText += Object.fromEntries(channel.permissionOverwrites)[permission].type == "member" ? `User: <@${permission}>\r` : `Role: ${client.guilds.cache.get(log.idServer).roles.cache.find(x => x.name == channel.guild.roles.cache.find(y => y.id == permission)?.name) ? client.guilds.cache.get(log.idServer).roles.cache.find(x => x.name == channel.guild.roles.cache.find(y => y.id == permission).name).toString() : channel.guild.roles.cache.find(y => y.id == permission).name}\r`

            var permissionsAllow = Object.fromEntries(channel.permissionOverwrites)[permission]?.allow.serialize() || {}
            var permissionsDeny = Object.fromEntries(channel.permissionOverwrites)[permission]?.deny.serialize() || {}

            var permissions = { ...permissionsAllow }
            for (var permission2 in permissions) {
                if (!permissionsAllow[permission2] && !permissionsDeny[permission2])
                    permissions[permission2] = 0
                else if (permissionsAllow[permission2] && !permissionsDeny[permission2])
                    permissions[permission2] = 1
                else if (!permissionsAllow[permission2] && permissionsDeny[permission2])
                    permissions[permission2] = -1
            }

            for (var permission3 in permissions) {
                if (permissions[permission3] != 0)
                    permissionsText += `${permission3} - ${permissions[permission3] == -1 ? ":red_circle:" : ":green_circle:"}\r`
            }
        }

        if (permissionsText != "")
            embed.addField("Permissions", permissionsText)

        var chatLog = ""
        if (channel.type != "voice") {
            for (var msg of channel.messages.cache.array()) {
                var attachments = ""
                msg.attachments.array().forEach(attachment => {
                    attachments += `${attachment.name} (${attachment.url}), `
                })
                if (attachments != "")
                    attachments = attachments.slice(0, -2)

                chatLog += `${msg.author?.bot ? "[BOT] " : utenteMod(msg.author) ? "[MOD] " : ""}@${msg.author?.username} - ${moment(msg.createdAt).format("ddd DD HH:mm:ss")}${msg.content ? `\n${msg.content}` : ""}${msg.embeds[0] ? `\nEmbed: ${msg.embeds[0].title}` : ""}${attachments ? `\nAttachments: ${attachments}` : ""}\n\n`
            }
        }

        if (chatLog != "") {
            var attachment1 = await new Discord.MessageAttachment(
                Buffer.from(chatLog, "utf-8"), `chanel${channel.id}-${new Date().getDate()}${new Date().getMonth() + 1}${new Date().getFullYear()}${new Date().getHours() < 10 ? (`0${new Date().getHours()}`) : new Date().getHours()}${new Date().getMinutes() < 10 ? (`0${new Date().getMinutes()}`) : new Date().getMinutes()}.txt`
            );
            client.channels.cache.get(log.server.channels).send({ embed, files: [attachment1] })
        }
        else
            client.channels.cache.get(log.server.channels).send(embed)
    },
};