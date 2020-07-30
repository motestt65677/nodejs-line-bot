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
    var rawInput = event.message.text;
    
    //line sticker
    if(typeof rawInput === 'undefined' || rawInput == undefined)
        return;
    
    if(rawInput.toLowerCase() == "info"){
        var replyMsg = {
            "type": "text",
            "text": `輸入 # + 想要查詢的英文關鍵字 (ex. #dance, #friends) 會得到一張隨機的GIF`
        };
        event.reply(replyMsg);
        return;
    }


    if(rawInput.startsWith("#")){
        var input = rawInput.substr(1);

        //english only
        var english = /^[A-Za-z0-9]*$/;
        if (!english.test(input)){
            console.log("not english");
            return;
        }
        
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
                    ],
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
    }
        
    
});
