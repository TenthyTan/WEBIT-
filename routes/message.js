const express = require('express')
const messageRouter = express.Router()
const messages = []
messageRouter.get('/messages', (req, res) => {
    return res.render('message', { messages }) 
})
messageRouter.post('/messages', (req, res) => { 
    const { message } = req.body 
    messages.push(message)
    return res.redirect('back')
})

router.post('/api/messages', (req, res) => { 
    const { message } = req.body 
    messages.push(message)
    return res.send(messages)
})
module.exports = messageRouter