const request = require('request')
const boblox = require('noblox.js')
const discord = require('discord.js')

const options = require('./settings.json')

const bot = new discord.Client({intents: new discord.Intents(32767)})

const ranks = {
    '941120527328768060': 'Noticed', //69
    '941120487650648104': 'Administrator', //420
    '941128256969650247': null,
}

let start = async () => {
    await boblox.setCookie(options.bobloxCookie)
}
start()

let row = new discord.MessageActionRow()
    .addComponents(
        new discord.MessageButton()
            .setCustomId('Accept')
            .setLabel('Accept')
            .setStyle('SUCCESS'),
        new discord.MessageButton()
            .setCustomId('Decline')
            .setLabel('Decline')
            .setStyle('DANGER')
    )

bot.on("messageCreate", async message => {
    for (let i = 0; i < options.webhookNames.length; i++) {
        if (message.author.username === options.webhookNames[i] && message.author.bot === true) {
            console.log(message.embeds)
            await message.channel.send({embeds: message.embeds, components: [row]})
            message.delete()
        }
    }
})

bot.on("interactionCreate", async interaction => {
    console.log(interaction)
    if (interaction.customId === "Accept") {
        let array = interaction.message.embeds[0].footer.text.split(' ')
        let userid = array[0]
        let username = await boblox.getUsernameFromId(userid)
        let logChannel = await interaction.message.guild.channels.cache.get(options.logChannel)
        logChannel.send({['content']: `${interaction.user.username} accepted ${username}`, ['embeds']: interaction.message.embeds})
        if (ranks[interaction.message.channel.id] !== null) {
            await boblox.setRank(options.groupId, parseInt(userid), ranks[interaction.message.channel.id])
        }
        await interaction.message.delete()
    }
})

bot.login(options.botToken)