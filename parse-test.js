var htmlparser = require("htmlparser2");
var os = require("os");
var request = require('request');
var cheerio = require('cheerio');

function getCurrentEpisode(cb) {
    var url = 'http://www.kqed.org/radio/schedules/daily/index.jsp'
    request(url, function(err, resp, body) {
        if (err)
            throw err;
        $ = cheerio.load(body);
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
            cb(outline);
        });
    });
}

getCurrentEpisode(function(show) {
    console.log(show);
})