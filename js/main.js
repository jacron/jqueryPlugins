$(function() {

  var selectedAction;

  // vul teksten in voor voorbeeld
  function displayDemo(action) {
    var data = jsonData[action];
    $test.removeClass('selected');

    $('#content-header').text(data.header);
    $('#beschrijving-js').html(data.descriptionJs);
    $('pre#html').html(data.html);
    $('pre#js').html(data.js);
    $('#voorbeeld').html(data.voorbeeld);
    $('#jstest').toggle(data.schakelaar);

    var html = '', i = 0;
    for(; i < data.features.length; i++) {
      html += '<li>' + data.features[i] + '</li>';
    }
    $('#kenmerken').html(html);

    selectedAction = action;
    $.cookie('selectedAction', selectedAction);

    if (action == 'wisselcitaat') {
      $('.quotes').randomquote();
    }
  }

  // handle navigation
  $('.action').click(function(){
    displayDemo(this.id)
  });

  // Inhoud en titel van de dialoog die waarschuwt dat de tijd bijna verstreken is.
  var warnDialogContent =
'<div class="warning-expiration" style="display:none">' +
'<p>Als u %duur% minuten niets heeft opgeslagen, wordt u automatisch uitgelogd. ' +
'Dit is ingesteld om uw gegevens zo goed mogelijk te beveiligen. Niet opgeslagen gegevens zullen verloren gaan.</p>' +
'<p>Wilt u ingelogd blijven? Klik dan op de knop OK.</p>' +
'</div>',
      warnDialogTitle =
  'Over <span class="timer-tekst">%duur%</span> minuten wordt u automatisch uitgelogd!';

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
      switch(selectedAction) {
        case 'tekenteller':

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
        case 'carrousel':
          $('#carrouselcontainer').carrousel({
            carrouselSlideDuration: 3000
          });
          break;
        case 'timer':
          $('#sessie-timer-tekst').sessietimer({
            'sessieDuur' : $('#sessieduur').val(),
            'waarschuwingsGrens' : $('#waarschuwingslimiet').val(),
            'afterExpiration': function() {
                $('.options-expiration').hide();
              }
            }, '#sessie-timer-verlengen', warnDialogContent, warnDialogTitle
          );
          break;
        case 'validatie':

          break;
        case 'tekstlade':
          $('#tips').textdrawer();
          break;
        case 'wisselcitaat':
          // geen schakelaar op deze demo-pagina
          break;
      }
    }
  });

    var action = 'tekenteller';
    if ($.cookie('selectedAction') && typeof $.cookie('selectedAction') != 'undefined') {
      action = $.cookie('selectedAction');
    }
    displayDemo(action);

});