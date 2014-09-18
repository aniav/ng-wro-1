function closeAllPopups() {
    $('.menu-popup').hide();
    $('.iframe-popup-container').hide();
    $('.iframe-popup').remove();
}

function openUpgradePopup() {
    $('#generic-upgrade-popup').removeClass('sleep');
    $('#generic-upgrade-popup').addClass('active');
}

function openPricingPage(source, sourceStr) {
    var d = new Date().getTime();
    $.cookie("ezfunnel", 1, { domain: domainName });
    $.cookie("ezorigin", 'APP', { path: '/' });
    ga('send', 'event', 'Premium', sourceStr, EM.scenemanager.presentation.userInfo.userName);
    //window.open(pricingPageUrl + d, '_blank');
    $('#pricing-overlay').show();
    $('#pricing-iframe').attr('src', pricingPageUrl + d);
    $('#pricing-iframe-container').show();
    if (!(window.self === window.top) && parent.document.URL.toLowerCase().indexOf("mypresentations") != -1) {
        parent.closeUpgradePopup();
    } else {
        closeUpgradePopup();
    }
}

function openPrivateUpgradePopup() {
    if (!(window.self === window.top) && parent.document.URL.toLowerCase().indexOf("mypresentations") != -1) {
        parent.openPrivateUpgradePopup();
    } else {
        $('#upgrade-popup-title').html("<h1>Your presentation is public</h1>");
        $('#upgrade-popup-text').html("<h3>To make it private and gain other premium features</h3>");
        $('#upgrade-popup-btn').html("<img src=\"../../css/images/btn_upgrade_normal.png\" alt=\"\" onmouseover=\"this.src='../../css/images/btn_upgrade_hover.png'\" onmouseout=\"this.src='../../css/images/btn_upgrade_normal.png'\" onclick=\"openPricingPage('2', 'private-btn');\" />");
        openUpgradePopup();
    }
}

function openPasswordUpgradePopup() {
    if (!(window.self === window.top) && parent.document.URL.toLowerCase().indexOf("mypresentations") != -1) {
        parent.openPasswordUpgradePopup();
    } else {
        $('#generic-upgrade-popup').addClass('style-upgrade-popup');
        $('#upgrade-popup-title').html("<h1>Upgrade to Premium</h1>");
        $('#upgrade-popup-text').html("<h3>To protect your presentations with a password <br />and ensure only specific people have access to it</h3>");
        $('#upgrade-popup-btn').html("<img src=\"../../css/images/btn_tell_normal.png\" alt=\"\" onmouseover=\"this.src='../../css/images/btn_tell_hover.png'\" onmouseout=\"this.src='../../css/images/btn_tell_normal.png'\" onclick=\"openPricingPage('3', 'password-btn');\" />");
        openUpgradePopup();
    }
}

function openCollaborateUpgradePopup() {
    if (!(window.self === window.top) && parent.document.URL.toLowerCase().indexOf("mypresentations") != -1) {
        parent.openCollaborateUpgradePopup();
    } else {
        $('#generic-upgrade-popup').addClass('style-upgrade-popup');
        $('#upgrade-popup-title').html("<h1>Upgrade to Premium</h1>");
        $('#upgrade-popup-text').html("<h3>Collaborate your presentation with other users <br />and work on it together</h3>");
        $('#upgrade-popup-btn').html("<img src=\"../../css/images/btn_tell_normal.png\" alt=\"\" onmouseover=\"this.src='../../css/images/btn_tell_hover.png'\" onmouseout=\"this.src='../../css/images/btn_tell_normal.png'\" onclick=\"openPricingPage('6', 'collaborate-btn');\" />");
        openUpgradePopup();
    }
}

function openDownloadUpgradePopup() {
    if (!(window.self === window.top) && parent.document.URL.toLowerCase().indexOf("mypresentations") != -1) {
        parent.openDownloadUpgradePopup();
    } else {
        $('#generic-upgrade-popup').addClass('style-upgrade-popup');
        $('#upgrade-popup-title').html("<h1>Upgrade to Premium</h1>");
        $('#upgrade-popup-text').html("<h3>Download your presentation to your computer <br />and create even more fun and easy presentations</h3>");
        $('#upgrade-popup-btn').html("<img src=\"../../css/images/btn_tell_normal.png\" alt=\"\" onmouseover=\"this.src='../../css/images/btn_tell_hover.png'\" onmouseout=\"this.src='../../css/images/btn_tell_normal.png'\" onclick=\"openPricingPage('4', 'download-btn');\" />");
        openUpgradePopup();
    }
}

