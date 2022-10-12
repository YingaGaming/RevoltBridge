const config = require('../../../config')
const mongo = require('../../util/mongo')

module.exports.run = async(revolt, discord, message, args) => {
    if (!args[0]) return message.reply(`${config.prefix}link <DISCORD_CHANNEL_ID>`)

    if (!message.member.hasPermission(message.channel.server, 'ManageChannel')) return message.reply('You need to have the ManageChannel permission to do this!')

    let discordChannel = discord.channels.resolve(args[0])
    if (!discordChannel) return message.reply('Specified channel does not exist')

    if (await mongo.queryOne('Channels', { revolt: message.channel._id })) return message.reply('Revolt channel is already linked!')
    if (await mongo.queryOne('Channels', { discord: discordChannel.id })) return message.reply('Discord channel is already linked!')

    let webhook = await discordChannel.createWebhook({
        name: 'Revolt',
        avatar: 'https://github.com/revoltchat/documentation/raw/master/static/img/logo.png',
        reason: `${message.channel.name} | Linked by ${message.member.user.username}`
    })

    mongo.insert('Channels', {
            discord: discordChannel.id,
            revolt: message.channel._id,
            discordWebhook: webhook.url
        })
        .then(() => {
            message.reply(`Linked **${message.channel.name}** to **${discordChannel.name}**`)
        })

}