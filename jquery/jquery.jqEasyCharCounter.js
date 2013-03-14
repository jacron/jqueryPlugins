/* jQuery jqEasyCharCounter plugin
 * Examples and documentation at: http://www.jqeasy.com/
 * Version: 1.0 (05/07/2010)
 * No license. Use it however you want. Just keep this notice included.
 * Requires: jQuery v1.3+
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
 * OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
 * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
 * WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
 * OTHER DEALINGS IN THE SOFTWARE.
 * 
 * jc modified: 
 * 1) formatstring added for nice, localized text
 * 2) placeholders in message strings:
 * %chars% = char count, 
 * %max% = maximum allowed, 
 * %left% = characters left to type in the textarea
 * 
 * another author: Jan Croonen (jc)
 * date: 10/2012
*/
(function($) {

  $.fn.extend({
    jqEasyCounter: function(givenOptions) {
      // +++++++++++++++++++
      //   Defaults
      // +++++++++++++++++++
      var settings = {
        maxChars: 100,
        maxCharsWarning: 80,
        msgFontSize: '12px',
        msgFontColor: '#000000',
        msgFontFamily: 'Arial',
        msgTextAlign: 'right',
        msgWarningColor: '#F00',
        msgAppendMethod: 'insertAfter',
        msgString: 'Characters: %chars%/%max%',
        msgSingleCharString: ''
      },
      options = $.extend(settings, givenOptions);
    
      return this.each(function() {
        var $this = $(this);
	
        if (options.maxChars <= 0) return;
			
        // create counter element
        var jqEasyCounterMsg = $("<div class=\"jqEasyCounterMsg\">&nbsp;</div>");
        var jqEasyCounterMsgStyle = {
          'font-size' : options.msgFontSize,
          'font-family' : options.msgFontFamily,
          'color' : options.msgFontColor,
          'text-align' : options.msgTextAlign,
          'width' : $this.width(),
          'opacity' : 0
        };
        jqEasyCounterMsg.css(jqEasyCounterMsgStyle);
        
        // append counter element to DOM
        jqEasyCounterMsg[options.msgAppendMethod]($this);
			
        // bind events to this element
        $this
        .bind('keydown keyup keypress', doCount)
        .bind('focus paste', function(){
          setTimeout(doCount, 10);
        })
        .bind('blur', function(){
          jqEasyCounterMsg.stop().fadeTo( 'fast', 0);
          return false;
        });
			
        function doCount(){
          var val = $this.val(),
          length = val.length
				
          if(length >= options.maxChars) {
            val = val.substring(0, options.maxChars); 				
          }
				
          if(length > options.maxChars){
            // keep scroll bar position
            var originalScrollTopPosition = $this.scrollTop();
            $this.val(val.substring(0, options.maxChars));
            $this.scrollTop(originalScrollTopPosition);
          }
				
          if(length >= options.maxCharsWarning){
            jqEasyCounterMsg.css({
              "color" : options.msgWarningColor
              });
          }else {
            jqEasyCounterMsg.css({
              "color" : options.msgFontColor
              });
          }
        
          var len = $this.val().length,
          max = options.maxChars,
          left = max - len,
          msg = options.msgString.replace('%chars%', len);
            
          if (left == 1 && options.msgSingleCharString.length > 0) {
            msg = options.msgSingleCharString;
          }
          msg = msg.replace('%max%', max);
          msg = msg.replace('%left%', left);
          jqEasyCounterMsg.html(msg);    //'Characters: ' + $this.val().length + "/" + options.maxChars);
          jqEasyCounterMsg.stop().fadeTo( 'fast', 1);
        }
      });
    }
  });

})(jQuery);