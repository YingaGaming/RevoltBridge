const config = require('../../../config')
const mongo = require('../../util/mongo')

module.exports.run = async(revolt, discord, message, args) => {
    if (!args[0]) return message.reply(`${config.prefix}link <REVOLT_CHANNEL_ID>`)

    if (!message.member.permissions.has('ADMINISTRATOR')) return message.reply('You need to be an administrator to do this!')

    let revoltChannel = revolt.channels.get(args[0])
    if (!revoltChannel) return message.reply('Specified channel does not exist')

    if (await mongo.queryOne('Channels', { revolt: revoltChannel._id })) return message.reply('Revolt channel is already linked!')
    if (await mongo.queryOne('Channels', { discord: message.channel.id })) return message.reply('Discord channel is already linked!')

    let webhook = await message.channel.createWebhook({
        name: 'Revolt',
        avatar: 'https://github.com/revoltchat/documentation/raw/master/static/img/logo.png',
        reason: `${revoltChannel.name} | Linked by ${message.author.tag}`
    })

    mongo.insert('Channels', {
            discord: message.channel.id,
            revolt: revoltChannel._id,
            discordWebhook: webhook.url
        })
        .then(() => {
            message.reply(`Linked **${message.channel.name}** to **${revoltChannel.name}**`)
        })

}