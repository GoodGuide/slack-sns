import express from 'express'
import bodyParser from 'body-parser'
import logfmt from 'logfmt'

import { handleMessage } from './handlers'

var app = express()
app.use(logfmt.requestLogger())
app.use(bodyParser.json({ type: 'text/plain' })) // because SNS doesn't type

app.post('/channel/:channel', function(req, res) {
  if (!req.body) {
    console.warn('[WARN] no body received')
    res.send('no body...?')
  } else if (req.body.SubscribeURL || req.body.Message) {
    handleMessage(req.body, res, '#' + req.params.channel)
  } else {
    console.warn('[WARN] meaningless body received.', Object.keys(req.body))
    res.send('wut?')
  }
})

var port = Number(process.env.PORT || 5000)
app.listen(port, function() {
  console.log('Listening on', port)
})
