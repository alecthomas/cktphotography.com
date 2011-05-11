$(document).ready(function () {
  // The first two images are present in the HTML, and loaded immediately. The
  // remainder only start loading after the slideshow starts.
  var stack = ['images/fp03.jpg', 'images/fp04.jpg', 'images/fp05.jpg',
               'images/fp06.jpg', 'images/fp07.jpg', 'images/fp08.jpg',
               'images/fp09.jpg', 'images/fp10.jpg', 'images/fp11.jpg',
               'images/fp12.jpg']; 

  // After the second image loads, start loading the remainder.
  $($('#slideshow img').get(1)).load(function () {
    $('#slideshow img[src*=images/1x1.gif]').each(function () {
      $(this).attr('src', stack.shift());
    });
  }).each(function () {
    if (this.complete || this.readyState === 4) {
      $(this).trigger('load');
    }
  });
  
  var CONTROLS_OPACITY = 0.5;
  var CONTROLS_DELAY = 750;
  var paused = false;
  var pauseTimer = null;
  var animating = false;
  var overSlideshow = false;

  function resetControls(src, opacity) {
    opacity = opacity || 0.0;
    if (src) {
      $('img.controls').attr('src', src);
    }
    cancelAnimation();
    $('img.controls').animate({left: '37%', top: '32%', width: '200px', height: '200px', opacity: opacity}, 0);
  }

  function cancelAnimation() {
    clearTimeout(pauseTimer);
    $('img.controls').stop();
  }

  function resume() {
    resetControls('images/play.png', CONTROLS_OPACITY);
    $('img.controls').animate({left: '24%', top: '22%', width: '400px', height: '300px', opacity: 0.0}, 'fast', 'swing', function () {
      resetControls('images/pause.png');
      overSlideshow = false;
    });
    $(this).cycle('resume');
  }

  function pause() {
    resetControls('images/pause.png', CONTROLS_OPACITY);
    $('img.controls').animate({left: '24%', top: '22%', width: '400px', height: '300px', opacity: 0.0}, 'fast', 'swing', function () {
      resetControls('images/play.png');
      overSlideshow = false;
    });
    $(this).cycle('pause');
  }

  $('#slideshow')
  .mousemove(function (e) {
    if (!overSlideshow) {
      $(this).mouseover();
    }
  })
  .hover(function () {
    overSlideshow = true;
    clearTimeout(pauseTimer);
    pauseTimer = setTimeout(function () {
      resetControls();
      $('img.controls').animate({opacity: CONTROLS_OPACITY});
    }, CONTROLS_DELAY);
    $('#slideshow').cycle('pause');
  }, function () {
    overSlideshow = false;
    cancelAnimation();
    $('img.controls').animate({opacity: 0.0});
    if (!paused) {
      $('#slideshow').cycle('resume');
    }
  })
  .click(function () {
    if (paused) {
      resume();
    } else {
      pause();
    }
    paused = !paused;
  })

  $('#slideshow img:first').load(function () {
    $('#slideshow')
    .fadeIn('slow', function() {
      $(this).cycle({
        fx: 'fade',
        after: function (curr, next, options) {
          overSlideshow = false;
          paused = false;
          clearTimeout(pauseTimer);
          $('.controls').remove();
          $('.slide', next).after('<img class="controls" src="images/pause.png">');
          resetControls();
        }
      });
    });
  }).each(function () {
    if (this.complete || this.readyState === 4) {
      $(this).trigger('load');
    }
  });
});
