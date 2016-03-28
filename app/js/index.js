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
        var hour = ((date.getHours() + 11) % 12 + 1);
        var suffix = (date.getHours() >= 12)? "pm" : "am";
        var period = hour + ":00 " + suffix;

        $('ul.tv-daily-prog-list li').each(function() {
            var prog_time = $(this).find('div.prog-time').text().replace(/^\s+|\s+$/g, '');
            if (prog_time != period) {
                return;
            }
            var prog_title = $(this).find('span.prog-title').text().replace(/^\s+|\s+$/g, '');
            var ep_title = $(this).find('strong.ep-title').text().replace(/^\s+|\s+$/g, '');
            var prog_desc = $(this).find('span.prog-descr').text().replace(/^\s+|\s+$/g, '');
            var outline = {
                'program': prog_title,
                'episode': ep_title,
                'description': prog_desc
            }
            document.getElementById("prog-title").innerHTML = prog_title;
            document.getElementById("ep-title").innerHTML = ep_title;
            document.getElementById("prog-desc").innerHTML = prog_desc;
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