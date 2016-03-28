'use strict';

var htmlparser = require("htmlparser2");
var os = require("os");
var request = require('request');
var cheerio = require('cheerio');

var player = document.getElementById("media-player");
var controls = document.getElementById("controls");
controls.addEventListener('click', function () {
    if (this.className == 'play-button') {
        controls.className = 'pause-button';
        player.play();
    } else {
        controls.className = 'play-button';
        player.pause();
    }
});

function setCurrentEpisode() {
    var url = 'http://www.kqed.org/radio/schedules/daily/index.jsp'
    request(url, function(err, resp, body) {
        if (err)
            throw err;
        var $ = cheerio.load(body);
        var date = new Date();
        var preface = (date.getMonth() + 1) + "/" + date.getDate() + "/" + date.getFullYear();
        var previous = null;

        $('ul.tv-daily-prog-list li').each(function() {
            var prog_time = $(this).find('div.prog-time').text().replace(/^\s+|\s+$/g, '');
            var loaded = Date.parse(preface + " " + prog_time);
            var prog_title = $(this).find('span.prog-title').text().replace(/^\s+|\s+$/g, '');
            var ep_title = $(this).find('strong.ep-title').text().replace(/^\s+|\s+$/g, '');
            var prog_desc = $(this).find('span.prog-descr').text().replace(/^\s+|\s+$/g, '');

            var obj = {
                'title': prog_title,
                'episode': ep_title,
                'description': prog_desc,
                'ptime': loaded
            }

            if (loaded > date.getTime() && date.getTime() > previous.ptime) {
                document.getElementById("prog-title").innerHTML = previous.title;
                document.getElementById("ep-title").innerHTML = previous.episode;
                document.getElementById("prog-desc").innerHTML = previous.description;
            } else {
                previous = obj;
                return;
            }
        });
    });
}

setTimeout(setCurrentEpisode(), 30000);

var ipc = require('ipc');

var closeEl = document.querySelector('.close');
closeEl.addEventListener('click', function () {
    ipc.send('close-main-window');
});

ipc.on('global-shortcut', function () {
    var event = new MouseEvent('click');
    controls.dispatchEvent(event);
});
