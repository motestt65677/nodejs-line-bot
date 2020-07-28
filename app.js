'use strict';
const result = require('dotenv').config();
if (result.error) throw result.error

const linebot = require('linebot');
const Express = require('express');
const BodyParser = require('body-parser');
// const http = require("http");
// const request = require('request');
const axios = require('axios');


// Line Channel info
const bot = linebot({
  channelId: process.env.LINE_CHANNEL_ID,
  channelSecret: process.env.LIEN_CHANNEL_SECRET,
  channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN,
});

const linebotParser = bot.parser();
const app = Express();
// for line webhook usage
app.post('/linewebhook', linebotParser);

app.use(BodyParser.urlencoded({ extended: true }));
app.use(BodyParser.json());

// a http endpoint for trigger broadcast
app.post('/broadcast', (req, res) => {
  bot.broadcast(req.body.message).then(() => {
    res.send('broadcast ok');
  }).catch(function (error) {
    res.send('broadcast fail');
  });
});

app.listen(8080);

// echo user message
bot.on('message', function (event) {
    var input = event.message.text;
    console.log(input);
    axios.get('http://api.giphy.com/v1/gifs/search?api_key=EH2saWyOaOtrBwqyUWii2wPwv0sOLhN7&q='+input)
    .then(response => {
        var total = response.data["data"].length;
        var num = Math.floor(Math.random() * Math.floor(total));
        // console.log(num);
        var imageUrl = response.data["data"][num]["images"]["original"]["url"];
        // console.log(response.data);
        // console.log(response.data.explanation);
        var replyMsg = {
            "type": "template",
            "altText": "GIF",
            "template": {
                "type": "image_carousel",
                "columns": [
                    {
                        "imageUrl": imageUrl,
                        "action": {
                        "type": "uri",
                        "label": "link",
                        "uri": imageUrl
                        }
                    }
                ]
            }
        };
        event.reply(replyMsg).then(function (data) {
            console.log('ok')
        }).catch(function (error) {
            console.error(error)
        });

    })
    .catch(error => {
        console.log(error);
    });
});