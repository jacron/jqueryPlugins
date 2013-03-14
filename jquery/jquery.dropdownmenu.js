/**
 * jquery.dropdownmenu.js
 * 
 * author: Jan Croonen
 * date: 11/2012
 */

(function($) {
  $.fn.dropdownmenu = function(method) {
    var paginas = this.find('> div.blok'),
        index = Math.floor(Math.random() * (paginas.length));
    
    console.log(paginas);
    console.log(index);
    return this.each(function() {

    $.each(paginas, function(i, v) {
      if (i != index) {
        $(v).hide();  // toon alleen de eerste
      }
    });
    });
  };
})(jQuery);
  