function closeUpgradePopup() {
    $('#download-popup').hide();
    $('#generic-upgrade-popup').removeClass('style-upgrade-popup');
    $('#upgrade-popup-title').html("");
    $('#upgrade-popup-text').html("");
    $('#upgrade-popup-text').html("");
    $('#generic-upgrade-popup').removeClass('active');
    setTimeout(function () {
        $('#generic-upgrade-popup').addClass('sleep');
    }, 1000);
}

function closeNewSharePopup() {
    $('#newshare-iframe-container').hide();
    $('#newshare-iframe').remove();
}

function newSharePopupOk(id, isPublic, isCollaborated) {
    var frm = $("#newshare-iframe").contents().find("#permit-form");
    $.ajax({
        type: frm.attr('method'),
        url: frm.attr('action'),
        data: frm.serialize()
    });
    $.ajax({
        type: 'POST', url: '/NewShare/sendPrivacyEvent', dataType: 'json',
        // NOTE: update sharefrom
        data: {
            presid: presentationId, view: frm.find('#public-view').is(":checked"),
            print: frm.find('#public-print').is(":checked"),
            download: frm.find('#public-download').is(":checked"),
            copy: frm.find('#public-copy').is(":checked"),
            password: frm.find('#public-password').is(":checked"),
            isPrivate: $("#newshare-iframe").contents().find("#private-checkbox").is(":checked")
        }
    });
    closeNewSharePopup();
}

function newSharePopupCancel(id, isCollaborated) {
    closeNewSharePopup();
}

function setNewSharePopupheight(height) {
    $('#newshare-iframe-container').height(height);
    $('#newshare-iframe-container').css('margin-top', height / 2 * (-1) + 'px');
}

