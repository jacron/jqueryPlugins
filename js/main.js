$(function() {

  // init snippet
  function applySnippet() {
    $(function(){
//      $('pre#html').escapehtml();
/*
      $('pre#html').snippet('html', {
        style: 'emacs',
        showNum: false
      });
      $('pre#js').snippet('javascript', {
        style: 'emacs',
        showNum: false
      });
*/
    });
  }

  // vul teksten in voor voorbeeld
  function displayDemo(header, descriptionHtml, descriptionJs, js, html, features, voorbeeld) {
    $test.removeClass('selected');

    $('#content-header').text(header);
    $('#beschrijving-html').html(descriptionHtml);
    $('#beschrijving-js').html(descriptionJs);
    $('pre#html').html(html);
    $('pre#js').html(js);
    $('#voorbeeld').html(voorbeeld);

    var html = '', i=0;
    for(; i<features.length; i++) {
      html += '<li>' + features[i] + '</li>';
    }
    $('#kenmerken').html(html);
    applySnippet();
  }

  //
  function requestJson(action) {
    $.ajax({
      data: {
        ajax: action
      },
      dataType: 'json',
      success: function(data, status){
        displayDemo(data.header, data.descriptionHtml, data.descriptionJs,
          data.js, data.html, data.features, data.voorbeeld);
      },
      error: function(data, msg) {
        console.log(msg);
      }
    });

  }
  // handle navigation
  $('#tekenteller').click(function(){
    requestJson('tekenteller');
  });
  $('#carrousel').click(function() {
    requestJson('carrousel');
  });

  // handle javascript schakelaar
  var $test = $('#test');
  $test.click(function() {
    if ($test.hasClass('selected')) {
      $('#carrousel').carrousel('close');
      document.location.reload();
    }
    else {
      $test.addClass('selected');

      // actie hangt af van gekozen voorbeeld
      switch($('#content-header').text()) {
        case 'Tekenteller':

          // verberg statische melding
          $('.max-warning').hide();

          // init jqEasyCounter
          $('#testtextarea').jqEasyCounter({
            msgString: 'U kunt nog %left% tekens invoeren.',
            msgSingleCharString: 'U kunt nog 1 teken invoeren.',
            maxChars: 100,
            maxCharsWarning: 90
          });
          break;
        case 'Carrousel':
          $('#carrouselcontainer').carrousel({
            carrouselSlideDuration: 3000
          });
          break;
      }
    }
  });

    requestJson('tekenteller');

});