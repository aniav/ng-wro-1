var EM = EM || {};

EM.Media = (function () {

    var enabled = false;

    function slideEnter() {
        var $slide;

        if (!enabled) {
            return;
        }

       $slide = scene.getCurrentSlide();

        if (!$slide || !$slide.length) {
            // try {
            //     slideNum = scene.currentSlideNum();
            // } catch (e) {
            //     slideNum = " scene.currentSlideNum() return error: " + e;
            // }

            //  $.post("../present/logError", { source: "videopPlayer.js/handleSlideChange", message: "scene.getCurrentSlide() did not return a slide. the current slide num is: " + slideNum });
            console.warn('no slide returned by scene.getCurrentSlide() function');
            return;
        }
        $mediaElements = $slide.children('.edit-wrapper').children('.sd-element-media');

        $mediaElements.each(function () {
            var $this = $(this);
            if ($this.attr('data-mediaautoplay')) {
                this.play();
            }

        });
    }

    function slideExit() {
        $('[data-mediaautoplay="true"]').each(function () {
            if ( this.pause ){
                this.pause();
            }
        });
    }

    function slideExit() {
      

    }

    $(document).ready(function () {
        $('#scene').on('transitionDone', slideEnter);
      //  $('#scene').on('transitionStart', slideExit);

        $('#scene').on('transitionStart', function () {
            $('[data-mediaautoplay="true"]').each(function () {
                this.pause();
            });
        });

    });


    //stops mp3 and mp4 files sfrom playing inside of the sd-element-media elements
    function stopAllMedia() {
        $('.sd-element-media').each(function () {
            this.pause();
        });
    }

    function toggleEnabled(isEnabled) {
        enabled = isEnabled;
    }

    return {
        stopAllMedia: stopAllMedia,
        toggleEnabled: toggleEnabled
    }

})();
