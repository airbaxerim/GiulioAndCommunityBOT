module.exports = {
    name: `clickButton`,
    async execute(button) {
        if (button.id != "rifiutaSuggestion") return

        button.reply.defer().catch(() => { })

        if (isMaintenance(button.clicker.user.id)) return

        var idUtente = button.message.embeds[0].fields[0].value.slice(button.message.embeds[0].fields[0].value.length - 19, -1)
        if (!idUtente) return

        var utente = client.users.cache.get(idUtente)
        if (!utente) return

        var embed = new Discord.MessageEmbed()
            .setTitle("💡Suggestion RIFIUTATO")
            .setColor("#ED4245")
            .setDescription(`Un tuo suggerimento è stato purtroppo **rifiutato** dallo staff`)
            .addField(":bookmark_tabs: Suggestion", button.message.embeds[0].fields[2].value)

        utente.send(embed)
            .catch(() => { })

        button.message.embeds[0].fields[1].value = "Refused by " + button.clicker.user.username
        button.message.embeds[0].color = "15548997"

        button.message.edit(button.message.embeds[0], null)
    },
};