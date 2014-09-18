var scene = (function () {

    var config = {
        layers: 3
    };

    var ourDiv;
    
    var currentTimeout;
    var $currentElement;
    var TO_currentTransition = false;  // like current timeout. delays the removal of classes from world/slide/bglayer
    var $viewportDiv; //the div suppied by editor or player in which in scene runs. 
    var $world; //the outermost container of the scene
    var $layerbox;  //container for x number of layer elements. 
    var $layers; 
    var $slideBox;  //container for slides. same size as slides.
    var $currentSlide; //slide in view.
    var $frame; //topmost element.         
    var $bgBox;
    var $bgLayers;
    var templates = {
        world: '<div id="world">',
        layerbox: '<div id="layer-box">',
        layer: '<div class="layer">',
        slideBox: '<div id="slide-box">',
        frame: '<div id="frame">',
        slide: '<div class="slide pre-enter-left">',        
        bgBox: '<div id="bg-box">',
        bgLayer: '<div class="bg-layer pre-enter-left">'
    };

    //NOTE: slides in scenes are not zero indexed. Therefore 1 is added or substracted from all index related operations. 
    function init(viewportDivID) {
        clearParams(); // in case of editor=>player reset
        ourDiv = document.getElementById(viewportDivID);
        $viewportDiv = $('#' + viewportDivID);
        $world = $(templates.world).appendTo($viewportDiv);
        $slideBox = $(templates.slideBox).appendTo($world);
        $layerbox = $(templates.layerbox).appendTo($world);

        // $frame = $(templates.frame).appendTo($viewportDiv); // not required anymore and blocks mouse clicks on videos
        $bgBox = $(templates.bgBox).appendTo($world);

        $viewportDiv.css({ height: $viewportDiv.parent().height + 'px', width: $viewportDiv.parent().width + 'px' });
        
        //$(window).on('resize', scale);
        var TO = false;
        $(window).resize(function (event) {
            if (this != event.target)
                return;
            if (TO !== false)
                clearTimeout(TO);
            TO = setTimeout(scale, 600); //200 is time in miliseconds
        });

        for (var i = 0; i < config.layers; i++) {
            $(templates.layer).appendTo($layerbox);
        }
        $layers = $layerbox.children();
        //set transition starting position
        $layers.removeClass('trans-pre-to-left').addClass('trans-pre-to-right');//set pre transition translation

        scale();

        if ( document.readyState == 'complete' ){
            loadFinished();
        } else {
            setTimeout(loadFinished(), 3000);
        }
    };

    //TODO make more intelligent
    function loadFinished() {
        $('body').triggerHandler('loadfinished');
    }

    function clearParams() {
        ourDiv = null;
        currentTimeout = null;
        $currentElement = null;

        $viewportDiv=null; //the div suppied by editor or player in which in scene runs. 
        $world=null; //the outermost container of the scene
        $layerbox=null;  //container for x number of layer elements. 
        $slideBox=null;  //container for slides. same size as slides.
        $currentSlide=null; //slide in view.
        $frame=null; //topmost element.         
        $bgBox=null;
        $bgLayers = null;
        TO_currentTransition = null;
    }

    function scale() {
        if ($('#world').css('content') == 'resize-center')
            centerScale();
        else
            oldScale();
    }

    function insertSlide(slideNum, html) {
        var tempPlace = addSlide(html);
        if (tempPlace == slideNum)
            return;
        moveSlide(tempPlace, slideNum);
    }

    function centerScale() {
        var wW = ourDiv.parentNode.offsetWidth;
        var wH = ourDiv.parentNode.offsetHeight;
        
        var scaler = Math.min(wW / 1920, wH / 1080); // original screen was designed in full HD Chrome
        var w = wW / scaler;
        var h = wH / scaler;
        var left = (w - scaler * w) / 2 - (w - 1920) / 2 * scaler;
        var top = (h - scaler * h) / 2 - (h - 1080) / 2 * scaler;


        var style = "width:" + w + "px; height:" + h + "px;" + allStyles("-webkit-transform:  translate(-" + left + "px,-" + top + "px) scale(" + scaler + ");");

        ourDiv.setAttribute("style", style);
        //redrawScene();
        //            stepToSlide(currentSlide);
    }

    // should get a line with a single webkit command, and will multiply it and add other extensions
    function allStyles(style) {
        var styles = style;
        styles += " " + style.replace(/webkit/g, "moz"); // mozilla
        styles += " " + style.replace(/webkit/g, "ms"); // Microsoft Explorer
        styles += " " + style.replace(/webkit/g, "o"); // Opera
        styles += " " + style.replace(/-webkit-/g, ""); // generic

        return styles;
    }


    /*function scale($element) {
        var $toScale = $viewportDiv;

        $toScale.each(function () {
            var margin = parseInt($toScale.css('margin'));
            $toScale.css('margin', '0');
            scaleElement($toScale, $toScale.parent(), margin);
            centerInParent($toScale);
        });
    }*/
       //old scale function
    function oldScale() {
        ourDiv.setAttribute("style", ""); // might cause problems with future scenes? maybe better do it somehow in the css
            var margin = parseInt($slideBox.css('margin'));
             $slideBox.css('margin', '0');
            scaleElement($slideBox, $world, margin);
            centerInParent($slideBox);
        }
    
    //copied exactly fromt he toher scenes


    function getSLideBoundingClientRect() {

        return $slideBox.get(0).getBoundingClientRect();

    }

    //centers absolutley positioned element in parent
    function centerInParent($element) {
        var $parent = $element.parent();
        var scaleFactor = $element.attr('scale-factor') || 1;  //TODO use boundingclientrect instead of scalefactor
        var wdelta = $parent.width() - ($element.width() * scaleFactor);
        var hdelta = $parent.height() - ($element.height() * scaleFactor);
        $element.css({
            left: wdelta / 2 + 'px',
            top: hdelta / 2 + 'px'
        });
    }

    function scaleElement($element, $context, margin) {
        margin = margin || 0;
        var
            w = $element.width(),
            h = $element.height(),
            dw = $context.width() - margin,
            dh = $context.height() - margin,
            widthDelta,
            heightDetla,
            minDelta,
            maxDelta,
            transform;

        widthDelta = dw / w;
        heightDetla = dh / h;
        minDelta = Math.min(widthDelta, heightDetla);

        transform = 'scale(' + minDelta + ',' + minDelta + ')';

        $element.css('-webkit-transform', transform).attr('scale-factor', minDelta)
        $element.css('-moz-transform', transform).attr('scale-factor', minDelta)
        $element.css('transform', transform).attr('scale-factor', minDelta)
        return minDelta;
    }

    function addSlide(html) {
        var $toAdd = $(html || '');
        var $slide;
        var $bgLayer;

        $slide = $toAdd.is('.slide') ? $toAdd : $(templates.slide).append($toAdd);        
        $slide.appendTo($slideBox);

        //add z-index according to slide child position
        $('#slide-box > .slide:nth-child(' + ($slide.index() + 1) + ')').css('z-index', ($slide.index() + 3));

        $bgLayer = $(templates.bgLayer).appendTo($bgBox);

        $slide.data('bgLayer', $bgLayer);

        $bgLayers = $('.bg-layer'); //re-querry the value of bglayers to include the new layer.
        //OR more do this for more efficient but not yet tested
        //$bgLayers = $bgLayers.add($bgLayer); 

        return $slide.index() + 1; //return new slide count in convention with other scenes.
    }

    function currentSlideNum() {
        return $currentSlide ? $currentSlide.index() + 1 : 0;
    }
    //slides are not zero indexed
    function getSlide(num) {
        return $($slideBox.children()[num - 1]);
    }

    function withBgLayer($slide) {
        return $slide.add($slide.data('bgLayer'));
    }

   
    function goSlide(num) {

        var back = false;
        if (currentSlideNum() == num)
            return; // note: do not go to same slide, hope nobody builds on this behavior

        

        setPreEnters();

        if ($currentSlide && num < $currentSlide.index() + 1) {
            back = true;
            //    console.log("back is true");
        }
        if (currentTimeout) {
            clearTimeout(currentTimeout);
            currentTimeout = null;
        }
        //need to kill te animation here
        if ($currentElement) {
            endTransition($currentElement);
            $currentElement = null;
        }

        var $targetSlide = getSlide(num);
        
        var transitionTicks; //time alotted for css transition or video
        var bgTicks;
        var $bgLayer;

        if ($targetSlide.length === 0) {
            return;
        }

        if ($currentSlide) {            
            $bgLayer = $currentSlide.data('bgLayer');

            if ($bgLayer) {
                bgTicks = getTransitionTime($bgLayer);
                setTimeout(function () { resetClass($bgLayer); }, bgTicks);
            }
            
            if (TO_currentTransition) {
                withBgLayer($currentSlide).add($world).removeClass('exit-right exit-left'); // end a pre-exisitng transition NOW 
                clearTimeout(TO_currentTransition);  // prevent pending timeout from prev transition from ending the new transtiion.
            }
            if (back) { //right/left names are reversed for layers versus world. this is confusing. consider changing  

               withBgLayer($currentSlide).add($world).removeClass('exit-right');
               withBgLayer($currentSlide).add($world).addClass('notransition');
                setTimeout(function (){
                    withBgLayer($currentSlide).add($world).removeClass('notransition');
                    setTimeout(function (){
                    withBgLayer($currentSlide).add($world).addClass('exit-right')
                    }, 100);
                }, 10);
                //withBgLayer($currentSlide).add($world).addClass('exit-right');
             
            } else {
                    //withBgLayer($currentSlide).add($world).removeClass('exit-left');
                    withBgLayer($currentSlide).add($world).addClass('notransition');
                    setTimeout(function (){
                        withBgLayer($currentSlide).add($world).removeClass('notransition');
                        setTimeout(function (){
                        withBgLayer($currentSlide).add($world).addClass('exit-left')
                        }, 100);
                    }, 10);
                    //withBgLayer($currentSlide).add($world).addClass('exit-left');
             
            }

            TO_currentTransition =  setTimeout(function(){
                 $world.removeClass("exit-left exit-right");
            }, 2200);

            //        if($video && $video.length === 1){
            //           if(oldSlideNum < num) {
            //                $video.data('prevTime', $video.get(0).currentTime);
            //               $video.get(0).play();
            //           }else{
            //             console.log($video.get(0).currentTime);  //TODO: need to factor in jumping to different slides. in fact- each slide will need its own time marker in the video.
            //           }
            //       }
        }
        transitionTicks = getTransitionTime($targetSlide);
        transitionTicks ? delayTranstionDone(transitionTicks * 2200, $currentSlide) : endTransition($currentSlide); //on the first go slide event, the current slide will be null. this exception is handled down the chain.

        withBgLayer($targetSlide).removeClass('pre-enter-left').removeClass('pre-enter-right');  //show the target slide with its bg layer
        if (back){
            //withBgLayer($targetSlide).removeClass('enterRight');
            withBgLayer($targetSlide).addClass('notransition');
                    setTimeout(function (){
                        withBgLayer($targetSlide).removeClass('notransition');
                        setTimeout(function (){
                        withBgLayer($targetSlide).addClass('enterLeft')
                        }, 100);
                    }, 10);
            //withBgLayer($targetSlide).addClass('enterRight');
        }
        else {
            //withBgLayer($targetSlide).removeClass('enterLeft');
            // withBgLayer($targetSlide).addClass('notransition');
            //         setTimeout(function (){
            //             withBgLayer($targetSlide).removeClass('notransition');
            //             setTimeout(function (){
            //             withBgLayer($targetSlide).addClass('enterRight')
            //             }, 100);
            //         }, 10);
            withBgLayer($targetSlide).addClass('enterRight');
        }

        $currentSlide = $targetSlide;
        
        $viewportDiv.trigger('transitionStart', [num]);

        $viewportDiv.attr('slide', currentSlideNum());
        setPreEnters();
    }
    
    function getTransitionTime($element) {
        return 0.9;

        if (!$element) {
            console.warn("scene getTransitionTime function recevied empty element");
            return 0;
        }

        var duration = parseInt($element.css('-webkit-transition-duration') || $element.css('-moz-transition-duration') || $element.css('transition-duration') || $element.css('ms-transition-duration'));
        var delay = parseInt($element.css('-webkit-transition-delay') || $element.css('-moz-transition-delay') || $element.css('transition-delay') || $element.css('ms-transition-delay'));
        return duration + delay;
    }

    function delayTranstionDone(delay, $element) {
        $currentElement = $element;
        currentTimeout = setTimeout(function () {
            endTransition($element);
            $currentElement = null;
            currentTimeout = null;
        }, delay);
    }

    function resetClass($element) {
        
        if (!$element) {
            console.warn("scene resetClass function recieved empty element");
            return;
        }
        withBgLayer($element).removeClass('exit-left').removeClass('exit-right').removeClass('enterLeft').removeClass('enterRight').removeClass('pre-enter-right').removeClass('pre-enter-left');

        setPreEnters();
    }

    function setPreEnters() {
        var current = 1;
        if ($currentSlide)
            current = $currentSlide.index() + 1;
        for (var i = 1; i <= $slideBox.children().length ; i++) {
            var $s = getSlide(i);
            if (i < current)
                withBgLayer($s).removeClass('pre-enter-right').removeClass('notransition').addClass('pre-enter-left');
            if (i > current)
                withBgLayer($s).removeClass('pre-enter-left').removeClass('notransition').addClass('pre-enter-right');
        }
    }

    function endTransition($element) {
        $viewportDiv.trigger('transitionDone');
        resetClass($element);        
    }

    function setSlideHTML(slideNum, html) {
        getSlide(slideNum).html(html);
    }

    function removeHTML(slideNum) {
        getSlide(slideNum).addClass('hide-elements');  //not actually removing html, but keeping name for compatability with other scenes.
    }
    function restoreHTML(slideNum) {
        getSlide(slideNum).removeClass('hide-elements');
    }

    function rewind() {
        goSlide(1);
    }

    function nextSlide() {
        goSlide(currentSlideNum() + 1);
    }
    function prevSlide() {
        goSlide(currentSlideNum() - 1);
    }

    function moveSlide(fromIdx, toIdx) {
        var $targetslide = getSlide(fromIdx);

        if ($targetslide && $targetslide.length === 1) {
            if (toIdx === 1) {
                $slideBox.prepend($targetslide);
            } else if (toIdx < fromIdx) {
                getSlide(toIdx).before($targetslide);
            } else {
                getSlide(toIdx).after($targetslide);
            }
        }
        resetBgLayers();
		
		goSlide(toIdx);
    }

    function resetBgLayers() {
        $bgLayers = $bgLayers || $bgBox.find('.bg-layer');

        $slideBox.find('.slide').each(function (index) {
            $(this).data('bgLayer', $($bgLayers[index]));
        });
    }


    function deleteSlide(slideNum) {
        withBgLayer(getSlide(slideNum)).remove();
    }

    function manualMove() {
        //empty function to prevent bugs when player calls this method. TODO: have player check if method exists.
    }

    function getCurrentSlide() {
        return $currentSlide;
    }

    return {
        init: init,
        addSlide: addSlide,
        currentSlideNum: currentSlideNum,
        getCurrentSlide: getCurrentSlide,
        goSlide: goSlide,
        rewind: rewind,
        nextSlide: nextSlide,
        prevSlide: prevSlide,
        setSlideHTML: setSlideHTML,
        removeHTML: removeHTML,
        restoreHTML: restoreHTML,
        moveSlide: moveSlide,
        manualMove: manualMove,
        getSLideBoundingClientRect: getSLideBoundingClientRect,
        deleteSlide: deleteSlide,
        resizeWinner: scale,
        insertSlide: insertSlide
    };

})();
