module.exports = {
    name: `clickButton`,
    async execute(button) {
        if (!button.id.startsWith("indietroClb")) return

        button.reply.defer().catch(() => { })

        if (isMaintenance(button.clicker.user.id)) return

        if (button.id.split(",")[1] != button.clicker.user.id) return

        var leaderboardListCorrect = userstatsList.filter(x => client.guilds.cache.get(settings.idServer).members.cache.find(y => y.id == x.id)).sort((a, b) => (a.correct < b.correct) ? 1 : ((b.correct < a.correct) ? -1 : 0))
        var leaderboardCorrect = ""

        var totPage = Math.ceil(leaderboardListCorrect.length / 10)
        var page = parseInt(button.id.split(",")[2]) - 1;
        if (page == 0) return

        for (var i = 10 * (page - 1); i < 10 * page; i++) {
            if (leaderboardListCorrect[i]) {

                switch (i) {
                    case 0:
                        leaderboardCorrect += ":first_place: ";
                        break
                    case 1:
                        leaderboardCorrect += ":second_place: "
                        break
                    case 2:
                        leaderboardCorrect += ":third_place: "
                        break
                    default:
                        leaderboardCorrect += `**#${i + 1}** `
                }

                var utente = client.guilds.cache.get(settings.idServer).members.cache.find(x => x.id == leaderboardListCorrect[i].id)
                leaderboardCorrect += `${utente.nickname ? utente.nickname : utente.user.username} - **${leaderboardListCorrect[i].correct}**\r`
            }
        }

        var leaderboardListScore = userstatsList.filter(x => client.guilds.cache.get(settings.idServer).members.cache.find(y => y.id == x.id)).sort((a, b) => (a.bestScore < b.bestScore) ? 1 : ((b.bestScore < a.bestScore) ? -1 : 0))
        var leaderboardScore = ""

        for (var i = 10 * (page - 1); i < 10 * page; i++) {
            if (leaderboardListScore[i]) {
                switch (i) {
                    case 0:
                        leaderboardScore += ":first_place: ";
                        break
                    case 1:
                        leaderboardScore += ":second_place: "
                        break
                    case 2:
                        leaderboardScore += ":third_place: "
                        break
                    default:
                        leaderboardScore += `**#${i + 1}** `
                }

                var utente = client.guilds.cache.get(settings.idServer).members.cache.find(x => x.id == leaderboardListScore[i].id)
                leaderboardScore += `${utente.nickname ? utente.nickname : utente.user.username} - **${leaderboardListScore[i].bestScore}**\r`
            }
        }

        var embed = new Discord.MessageEmbed()
            .setTitle("COUNTING - GiulioAndCommunity")
            .setThumbnail(client.guilds.cache.get(settings.idServer).iconURL({ dynamic: true }))
            .setDescription("Classifiche counting di tutti gli utenti nel server")
            .addField(":1234: Current Number", "```" + serverstats.numero + "```")
            .addField(":medal: Last user", serverstats.ultimoUtente != "NessunUtente" ? (client.users.cache.find(u => u.id == serverstats.ultimoUtente) ? `\`\`\`${client.users.cache.find(u => u.id == serverstats.ultimoUtente).username} (${moment(parseInt(leaderboardListScore[leaderboardListScore.findIndex(u => u.id == serverstats.ultimoUtente)].timeLastScore)).fromNow()})\`\`\`` : "\`\`\`User undefined\`\`\`") : "```None```")
            .addField(":trophy: Best score", "```" + serverstats.bestScore + " - " + leaderboardListScore[0].username + " (" + moment(parseInt(serverstats.timeBestScore)).fromNow() + ")```", false)
            .addField(":blue_circle: Score Leaderboard", leaderboardScore)
            .addField(":green_circle: Correct Leaderboard", leaderboardCorrect, false)
            .setFooter(`Page ${page}/${totPage}`)

        var button1 = new disbut.MessageButton()
            .setID(`indietro2Clb,${button.clicker.user.id},${page}`)
            .setStyle("blurple")
            .setEmoji("??????")

        var button2 = new disbut.MessageButton()
            .setID(`indietroClb,${button.clicker.user.id},${page}`)
            .setStyle("blurple")
            .setEmoji("??????")

        if (page == 1) {
            button1.setDisabled()
            button2.setDisabled()
        }

        var button3 = new disbut.MessageButton()
            .setID(`avantiClb,${button.clicker.user.id},${page}`)
            .setStyle("blurple")
            .setEmoji("??????")

        var button4 = new disbut.MessageButton()
            .setID(`avanti2Clb,${button.clicker.user.id},${page}`)
            .setStyle("blurple")
            .setEmoji("??????")

        if (page == totPage) {
            button3.setDisabled()
            button4.setDisabled()
        }

        var row = new disbut.MessageActionRow()
            .addComponent(button1)
            .addComponent(button2)
            .addComponent(button3)
            .addComponent(button4)

        button.message.edit(embed, row)
    },
};