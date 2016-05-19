// MEDIA PLAYER //

// Video
var mediaPlayer = document.getElementById('media-video'); //or
var mediaPlayer = $('#media-video').get(0);
var mediaPlayer = $('#media-video')[0];
var $mediaPlayer = $('#media-video');
var $nowTime = $('#current-time');

// Containers
var $mediaContainer = $('#media-player');
var $mediaControls = $('#media-controls');


// Buttons
var $playBtn = $('#play-pause-button');
var $volumeBtn = $('#volume');
var $fullScreenBtn = $('#fullscreen-button');
var $replayBtn = $('#replay-button');
var $CloseCapBtn = $('#close-captions');

// Sliders
var $bufferBar = $('.bufferBar');
var $volumeBar = $('#volume-bar');
var $volumeBarBack = $('#volume-bar-back');


/* UNIVERSAL FUNCTIONS 
-------------------------------------------------------*/

// function to change title, innerhtml and class name of buttons
function changeButtonType(btn, value) { 
     btn.attr('title', value);
     btn.attr('class', value); 
}



/* SEEK BAR 
--------------------------------------------------------*/

// update the seek bar as the video plays
$mediaPlayer.on('timeupdate', function () {
    var current = mediaPlayer.currentTime;
    var max = mediaPlayer.duration;
    var percentage = 100 * current / max;
    $('.timeBar').css('width', percentage+'%');
});

var dragTime = false;
$('.progressBar').mousedown(function(value) {
    dragTime = true;
    updateSeek(value.pageX);
});

// no matter where the user releases mouse, update seek bar
$(document).mouseup(function(value) {
    if (dragTime) {
        dragTime = false;
        updateSeek(value.pageX);
    }
});

// update seek bar when user drags
$(document).mousemove(function(value) {
    if (dragTime) {
        updateSeek(value.pageX);
    }
});

// Function to control seek bar
function updateSeek(value) {
    var progress = $('.progressBar');
    var max = mediaPlayer.duration;
    var clickPos = value - progress.offset().left;
    var percentage = 100 * clickPos / progress.width();
    
    if (percentage > 100) {
        percentage = 100;
    }
    if (percentage < 0) {
        percentage = 0;
    }
    
    // Update video time and progress bar position
    $('.timeBar').css('width', percentage+'%');
    mediaPlayer.currentTime = max * percentage / 100;
}

// Function for displaying buffer state

window.onload = function () {

    $mediaPlayer.on('progress', function () {
        var bufferEnd = mediaPlayer.buffered.end(mediaPlayer.buffered.length - 1);
        var duration = mediaPlayer.duration;
        

        if(bufferEnd > 0) {
            var percentage = 100 * (bufferEnd / duration);
            $bufferBar.css('width', percentage+'%');
        }
    });
};

/* TIME INDICATOR 
--------------------------------------------------------*/

// handler for updating time with timeupdate event
$mediaPlayer.on('timeupdate', function () {
    updateTimeDisplay();
});

function updateTimeDisplay() {
    $nowTime.html(formatTime(mediaPlayer.currentTime) + ' / ' + formatTime(mediaPlayer.duration));
}

function formatTime(seconds) {
    seconds = Math.round(seconds);
    var minutes = Math.floor(seconds / 60);
    minutes = (minutes >= 10) ? minutes : '0' + minutes;
    seconds = Math.floor(seconds % 60);
    seconds = (seconds >= 10) ? seconds : '0' + seconds;
    return minutes + ':' + seconds;
}

/* BUTTONS 
--------------------------------------------------------*/

// Play/Pause
 $playBtn.on('click', function () { 
        if (mediaPlayer.paused || mediaPlayer.ended) { 
            $(this).attr('type', 'pause');
            $(this).attr('class', 'pause'); 
            $(this).attr('title', 'Pause');
            mediaPlayer.play(); 
        } else { 
            $(this).attr('type', 'play');
            $(this).attr('class', 'play');
            $(this).attr('title', 'Play');
            mediaPlayer.pause(); 
        } 
 });

// Direct click on video frame play/pause
$mediaPlayer.on('click', function () {
    if (mediaPlayer.paused === true) {
        mediaPlayer.play();
        changeButtonType($playBtn, 'pause');
    } else {
        mediaPlayer.pause();
        changeButtonType($playBtn, 'play');
    }
});

// Fullscreen
/* Toggle Full Screen Button */
$fullScreenBtn.click(function() {
    toggleFullScreen();
  });
  
  function toggleFullScreen() {
   var videoDiv = document.getElementById('media-player');
    if (!document.fullscreenElement &&
        !document.mozFullScreenElement && !document.webkitFullscreenElement && !document.msFullscreenElement ) {
      if (videoDiv.requestFullscreen) {
        videoDiv.requestFullscreen();
      } else if (videoDiv.msRequestFullscreen) {
        videoDiv.msRequestFullscreen();
      } else if (videoDiv.mozRequestFullScreen) {
        videoDiv.mozRequestFullScreen();
      } else if (videoDiv.webkitRequestFullscreen) {
        videoDiv.webkitRequestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      }
    }
  }


