
(function($) {
  $.fn.textdrawer = function() {
    'use strict';

    return this.each(function() {
      var $this = $(this),
          $textcontent = $this.find('div'),
          $textheader = $this.find('h4');
          
      //console.log($textheader.text());
      // first: hide content and put plus sign before header
      $textcontent.hide();
      $textheader.text('[+] ' + $textheader.text());
      
      // handle header click
      $textheader.bind('click', function() {
        if ($textcontent.is(':visible')) {
          $textcontent.hide();
          $textheader.text('[+] ' + $textheader.text().substr(3));
        }
        else {
          $textcontent.show();
          $textheader.text('[-] ' + $textheader.text().substr(3));
        }
      });
    });        
  }
})(jQuery);
