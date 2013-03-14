/**
 * jquery.randomquote.js
 * 
 * author: Jan Croonen
 * date: 11/2012
 */

(function($) {
  $.fn.randomquote = function() {
    var paginas = this.find('> div.blok'),
        index = Math.floor(Math.random() * (paginas.length));
    
    return this.each(function() {
      $.each(paginas, function(i, v) {
        if (i != index) {
          $(v).hide();  // toon alleen de eerste
        }
      });
    });
  };
})(jQuery);
