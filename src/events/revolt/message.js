const mongo = require('../../util/mongo')
const request= require('cross-fetch')

module.exports = (revolt, discord, message) => {

    if(message.member.user.bot)return

    let channelID = message.channel._id
    let content = message.content
    let username = message.member.nickname || message.member.user.username
    let avatar = message.member.generateAvatarURL() || message.member.user.generateAvatarURL()
    
    mongo.queryOne('Channels', { revolt: channelID })
        .then(channels => {
            let webhook = channels.discordWebhook
            request(webhook, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    content: content,
                    username: username,
                    avatar_url: avatar
                })
            })
        })
}