// Volume Bar and Back
$volumeBar.on('input', function() {
    mediaPlayer.volume = document.getElementById('volume-bar').value;
    if (mediaPlayer.volume === 0) {
        $volumeBtn.addClass('volume-off');
    } else if (mediaPlayer.volume > 0) {
        $volumeBtn.removeClass('volume-off');
    }
});

// Added due to IE not working with 'input'
$volumeBar.on('change', function() {
    mediaPlayer.volume = document.getElementById('volume-bar').value;
    if (mediaPlayer.volume === 0) {
        $volumeBtn.addClass('volume-off');
    } else if (mediaPlayer.volume > 0) {
        $volumeBtn.removeClass('volume-off');
    }
});

$volumeBtn.on('click', function() {
    $volumeBtn.toggleClass('volume-off');
    if (mediaPlayer.volume > 0) {
        mediaPlayer.volume = 0;
        $volumeBar.val(0);
    } else if (mediaPlayer.volume === 0) {
        mediaPlayer.volume = .5;
        $volumeBar.val(.5);
    }
});

// Controlling visible state on hover
$('#volume, #volume-bar, #volume-bar-back').hover(function() {
    $volumeBar.removeClass('hidden');
    $volumeBarBack.removeClass('hidden');
});

$('#volume, #volume-bar, #volume-bar-back').mouseleave(function() {
    $volumeBar.addClass('hidden');
    $volumeBarBack.addClass('hidden');
});

// Replay
$replayBtn.on('click', function () {
    mediaPlayer.currentTime = 0; 
    changeButtonType($playBtn, 'pause'); 
    mediaPlayer.play(); 
});

// Close Caption

// disable any possible default cc's. loop through the array of possible tracks and disable

for (var i = 0; i < mediaPlayer.textTracks.length; i++) {
   mediaPlayer.textTracks[i].mode = 'hidden';
}

$CloseCapBtn.on('click', function() {
    if (mediaPlayer.textTracks[0].mode === 'hidden') {
        mediaPlayer.textTracks[0].mode = 'showing';
    } else {
        mediaPlayer.textTracks[0].mode = 'hidden';
    }
});


/* HIDE/SHOW CONTROLS 
--------------------------------------------------------*/

$mediaContainer.mouseenter(function() {
    $mediaControls.fadeIn(100);    
});

$mediaContainer.mouseleave(function() {
    $mediaControls.fadeOut(100);
});


/* VIDEO TRANSCRIPT 
--------------------------------------------------------*/

// convert time to seconds
function timeToSeconds(v) {
    var p = v.split(':'),
        s = 0, 
        m = 1;

    while (p.length > 0) {
        s += m * parseInt(p.pop(), 10);
        m *= 60;
    }

    return s;
}

// initalizing timestamp array
var timestamps = [],
    all = 0,
    old = 0,
    i = 0;

// iterate through each span containing 'data-time' and store start time, end-time as well as the html string
$('span[data-time]').each( function() {
    timestamps.push({
      start : timeToSeconds($(this).attr('data-time')),
      end : timeToSeconds($(this).attr('data-end')),
      elm : $(this)
    });

});

// store length of timestamp values
all = timestamps.length; 

// function that will check if time falls between time start and end and apply highlight color if true
function highlightText(time){
    for(i = 0; i < all; i++){
        if(time >= timestamps[i].start && time <= timestamps[i].end){
          timestamps[i].elm.addClass('highlight');
        } else {
          timestamps[i].elm.removeClass('highlight');
        }
    }
}

// bind a handler to video to run highlight function when the video plays
$('#media-video').on('timeupdate', function() {
    var now = parseInt(this.currentTime);
    // only run highight function if a second has passed
    if(now > old) {
        highlightText(now);
    }
    old = now;

});

// direct click on transcript will shift video
$("span").click(function() {
	var transcriptTime = $(this).attr("data-time");
	$mediaPlayer[0].currentTime = timeToSeconds(transcriptTime);
    highlightText($mediaPlayer[0].currentTime);
});

// function to set line position of CC track based on window width
(function() {
    var track = document.getElementById('tracks').track;
    var allCues = track.cues;
    if ($(window).width() <= 600) {
        for (i=0; i < allCues.length; i++) {
            allCues[i].line = 8;
        }
    } else if ($(window).width() <= 800) {
        for (i=0; i < allCues.length; i++) {
            allCues[i].line = 1;
        }
    }
})();















