module.exports = {
    name: `clickMenu`,
    async execute(menu) {
        if (!menu.id.startsWith("shopMenu")) return

        if (isMaintenance(menu.clicker.user.id)) return

        if (menu.id.split(",")[1] != menu.clicker.user.id) return menu.reply.defer()

        menu.reply.defer()

        var userstats = userstatsList.find(x => x.id == menu.clicker.user.id);
        if (!userstats) return

        var option1 = new disbut.MessageMenuOption()
            .setLabel('Technology')
            .setEmoji('๐ฅ๏ธ')
            .setValue('shopTechnology')

        var option2 = new disbut.MessageMenuOption()
            .setLabel('Food')
            .setEmoji('๐')
            .setValue('shopFood')

        var option3 = new disbut.MessageMenuOption()
            .setLabel('Home')
            .setEmoji('๐ ')
            .setValue('shopHome')

        var option4 = new disbut.MessageMenuOption()
            .setLabel('Mezzi di trasporto')
            .setEmoji('๐ป')
            .setValue('shopMezziTrasporto')

        var option5 = new disbut.MessageMenuOption()
            .setLabel('Abbigliamento')
            .setEmoji('๐')
            .setValue('shopAbbigliamento')

        let select = new disbut.MessageMenu()
            .setID(`shopMenu,${menu.clicker.user.id}`)
            .setPlaceholder('Select category...')
            .setMaxValues(1)
            .setMinValues(1)
            .addOption(option1)
            .addOption(option2)
            .addOption(option3)
            .addOption(option4)
            .addOption(option5)

        var category;
        var embed = new Discord.MessageEmbed()
            .setDescription(`
Con \`!shop [item]\` puoi avere piรน **informazioni** riguardo un oggetto, quando costa **comprarlo**, **venderlo**, il suo **id** e altro
Utilizza invece i comandi \`!buy [item]\` e \`!sell [item]\` per comprare o vendere piรน velocemente
`)

        switch (menu.values[0]) {
            case "shopTechnology": {
                category = "technology"
                embed
                    .setTitle("๐ฅ๏ธ TECHNOLOGY items ๐ฅ๏ธ")
                    .setColor("#999999")
            } break
            case "shopFood": {
                category = "food"
                embed
                    .setTitle("๐ FOOD items ๐")
                    .setColor("#db8616")
            } break
            case "shopHome": {
                category = "home"
                embed
                    .setTitle("๐  HOME items ๐ ")
                    .setColor("#1dbfaa")
            } break
            case "shopMezziTrasporto": {
                category = "mezziTrasporto"
                embed
                    .setTitle("๐ป TRANSPORT items ๐ป")
                    .setColor("#c43812")
            } break
            case "shopAbbigliamento": {
                category = "abbigliamento"
                embed
                    .setTitle("๐ CLOTHING items ๐")
                    .setColor("#2683c9")
            } break
        }

        var items = require("../../config/items.json").filter(x => x.category == category)

        items.forEach(item => {
            embed
                .addField(`${!item.priviled || (item.priviled && userstats.level >= item.priviled) ? item.icon : item.iconUnlocked} ${item.name}`, !item.priviled || (item.priviled && userstats.level >= item.priviled) ? `
Price: ${item.price}$
ID: \`#${item.id}\`` : `
_Sblocca con \r<@&${settings.ruoliLeveling["level" + item.priviled]}>_`, true)
        });


        menu.message.edit(embed, select)
    },
};