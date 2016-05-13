var $video = $('#media-video');
// Highlight text as video is playing 

function secondsSpanToSpan(secondsSpan) { 
    if(!secondsSpan || !secondsSpan.indexOf(':')) return 0;
    var parts = secondsSpan.split(':');
    return + parts[0] * 60 + parts[1];
}

function settingUpChange(spanCues) { 
    var change = []; 
    for(var i = 0; i < spanCues.length; i++) {
        if(i == spanCues.length - 1) {
            change.push({
                lowerSec: secondsSpanToSpan($(spanCues[i]).attr('data-time')), 
                upperSec: Math.floor($video[0].duration),                      
                highlightedText: spanCues[i] 
            });
        } else {
            change.push({
                lowerSec: secondsSpanToSpan($(spanCues[i]).attr('data-time')),
                upperSec: secondsSpanToSpan($(spanCues[i + 1]).attr('data-time')),
                highlightedText: spanCues[i] 
            });
        }

    }
    return change;
}

function timeFromSpanToSpan(change, currentTime) {  
    var lowerBoundSeconds = change.lowerSec;
    var upperBoundSeconds = change.upperSec;
    return lowerBoundSeconds <= currentTime && currentTime < upperBoundSeconds;
}


$(function () {
    var spansText = $('span[data-time]'); 
    var changes = settingUpChange(spansText); 
    $video[0].addEventListener('timeupdate', function () {
        $('span[data-time]').removeClass('colored');
       for(var i = 0; i < changes.length; i++) {
            if(timeFromSpanToSpan(changes[i], $video[0].currentTime)) {
                $(changes[i].highlightedText).addClass('colored');
           }
        }
    });

});