$(function () {
    var loader = '<svg viewBox="0 0 640 560" xmlns="http://www.w3.org/2000/svg" style="display: inline-block; width: 300px; height: 300px; top: 50%; left: 50%; margin-left: -150px; margin-top: -150px; position: absolute; z-index: 9999;" preserveAspectRatio="true">' +
    '<g><text fill="#B3B4B5" stroke="#000000" stroke-width="0" x="50%" y="95%" id="svg_7" font-size="60" font-family="Sans-serif" text-anchor="middle" xml:space="preserve" font-weight="">Loading</text></g><g>' +
        '<path d="m111.85732,266.79645c-26.644,-19.93291 -65.41533,-15.79179 -86.62042,9.23016c-21.21291,25.03644 -16.8213,61.47571 9.8227,81.40872c12.15833,9.09888 70.95533,34.21552 128.88334,60.28c52.388,23.5784 103.66667,48.15561 126.2683,58.11465l1.61392,-1.89545c-15.26184,-18.28531 -52.97781,-60.04681 -88.7851,-102.32596c-40.38522,-47.66711 -78.92355,-95.64026 -91.18275,-104.81213zm-1.45859,72.96609c-15.62649,18.40924 -44.17139,21.44223 -63.78601,6.79504c-19.59119,-14.6691 -22.8344,-41.50641 -7.23112,-59.92288c15.60305,-18.40915 44.17139,-21.44211 63.77039,-6.79495c19.60658,14.66898 22.8344,41.49896 7.24674,59.92279z" fill="#B3B4B5">' +
            '<animate id="a1" attributeName="fill" from="#B3B4B5" values="#fcd14c;#B3B4B5" begin="0s; a5.end - 0.1" dur="0.5s" keySplines=".5 0 .5 1" /></path>' +
        '<path d="m230.73161,144.09282c-17.20158,-33.79279 -60.29442,-48.06082 -96.24921,-31.89712c-35.9626,16.17817 -51.16998,56.68568 -33.96841,90.47836c7.87517,15.40544 56.10454,70.11534 102.94495,125.43767c42.3638,49.97095 82.98155,100.50327 101.37791,121.87985l2.71567,-1.23941c-6.09076,-26.5968 -23.09061,-88.71417 -37.81683,-150.45966c-16.58096,-69.58302 -31.06688,-138.64841 -39.00407,-154.19969zm-41.20758,76.13754c-26.47328,11.90579 -58.20718,1.40707 -70.86205,-23.46904c-12.68588,-24.86143 -1.50523,-54.69534 24.97588,-66.58656c26.45007,-11.90579 58.20741,-1.39249 70.86203,23.48363c12.67026,24.8542 1.48961,54.68799 -24.97586,66.57198z" fill="#B3B4B5">' +
            '<animate id="a2" attributeName="fill" from="#B3B4B5" values="#f39348;#B3B4B5" begin="a1.end - 0.1" dur="0.5s" keySplines=".5 0 .5 1" /></path>' +
        '<path d="m393.59875,71.95798c0,-37.46721 -32.30811,-67.82597 -72.16553,-67.82597c-39.88089,0 -72.22,30.35877 -72.22,67.82597c0,17.25728 18.66797,85.41132 35.70663,154.91425c15.06769,61.67261 28.25793,124.57007 35.00031,151.05737l3.00266,0c6.78903,-26.72794 20.24304,-88.80148 35.47388,-151.05737c16.82889,-68.88316 35.20206,-137.81739 35.20206,-154.91425zm-72.15796,51.94672c-29.35187,0 -53.16394,-22.33888 -53.16394,-49.91255c0,-27.58101 23.80426,-49.92723 53.16394,-49.92723c29.32083,0 53.11752,22.33888 53.11752,49.92723c-0.00781,27.56632 -23.79645,49.91255 -53.11752,49.91255z" fill="#B3B4B5">' +
            '<animate id="a3" attributeName="fill" from="#B3B4B5" values="#ee4c4e;#B3B4B5" begin="a2.end - 0.1" dur="0.5s" keySplines=".5 0 .5 1" /></path>' +
        '<path d="m542.3136,202.67416c17.21698,-33.79268 2.00177,-74.30017 -33.953,-90.47846c-35.9548,-16.1636 -79.06326,-1.89556 -96.2724,31.89712c-7.92181,15.55128 -22.41556,84.60944 -38.99628,154.19981c-14.68765,61.74545 -31.70288,123.8555 -37.80927,150.45953l2.74667,1.23941c18.36536,-21.37646 59.01437,-71.90878 101.35474,-121.87973c46.82501,-55.32233 95.06198,-110.02501 102.92953,-125.43768zm-113.96268,-49.00854c12.66245,-24.87611 44.40414,-35.38942 70.85422,-23.48352c26.48889,11.89122 37.66956,41.72502 25.01471,66.58656c-12.68567,24.87611 -44.42737,35.37485 -70.86206,23.46893c-26.4967,-11.89122 -37.67737,-41.72501 -25.00687,-66.57198z" fill="#B3B4B5">' +
            '<animate id="a4" attributeName="fill" from="#B3B4B5" values="#c94b50;#B3B4B5" begin="a3.end - 0.1" dur="0.5s" keySplines=".5 0 .5 1" /></path>' +
        '<path d="m439.7951,371.60126c-35.79187,42.27911 -73.54669,84.04074 -88.80072,102.32596l1.62955,1.89566c22.60165,-9.95193 73.89569,-34.52914 126.25269,-58.11478c57.97464,-26.05725 116.74063,-51.18121 128.89871,-60.28012c26.64423,-19.93289 31.06665,-56.37216 9.82294,-81.40869c-21.18188,-25.02187 -59.97638,-29.16309 -86.62042,-9.23007c-12.2746,9.17911 -50.7897,57.15225 -91.18274,104.81204zm99.89587,-91.7616c19.59119,-14.65442 48.11292,-11.62146 63.755,6.79504c15.62628,18.40915 12.36768,45.25378 -7.24695,59.92276c-19.59119,14.65442 -48.15955,11.62146 -63.77039,-6.79492c-15.60309,-18.42383 -12.35986,-45.25381 7.26233,-59.92288z" fill="#B3B4B5">' +
            '<animate id="a5" attributeName="fill" from="#B3B4B5" values="#954352;#B3B4B5" begin="a4.end - 0.1" dur="0.5s" keySplines=".5 0 .5 1" /></path>' +
    '</g></svg>';

    var fromEditor;
    try {
        //Throws exception if inside iframe that is embedded in a page from another domain
        fromEditor = (window.top.location.pathname).toLowerCase().indexOf('/editor/') != -1 || $(document)[0].referrer.indexOf('/editor/') != -1;
    } catch (err) {
        fromEditor = false;
    }

    if ($('#zip-img').length > 0) {
        $('#zip-img').remove();
    }

    // if (navigator.userAgent.indexOf("iPad") != -1) {
    //     try {
    //         $('#google_translate_element').hide();
    //         // $('#menu-container').css('left', window.parent.$('#player-container').width() - 92 + 'px');
    //         $('.menu-popup').css('top', '250px');
    //         $('.menu-popup').css('left', '450px');
    //         $('.iframe-popup-container').css('top', '250px');
    //         $('.iframe-popup-container').css('left', '450px');
    //     } catch (err) {
    //     }
    // }

    //If the player was opened from the editor, adjust the menu
    // if (fromEditor) {
    //     $('#menu-container').hide();
    //     $('#menu-container').css('top', '56px');
    //     $('#menu-container').css('right', '7px');
    //     $('#edit-button').hide();
    //     $('#delete-button').hide();
    //     $('#menu-container').show();
    //     //$('.menu-views').hide();
    // }

    //CSS hover doesn't work in IE
    // if (navigator.userAgent.indexOf("MSIE") != -1) {
    //     $(".menu-button").mouseenter(function () {
    //         $(this).css('background-color', '#c94b50');
    //     })

    //     $(".menu-button").mouseleave(function () {
    //         $(this).css('background-color', 'black');
    //     })
    // }

    if (navigator.userAgent.toLowerCase().indexOf("webkit") != -1) {
        $('body').addClass('webkit');
        //$('#google_translate_element').css('margin-left', '2px');
    }

    //Edit - closes player iFrame
    $('#edit-button').click(function () {
        window.open('/mypresentations/edit/' + presentationId);
        ga('send', 'event', 'PresentationActions', 'Edit', EM.scenemanager.presentation.userInfo.userName + ", " + presentationId);
        if (!(window.self === window.top)) {
            //window.parent.$('#player-container').hide();
            //window.parent.hideWithTransition(window.parent.$('#overlay'));
            ////window.parent.$('#overlay').hide();
            //window.parent.$('#player-iframe').remove();
            window.parent.playeriFrameEdit(presentationId);
        }
    })

    //Delete
    $('#delete-button').click(function () {
        closeAllPopups();
        $('#delete-popup').show();
        ga('send', 'event', 'PresentationActions', 'Delete', EM.scenemanager.presentation.userInfo.userName + ", " + presentationId);
    })

    $('#delete-close').click(function () {
        $('#delete-popup').hide();
    })

    $('#cancel-delete').click(function () {
        $('#delete-popup').hide();
    })

    $('#ok-delete').click(function () {
        $.post('/MyPresentations/delete', { presentationID: presentationId });
        ga('send', 'event', 'PresentationActions', 'Delete-btn', EM.scenemanager.presentation.userInfo.userName + ", " + presentationId);
        if (window.self === window.top) {
            //From the player's page
            //$.cookie("tab", "#my-menu-button", { path: '/' });
            //$.cookie("scrollPos", window.parent.$("#presentations-container").scrollTop(), { path: '/' });
            $('#delete-popup').hide();
            window.location = "/mypresentations";
        } else {
            //From iFrame
            window.parent.deletePresentation(presentationId);
            window.parent.$('#player-container').hide();
            window.parent.hideWithTransition(window.parent.$('#overlay'));
            //window.parent.$('#overlay').hide();
            window.parent.$('#player-iframe').remove();
        }
    })

   
    //Print
    $('#print-button').click(function () {
        closeAllPopups();
        $('#print-popup').show();
        ga('send', 'event', 'PresentationActions', 'Print', EM.scenemanager.presentation.userInfo.userName + ", " + presentationId);
    })

    $('#print-close').click(function () {
        $('#print-popup').hide();
    })

    $('#cancel-print').click(function () {
        $('#print-popup').hide();
    })

    $('#ok-print').click(function () {
        $('#print-popup').hide();
        ga('send', 'event', 'PresentationActions', 'Print-btn', EM.scenemanager.presentation.userInfo.userName + ", " + presentationId);
    })

    //Permit
    //$('#permit-button').click(function () {
    $('#newshare-button').click(function () {
        closeAllPopups();
        //if ($('#permit-iframe').attr("src").length < 1) {
        //    $('#permit-iframe').attr("src", "/privacy/index/" + presentationId);
        //}
        $('#newshare-iframe-container').append('<iframe id="newshare-iframe" class="iframe-popup" sandbox="allow-same-origin allow-scripts allow-popups allow-forms" src="/newshare/index/' + presentationId + '" seamless></iframe>');
        $('#newshare-iframe-container').show();

        //$('#permit-iframe-container').append('<iframe id="permit-iframe" class="iframe-popup" sandbox="allow-same-origin allow-scripts allow-popups allow-forms" src="/privacy/index/' + presentationId + '" seamless></iframe>');
        //$('#permit-iframe-container').show();
        ga('send', 'event', 'PresentationActions', 'Permit', EM.scenemanager.presentation.userInfo.userName + ", " + presentationId);
    })

    $('#permit-close').click(function () {
        closePermitPopup();
    })

    ////Collaborate
    //$('#collaborate-button').click(function () {
    //    closeAllPopups();
    //    //$('#collaborate-iframe').attr("src", "/collaborations/index/" + presentationId);
    //    $('#collaborate-iframe-container').append('<iframe id="collaborate-iframe" class="iframe-popup" sandbox="allow-same-origin allow-scripts allow-popups allow-forms" src="/collaborations/index/' + presentationId + '" seamless></iframe>');
    //    $('#collaborate-iframe-container').show();
    //    ga('send', 'event', 'PresentationActions', 'Collaborate', EM.scenemanager.presentation.userInfo.userName + ", " + presentationId);
    //})

    //$('#collaborate-close').click(function () {
    //    closeCollaboratePopup();
    //})

    ////Share
    //$('#share-button').click(function () {
    //    closeAllPopups();
    //    //$('#share-iframe').attr("src", "/share/index/" + presentationId);
    //    $('#share-iframe-container').append('<iframe id="share-iframe" class="iframe-popup" sandbox="allow-same-origin allow-scripts allow-popups allow-forms" src="/share/index/' + presentationId + '" seamless></iframe>');
    //    $('#share-iframe-container').show();
    //    ga('send', 'event', 'PresentationActions', 'Share', EM.scenemanager.presentation.userInfo.userName + ", " + presentationId);
    //})

    //$('#share-close').click(function () {
    //    closeSharePopup();
    //})

    //Translate
    $('#google_translate_element').click(function () {
        closeAllPopups();
        $(".goog-te-menu-frame").contents().find(".goog-te-menu2").css({ 'background': 'black', 'opacity': '0.95', 'border': 'none' });
        $(".goog-te-menu-frame").contents().find(".goog-te-menu2-item div, .goog-te-menu2-item:link div, .goog-te-menu2-item:visited div, .goog-te-menu2-item:active div, .goog-te-menu2 *").css({ 'background': 'black', 'opacity': '0.95', 'color': 'white', 'font-family': '"emaze-font", sans-serif, Arial, Helvetica' });
        $(".goog-te-menu-frame").contents().find(".goog-te-menu2-item-selected").find('span.text').css({ 'color': '#fcd14c' });
        $(".goog-te-menu-frame").contents().find(".goog-te-menu2-item div").hover(function () {
            $(this).css('background-color', '#c94b50').find('span.text').css('background-color', '#c94b50');
        }, function () {
            $(this).css('background-color', 'black').find('span.text').css('background-color', 'black');
        });
        ga('send', 'event', 'PresentationActions', 'Translate', EM.scenemanager.presentation.userInfo.userName + ", " + presentationId);
    })

    $('#pricing-overlay').click(function () {
        $('#pricing-iframe-container').hide();
        $('#pricing-iframe').attr('src', '');
        $('#pricing-overlay').hide();
    })

    $(window).on('resize', function () {
        var isFullScreen = screen.width == window.innerWidth && screen.height == window.innerHeight;
        var checkFullScreen = document.fullscreenenabled || window.fullScreen;
        if (isFullScreen || checkFullScreen) { //|| fromEditor) {
            // $('#menu-container').hide();
            // $('.menu-views').hide();
        } else {
            // $('#menu-container').show();
            // $('.menu-views').show();
        }
    })

    $('html').on("mouseenter", function () {
        // var isFullScreen = screen.width == window.innerWidth && screen.height == window.innerHeight;
        // var checkFullScreen = document.fullscreenenabled || window.fullScreen;
        // if (!(isFullScreen || checkFullScreen)) { //|| fromEditor)) {
            try{
                var isEditor = (window.parent.location.href.indexOf('editor') != -1) ? true : false;
                if ( isEditor ){
                    $('#menu-container').css('right', '82px');
                }
            } catch(e){
            }
            // $('#menu-container').fadeIn();
            // $('.menu-views').fadeIn();
        // }
    })

    $('html').on("mouseleave", function () {
        // var isFullScreen = screen.width == window.innerWidth && screen.height == window.innerHeight;
        // var checkFullScreen = document.fullscreenenabled || window.fullScreen;
        // if (!(isFullScreen || checkFullScreen)) { //|| fromEditor)) {
            // $('#menu-container').fadeOut();
            // $('.menu-views').fadeOut();
        // }
    })
})

