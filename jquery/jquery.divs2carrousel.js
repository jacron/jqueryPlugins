/**
 * jquery.divs2carrousel.js
 *
 * Another plugin that transforms all divs in a container to a carrousel.
 * This one adds controlls for next/previous and for going directly to a page.
 * Initially slides automatically between pages; this sliding stops when the user
 * chooses a page.
 * Optionally adds next/previous buttons.
 *
 * author: Jan Croonen
 * date: 10/2012
 */

(function($) {
  $.fn.carrousel = function(method) {
    var timer = null;

    var methods = {
      open: function(p_options) {

      // +++++++++++++++++++
      //   Defaults
      // +++++++++++++++++++
      var settings = {
        'carrouselSlideDuration': 3000, // duur in millisec
        'afterInit': $.noop,
        'vorigeVolgende' : true,
        'level': 1
      },
          options = $.extend(settings, p_options),
          carrouselTeller = 0, // aktieve slide
          carrouselPaginaAantal = 0,  // aantal slides
          paginas = this.find('> div').not('#carrousel-control'),
          htmlStart = '<div id="carrousel-control">',
          htmlEnd = '</div>',
          $this = this;

      if (options.level == 2) {
        paginas = this.find('> div > div');
      }

      if (options.vorigeVolgende) {
        htmlStart += '<a href="#" id="prevSlide">&lt;</a>';
        htmlEnd = '<a href="#" id="nextSlide">&gt;</a>'  + htmlEnd;
      }

      this.gotoCurrent = function(direction) {
        $.each(paginas, function(i, v) {
          if (i != carrouselTeller) {
            $(v).hide();
          }
        });
        $.each(paginas, function(i, v) {
          if (i == carrouselTeller) {
            /*
            if (direction == 'left') {

            }
            if (direction == 'right') {

            }*/
            $(v).fadeIn();
          }
        });
        $('#carrousel-control .page').each(function(i,v){
          var $v = $(v);
          if ($v.attr('rel') == carrouselTeller) {
            $v.addClass('selected');
          }
          else {
            $v.removeClass('selected');
          }
        });
      };

      this.nextSlide = function() {
        carrouselTeller++;
        if (carrouselTeller == carrouselPaginaAantal) {
          carrouselTeller = 0;
        }
        $this.gotoCurrent('left');
      }

      this.prevSlide = function() {
        carrouselTeller--;
        if (carrouselTeller < 0) {
          carrouselTeller = carrouselPaginaAantal - 1;
        }
        $this.gotoCurrent('right');
      }

      this.pageSlide = function(page) {
        carrouselTeller = page;
        $this.gotoCurrent('right');
      }

      $('#nextSlide').live('click', function() {
        $this.nextSlide();
        return false;
      });
      $('#prevSlide').live('click', function() {
        $this.prevSlide();
        return false;
      });
      $('.page').live('click', function() {
        $this.pageSlide($(this).attr('rel'));

        // zet timer uit
        clearInterval(timer);
        return false;
      });

      carrouselPaginaAantal = paginas.length;

      timer = setInterval(function(){
        $this.nextSlide();
      }, options.carrouselSlideDuration);

      return this.each(function() {
        var html = htmlStart;

        $.each(paginas, function(i, v) {
          if (i > 0) {
            $(v).hide();// toon alleen de eerste
            html += '<a href="#" class="page" rel="' + i + '">&nbsp;' + (i + 1) + '&nbsp;</a>';
          }
          else {
            html += '<a href="#" class="page selected" rel="' + i + '">&nbsp;' + (i + 1) + '&nbsp;</a>';
          }
        });
        html += htmlEnd;
        $this.append(html);
        options.afterInit();
      });

      },
      close: function() {
        // zet timer uit
        //alert('timer uitgezet');// IE, FF does it; Chrome not
        clearInterval(timer);
      }
    };

    if (methods[method]) {
        return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
    }
    else if (typeof(method) === 'object' || !method) {
        return methods.open.apply(this, arguments);
    }
    else {
        $.error('Method ' + method + ' does not exist on jQuery.divs2carrousel');
    }
  };
})(jQuery);

