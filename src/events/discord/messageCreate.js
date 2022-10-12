const mongo = require('../../util/mongo')

module.exports = (revolt, discord, message) => {

    if(!message.member)return

    let channelID = message.channel.id
    let content = message.content
    let username = message.member.displayName
    let avatar = message.member.avatarURL() || message.author.avatarURL()
    let color = message.member.roles.hoist.hexColor

    mongo.queryOne('Channels', { discord: channelID })
        .then(channels => {
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