function closeSharePopup() {
    $('#share-iframe-container').hide();
    $('#share-iframe').remove();
    //$('#share-iframe').attr('src', '');
}

function closeCollaboratePopup() {
    $('#collaborate-iframe-container').hide();
    $('#collaborate-iframe').remove();
    //$('#collaborate-iframe').attr('src', '');
}

function CollaboratePopupOk() {
    var frm = $("#collaborate-iframe").contents().find("form");
    $.ajax({
        type: frm.attr('method'),
        url: frm.attr('action'),
        data: frm.serialize()
    });

    closeCollaboratePopup();
}

function closePermitPopup() {
    $('#permit-iframe-container').hide();
    $('#permit-iframe').remove();
}

function permitPopupOk(id, isPublic) {
    var frm = $("#permit-iframe").contents().find("form");
    $.ajax({
        type: frm.attr('method'),
        url: frm.attr('action'),
        data: frm.serialize()
    });

    var $permit = $('#permit-button');
    if ($permit.hasClass('public') && !isPublic) {
        $permit.removeClass('public');
        $permit.addClass('private');
    } else if ($permit.hasClass('private') && isPublic) {
        $permit.removeClass('private');
        $permit.addClass('public');
    }

    closePermitPopup();
}

function twitterShare() {
    !function (d, s, id) { var js, fjs = d.getElementsByTagName(s)[0]; if (!d.getElementById(id)) { js = d.createElement(s); js.id = id; js.src = "//platform.twitter.com/widgets.js"; fjs.parentNode.insertBefore(js, fjs); } }(document, "script", "twitter-wjs");
}

