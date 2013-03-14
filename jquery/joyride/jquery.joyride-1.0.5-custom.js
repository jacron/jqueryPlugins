/*
 * jQuery Joyride Plugin 1.0.5
 * www.ZURB.com/playground
 * Copyright 2011, ZURB
 * Free to use under the MIT license.
 * http://www.opensource.org/licenses/mit-license.php
*/

(function($) {
  $.fn.joyride = function(options) {

    // +++++++++++++++++++
    //   Defaults
    // +++++++++++++++++++
    var settings = {
      'tipLocation': 'bottom', // 'top' or 'bottom' in relation to parent
      'scrollSpeed': 300, // Page scrolling speed in milliseconds
      'timer': 0, // 0 = no timer, all other numbers = timer in milliseconds
      'startTimerOnClick': false, // true or false - true requires clicking the first button start the timer
      'nextButton': true, // true or false to control whether a next button is used
      'tipAnimation': 'pop', // 'pop' or 'fade' in each tip
      'tipAnimationFadeSpeed': 300, // when tipAnimation = 'fade' this is speed in milliseconds for the transition
      'cookieMonster': false, // true or false to control whether cookies are used
      'cookieName': 'JoyRide', // Name the cookie you'll use
      'cookieDomain': false, // Will this cookie be attached to a domain, ie. '.notableapp.com'
      'tipContainer': 'body', // Where will the tip be attached if not inline
      'inline': false, // true or false, if true the tip will be attached after the element
      'tipContent': '#joyRideTipContent', // What is the ID of the <ol> you put the content in
      'postRideCallback': $.noop, // A method to call once the tour closes (canceled or complete)
      'postStepCallback': $.noop, // A method to call after each step
      'prevButton': false // work in progress - prevButton true doesn't work correctly now
    };

    var options = $.extend(settings, options);

    return this.each(function() {

      if ($(options.tipContent).length === 0) return;

      $(options.tipContent).hide();

      var bodyOffset = $(options.tipContainer).children('*').first().position(),
      tipContent = $(options.tipContent + ' li'),
      count = skipCount = 0,
      prevCount = -1,
      timerIndicatorInstance,
      timerIndicatorTemplate = '<div class="joyride-timer-indicator-wrap"><span class="joyride-timer-indicator"></span></div>';

      var tipTemplate = function(tipClass, index, buttonText, prevButtonText, cancelText, self) {
        //alert(prevButtonText);
        if (!$(options).prevButton) {
          prevButtonText = '';
        }
        var html = '<div class="joyride-tip-guide ' +
          tipClass + '" id="joyRidePopup' + index + '"><span class="joyride-nub"></span><div class="joyride-content-wrapper">' +
          $(self).html() + buttonText + prevButtonText + cancelText + '<a href="#close" class="joyride-close-tip">X</a>' +
          timerIndicatorInstance + '</div></div>';
        return html;
      };

      var tipLayout = function(tipClass, index, buttonText, prevButtonText, cancelText, self) {
        if (index == 0 && settings.startTimerOnClick && settings.timer > 0 || settings.timer == 0) {
          timerIndicatorInstance = '';
        } else {
          timerIndicatorInstance = timerIndicatorTemplate;
        }

        if (!tipClass) {
          tipClass = '';
        }

        if (buttonText) {
          buttonText = '<a href="#" class="joyride-next-tip small nice radius yellow button">' + buttonText + '</a>'
        } else {
          buttonText = '';
        }

        if (prevButtonText) {
          prevButtonText = '<a href="#" class="joyride-prev-tip">' + prevButtonText + '</a>'
        } else {
          prevButtonText = '';
        }
        
        if (cancelText) {
          cancelText = '<a href="#close" class="joyride-cancel-tip">' + cancelText + '</a>'
        } else {
          cancelText = '';
        }
        
        if (settings.inline) {
          $(tipTemplate(tipClass, index, buttonText, prevButtonText, cancelText, self)).insertAfter('#' + $(self).data('id'));
        } else {
          $(options.tipContainer).append(tipTemplate(tipClass, index, buttonText, prevButtonText, cancelText , self));
        }
      };

      if(!settings.cookieMonster || !$.cookie(settings.cookieName)) {

        tipContent.each(function(index) {
          var buttonText = $(this).data('text'),
            prevButtonText = $(this).data('text-prev'),
            cancelText = $(this).data('text-cancel'),
            tipClass = $(this).attr('class'),
            self = this;

          if (settings.nextButton && !buttonText) {
            buttonText = 'Next';
          }

        if (settings.nextButton || !settings.nextButton && settings.startTimerOnClick) {
          if ($(this).attr('class')) {
            tipLayout(tipClass, index, buttonText, prevButtonText, cancelText, self);
          } else {
            tipLayout(false, index, buttonText, prevButtonText, cancelText, self);
          }
        } else if (!settings.nextButton) {
          if ($(this).attr('class')) {
            tipLayout(tipClass, index, '', '', '', self);
          } else {
            tipLayout(false, index, '', '', '', self);
          }
        }
        $('#joyRidePopup' + index).hide();
      });
    }

    /**
     * normally joyride will fetch the parent by his ID,
     * if the user provides an 'anchor' option, joyride will get
     * the parent of the anchor with the text of the anchor option
     */
    getParentElement = function(parentElementID){//}, anchorhtml) {
        var parentElement = $('#' + parentElementID);
/*
        if (anchorhtml) {
          $.each($('a'), function(i) {
            if ($(this).html() == anchorhtml) {
              var parentMenu = $(this).parent().get(0),
                  parentMenuClass = $(parentMenu).attr('class');
              if (parentMenuClass) {
                parentElement = $(parentMenu);
              }
            }
          });
        }*/
      return parentElement;
    }
    
    showNextTip = function() {
        //showJrOverlay();
        
        var parentElement = getParentElement($(tipContent[count]).data('id')),  //,$(tipContent[count]).data('anchor') ),
            opt = {};
          
        // Parse the options string
        $.each(($(tipContent[count]).data('options') || ':').split(';'),
          function (i, s) {
            var p = s.split(':');
            if (p.length == 2) {
              opt[$.trim(p[0])] = $.trim(p[1]);
            }
          }
        );

        var tipSettings = $.extend({}, settings, opt);

        while (parentElement.offset() === null) {
          count++;
          skipCount++;
          if ((tipContent.length - 1) > prevCount) {
            prevCount++;
          }
          parentElementID = $(tipContent[count]).data('id'),
          parentElement = $('#' + parentElementID);

          if ($(tipContent).length < count) {
            break;
          }
        }
        var windowHalf = Math.ceil($(window).height() / 2),
          currentTip = $('#joyRidePopup' + count),
          currentTipPosition = parentElement.offset(),
          currentParentHeight = parentElement.outerHeight(),
          currentParentWidht = parentElement.outerWidth(),
          currentTipHeight = currentTip.outerHeight(),
          nubHeight = Math.ceil($('.joyride-nub').outerHeight() / 2),
          tipOffset = 0;

        if (currentTip.length === 0) {
          return;
        }

        if ($(tipContent[count]).data('x')) {
          currentParentWidht = $(tipContent[count]).data('x');
        }
        if (count < tipContent.length) {
          if (settings.tipAnimation == "pop") {
            $('.joyride-timer-indicator').width(0);
            if (settings.timer > 0) {
              currentTip.show().children('.joyride-timer-indicator-wrap')
                .children('.joyride-timer-indicator')
                .animate({width: $('.joyride-timer-indicator-wrap')
                .width()}, settings.timer);
            } else {
              currentTip.show();
            }
          } else if (settings.tipAnimation == "fade") {
            $('.joyride-timer-indicator').width(0);
            if (settings.timer > 0) {
              currentTip.fadeIn(settings.tipAnimationFadeSpeed)
                .children('.joyride-timer-indicator-wrap')
                .children('.joyride-timer-indicator')
                .animate({width: $('.joyride-timer-indicator-wrap')
                .width()}, settings.timer);
            } else {
              currentTip.fadeIn(settings.tipAnimationFadeSpeed);
            }
          }

          // ++++++++++++++++++
          //   Tip Location
          // ++++++++++++++++++
          var nub = currentTip.children('.joyride-nub');
          var left = currentTipPosition.left - bodyOffset.left;
          nub.removeClass('bottom')
             .removeClass('top')
             .removeClass('leftarrow') //added jc
             .removeClass('right');

          // Update the tip position so it is in the same position
          // but the nub is right aligned.
          if ($(window).scrollLeft() + $(window).width() < left + currentTip.width()) {
            left -= (currentTip.width() - nub.offset().left * 2);
            nub.addClass("right");
          }

          if (Modernizr.mq('only screen and (max-width: 769px)')) {
            //If the user is "mobile"
            if (tipSettings.tipLocation.indexOf("top") != -1 ) {
              if (currentTipHeight >= currentTipPosition.top) {
                currentTip.offset({top: ((currentTipPosition.top + currentParentHeight + nubHeight) - bodyOffset.top)});
                nub.addClass('top').css({ left: left });
              } else {
                currentTip.offset({top: ((currentTipPosition.top) - (currentTipHeight + bodyOffset.top + nubHeight))});
                nub.addClass('bottom').css({ left: left });
              }
            } else {
              // Default is bottom alignment.
              currentTip.offset({top: (currentTipPosition.top + currentParentHeight + nubHeight)});
              nub.addClass('top').css({ left: left });
            }
          } else {
            if (tipSettings.tipLocation == "top") {
              if (currentTipHeight >= currentTipPosition.top) {
                currentTip.offset({
                  top: ((currentTipPosition.top + currentParentHeight + nubHeight) - bodyOffset.top),
                  left: left
                });
                nub.addClass('top');
              } else {
                currentTip.offset({
                  top: ((currentTipPosition.top) - (currentTipHeight + bodyOffset.top + nubHeight)),
                  left: left
                });
                nub.addClass('bottom');
              }
            } 
            else if (tipSettings.tipLocation == 'leftarrowbig') {// added JC
              var nubBorderWidth = parseInt(currentTipHeight / 2) + 1,
                  nubLeft = -currentTipHeight - 0,
                  tipTop = currentTipPosition.top - nubBorderWidth + parseInt(currentParentHeight / 2);

              currentTip.offset({
                top: tipTop,
                left: left + 200
              });
              
              // set size of nub
              nub.addClass('leftarrowbig')
                .css('border-width', nubBorderWidth + 'px')
                .css('left', nubLeft + 'px')
                .css('top', '-2px');
              
              // remove left bottom and top radius of dialog
              currentTip.css('border-radius', '0px 5px 5px 0px');
            } 
            else if (tipSettings.tipLocation == 'leftarrow') {// added JC
                  
              currentTip.offset({
                top: currentTipPosition.top - nubHeight - 24,//+ currentParentHeight + nubHeight,
                left: left + currentParentWidht
              });
              
              nub.addClass('leftarrow')
                .css('left', nubLeft + 'px')
                .css('top', '20px');
              
            } 
            else if (tipSettings.tipLocation == 'start') {// added JC
              var start_left = 800;
             if ($(tipContent[count]).data('x')) {
               start_left = $(tipContent[count]).data('x');
             }

              currentTip.offset({
                top: 210,
                left: start_left
              });
              nub.addClass('start');// hide the nub
            } 
            else {
              // Default is bottom alignment.
              currentTip.offset({
                top: (currentTipPosition.top + currentParentHeight + nubHeight),
                left: left
              });
              nub.addClass('top');
            }
          }

          // Default is left alignment.
          if (tipSettings.tipLocation.indexOf("right") != -1) {
            // Here we ignore the viewport alignment.
            currentTip.offset({left: (currentTipPosition.left - bodyOffset.left - currentTip.width() + parentElement.width())});
            currentTip.children('.joyride-nub').addClass('right');
          }

          // Animate Scrolling when tip is off screen
          tipOffset = Math.ceil(currentTip.offset().top - windowHalf);
          $("html, body").animate({
            scrollTop: tipOffset
          }, settings.scrollSpeed);

          if (count > 0) {
            if (skipCount > 0) {
              var hideCount = prevCount - skipCount;
              skipCount = 0;
            } else {
              var hideCount = prevCount;
            }
            if (settings.tipAnimation == "pop") {
              $('#joyRidePopup' + hideCount).hide();
            } else if (settings.tipAnimation == "fade") {
              $('#joyRidePopup' + hideCount).fadeOut(settings.tipAnimationFadeSpeed);
            }
          }

        // Hide the last tip when clicked
        } else if ((tipContent.length - 1) < count) {
          var hideCnt;
          if (skipCount > 0) {
            hideCount = prevCount - skipCount;
            skipCount = 0;
          } else {
            hideCount = prevCount;
          }
          if (settings.cookieMonster == true) {
            $.cookie(settings.cookieName, 'ridden', { expires: 365, domain: settings.cookieDomain });
          }
          if (settings.tipAnimation == "pop") {
            $('#joyRidePopup' + hideCount).fadeTo(0, 0);
          } else if (settings.tipAnimation == "fade") {
            $('#joyRidePopup' + hideCount).fadeTo(settings.tipAnimationFadeSpeed, 0);
          }
        }
        count++;
        if (prevCount < 0) {
          prevCount = 0;
        } else if ((tipContent.length - 1) > prevCount) {
          prevCount++;
        }
        if (settings.postStepCallback != $.noop) {
          settings.postStepCallback(prevCount);
        }
      }

    if (!settings.inline || !settings.cookieMonster || !$.cookie(settings.cookieName)) {
      $(window).resize(function () {
        var parentElementID = $(tipContent[prevCount]).data('id'),
          currentTipPosition = $('#' + parentElementID).offset(),
          currentParentHeight = $('#' + parentElementID).outerHeight(),
          currentTipHeight = $('#joyRidePopup' + prevCount).outerHeight(),
          nubHeight = Math.ceil($('.joyride-nub').outerHeight() / 2);
        if (Modernizr.mq('only screen and (max-width: 769px)')) {
          if (settings.tipLocation == "bottom") {
            $('#joyRidePopup' + prevCount).offset({
              top: (currentTipPosition.top + currentParentHeight + nubHeight),
              left: 0
            });
            $('#joyRidePopup' + prevCount).children('.joyride-nub').addClass('top').removeClass('bottom').css({ left: (currentTipPosition.left - bodyOffset.left) });
          } else if (settings.tipLocation == "top") {
            if (currentTipPosition.top <= currentTipHeight) {
              $('#joyRidePopup' + prevCount).offset({
                top: (currentTipPosition.top + nubHeight + currentParentHeight),
                left: 0
              });
              $('#joyRidePopup' + prevCount).children('.joyride-nub').addClass('top').removeClass('bottom').css({ left: (currentTipPosition.left - bodyOffset.left) });

            } else {
              $('#joyRidePopup' + prevCount).offset({
                top: ((currentTipPosition.top) - (currentTipHeight + nubHeight)),
                left: 0
              });
              $('#joyRidePopup' + prevCount).children('.joyride-nub').addClass('bottom').removeClass('top').css({ left: (currentTipPosition.left - bodyOffset.left) });
            }
          }
        } else {
          if (settings.tipLocation == "bottom") {
            $('#joyRidePopup' + prevCount).offset({
              top: (currentTipPosition.top + currentParentHeight + nubHeight),
              left: currentTipPosition.left
            });
            $('#joyRidePopup' + prevCount).children('.joyride-nub').addClass('top').removeClass('bottom').css({ left: '' });
          } else if (settings.tipLocation == "top") {
            if (currentTipPosition.top <= currentTipHeight) {
              $('#joyRidePopup' + prevCount).offset({
                top: (currentTipPosition.top + nubHeight + currentParentHeight),
                left: currentTipPosition.left
              });
              $('#joyRidePopup' + prevCount).children('.joyride-nub').addClass('top').removeClass('bottom').css({ left: '' });
            }
            else {
              $('#joyRidePopup' + prevCount).offset({
                top: ((currentTipPosition.top) - (currentTipHeight + nubHeight)),
                left: currentTipPosition.left
              });
              $('#joyRidePopup' + prevCount).children('.joyride-nub').addClass('bottom').removeClass('top').css({ left: '' });
            }
          }
        }
      });
    }// end of showNextTip

      // +++++++++++++++
      //   Timer
      // +++++++++++++++

      var interval_id = null,
      showTimerState = false;

      if (!settings.startTimerOnClick && settings.timer > 0){
       showNextTip();
       interval_id = setInterval(function() {showNextTip()}, settings.timer);
      } else {
       showNextTip();
      }
      var endTip = function(e, interval_id, cookie, self) {
        e.preventDefault();
        clearInterval(interval_id);
        if (cookie) {
           $.cookie(settings.cookieName, 'ridden', { expires: 365, domain: settings.cookieDomain });
        }
        $(self).parent().parent().hide();
        if (settings.postRideCallback != $.noop) {
          settings.postRideCallback();
        }
      }
      $('.joyride-close-tip').click(function(e) {
        endTip(e, interval_id, settings.cookieMonster, this);
      });
      $('.joyride-cancel-tip').click(function(e) {
        endTip(e, interval_id, settings.cookieMonster, this);
      });

      // When the next button is clicked, show the next tip, only when cookie isn't present
      $('.joyride-next-tip').click(function(e) {
        e.preventDefault();
        if (count >= tipContent.length) {
          endTip(e, interval_id, settings.cookieMonster, this);
        }
        if (settings.timer > 0 && settings.startTimerOnClick) {
          showNextTip();
          clearInterval(interval_id);
          interval_id = setInterval(function() {showNextTip()}, settings.timer);
        } else if (settings.timer > 0 && !settings.startTimerOnClick){
          clearInterval(interval_id);
          interval_id = setInterval(function() {showNextTip()}, settings.timer);
        } else {
          showNextTip();
        }
      });
      
      /**
       * todo: correct the error that after a click on previous, 
       * a click on next will not close the current dialog. 
       */
      $('.joyride-prev-tip').click(function(e) {
        e.preventDefault();
        if (count > 1) {
          //console.log(this);
          var currentTip = $(this).parents('.joyride-tip-guide').get(0);
          $(currentTip).hide();
          count -= 2;
          showNextTip();
        }
      });
      
      
    });
  };

})(jQuery);
