
(function($) {
  $.fn.escapehtml = function() {

    return this.each(function() {
      var $this = $(this);
      $this.html($this.html().replace(/</g, '&lt;').replace(/>/g, '&gt;'));
    });        
  }
})(jQuery);