function shareOnSocialNet(url) {
    window.open(url, '_blank');
}

function shareOnTwitter(url) {
    twitterShare();
    shareOnSocialNet(url);
}

$(document).on('click', '#clone-button', clone);
function clone (e) {
    // window.open("/PleaseWait", "editCopiedPresentation");
    e.preventDefault();

    $('#player-loader').removeClass('hidden');
    
    $("body").css("cursor", "progress");
    
    $.ajax({
        type: 'POST',
        url: '/MyPresentations/duplicate',
        dataType: 'json',
        data: { 'presentationId': presentationId },
        success: function(presentation) {
            $('#download-loader').hide();
            presentationId = presentation.presentationID;

            window.location.href = '/editor/' + presentationId;

            try {
                ga('send', 'event', 'PresentationActions', 'Clone', username + ", " + presentationId);
            } catch (ee) {
            }
        },
        asynch: false
    });
}

$(document).ready(function () {

    $('#toggle').toggle(function() {
        $(this).addClass('toggle-active');

        $('#buttons').removeClass('hidden').animate({
            'marginRight': '5px'
        },
            300, "easeOutSine",function() {
            // Can do something after it's opened
        });

    }, function() {
        $('#buttons').animate({
            'marginRight': '-600px'
        },
            300, function() {
            $('#toggle').removeClass('toggle-active');
            $(this).addClass('hidden');
        });
    });
    
});