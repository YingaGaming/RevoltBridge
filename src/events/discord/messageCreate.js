const mongo = require('../../util/mongo')
const config = require('../../../config')
const fs = require('fs')

module.exports = (revolt, discord, message) => {

    if (!message.member || message.author == discord.user) return

    if (message.content.toLowerCase().startsWith(config.prefix)) {
        if (message.author.bot) return
        let args = message.content.split(config.prefix)
        args.shift()
        args = args.join('').split(' ')
        let command = args[0].toLowerCase()
        args.shift()

        if (!fs.existsSync(`./src/commands/discord/${command}.js`)) return

        require(`../../commands/discord/${command}.js`).run(revolt, discord, message, args)

        return
    }

    let channelID = message.channel.id
    let content = message.content
    let username = message.member.displayName
    let avatar = message.member.avatarURL() || message.author.avatarURL()
    let color = message.member.roles.hoist.hexColor

    mongo.queryOne('Channels', { discord: channelID })
        .then(channels => {
            if (!channels) return
            let revoltChannel = revolt.channels.get(channels.revolt)
            revoltChannel.sendMessage({
                content: content,
                masquerade: {
                    name: username,
                    avatar: avatar,
                    colour: color // Brits, amirite?
                }
            })
        })
}