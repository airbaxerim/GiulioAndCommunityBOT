module.exports = {
    name: `clickButton`,
    async execute(button) {
        if (button.id != "verifica") return

        button.reply.defer().catch(() => { })

        if (isMaintenance(button.clicker.user.id)) return

        if (userstatsList.find(x => x.id == button.clicker.user.id) && userstatsList.find(x => x.id == button.clicker.user.id).joinedAt) return

        if (button.clicker.member.roles.cache.has(settings.idRuoloNonVerificato))
            button.clicker.member.roles.remove(settings.idRuoloNonVerificato)

        var userstats = {
            id: button.clicker.member.id,
            username: button.clicker.member.user.username,
            roles: [],
            statistics: {
                "totalMessage": 0,
                "commands": 0,
                "addReaction": 0,
            },
            joinedAt: new Date().getTime(),
            leavedAt: null,
            birthday: [null, null],
            lastScore: 0,
            bestScore: 0,
            timeLastScore: null,
            timeBestScore: null,
            correct: 0,
            incorrect: 0,
            level: 0,
            xp: 0,
            cooldownXp: 0,
            money: 0,
            inventory: {},
            warn: [],
            moderation: {
                "type": "",
                "since": "",
                "until": "",
                "reason": "",
                "moderator": "",
                "ticketOpened": false
            }
        }

        if (userstatsList.find(x => x.id == button.clicker.user.id)) {
            userstats.moderation = userstatsList.find(x => x.id == button.clicker.user.id).moderation
            userstats.warn = userstatsList.find(x => x.id == button.clicker.user.id).warn
        }

        if (!userstatsList.find(x => x.id == button.clicker.user.id)) {
            database.collection("userstats").insertOne(userstats);
            userstatsList.push(userstats)
        }
        else {
            userstatsList.find(x => x.id == button.clicker.user.id).roles.forEach(role => {
                button.clicker.member.roles.add(role)
                    .catch(() => { })
            })
            userstatsList[userstatsList.findIndex(x => x.id == button.clicker.user.id)] = userstats
        }

        var embed = new Discord.MessageEmbed()
            .setTitle(`:wave: Benvenuto ${button.clicker.user.username}`)
            .setColor("#42A9F6")
            .setImage("https://i.postimg.cc/MZ45kGMN/Banner2.jpg")
            .setDescription(`Ciao, benvenuto all'interno del server **GiulioAndCommunity**. In questo server potrai **parlare** e** divertirti** con tantissimi utenti tutti i giorni
Prima di partecipare al server leggi tutte le <#${settings.idCanaliServer.rules}> da rispettare e tutte le <#${settings.idCanaliServer.info}> sui tantissimi **comandi**, **funzioni** e canali nel server

:bust_in_silhouette: Prosegui per **configurare** il tuo profilo nel server con il bottone **"Configura profilo"** e impostare cose molto interessanti...
`)

        var button1 = new disbut.MessageButton()
            .setLabel("Configura profilo")
            .setStyle("blurple")
            .setID("setupAvanti,1")

        button.clicker.user.send(embed, button1)
            .catch(() => { })

        button.message.guild.fetchInvites().then(guildInvites => {
            const ei = invites.get(button.message.guild.id);
            const invite = guildInvites.find(i => Object.fromEntries(ei)[i.code] < i.uses);

            var embed = new Discord.MessageEmbed()
                .setTitle(":inbox_tray: Welcome :inbox_tray:")
                .setColor("#22c90c")
                .setThumbnail(button.clicker.member.user.displayAvatarURL({ dynamic: true }))
                .addField(":alarm_clock: Time", `${moment(new Date().getTime()).format("ddd DD MMM YYYY, HH:mm:ss")}`, false)
                .addField(":bust_in_silhouette: Member", `${button.clicker.member.toString()} - ID: ${button.clicker.member.id}`, false)
                .addField("Account created", `${moment(button.clicker.user.createdAt).format("ddd DD MMM YYYY, HH:mm:ss")} (${moment(button.clicker.user.createdAt).fromNow()})`, false)
                .addField("Invite", `${invite.code} - Created from: ${client.users.cache.get(invite.inviter.id).toString()} (${invite.uses} uses)`, false)

            if (!isMaintenance())
                client.channels.cache.get(log.server.welcomeGoodbye).send(embed)
        })
    },
};
