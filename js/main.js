/*global $, jsonData, document */

/* jQuery standard way for a self-executing function, fired when DOM is read */
$(function () {

  'use strict';

  var selectedAction,
    action,

    // initialisaties
    $test = $('#test'),

    // Inhoud van de dialoog die waarschuwt dat de tijd bijna verstreken is.
    warnDialogContent =
      '<div class="warning-expiration" style="display:none">' +
      '<p>Als u %duur% minuten niets heeft opgeslagen, wordt u automatisch uitgelogd. ' +
      'Dit is ingesteld om uw gegevens zo goed mogelijk te beveiligen.' +
      'Niet opgeslagen gegevens zullen verloren gaan.</p>' +
      '<p>Wilt u ingelogd blijven? Klik dan op de knop OK.</p>' +
      '</div>',

    // Titel van de dialoog die waarschuwt dat de tijd bijna verstreken is.
    warnDialogTitle =
      'Over <span class="timer-tekst">%duur%</span> minuten wordt u automatisch' +
      ' uitgelogd!';


  // vul teksten in voor voorbeeld
  function displayDemo(action) {
    var data = jsonData[action],
      html = '',
      i;

    $test.removeClass('selected');

    $('#content-header').text(data.header);
    $('#beschrijving-html').html(data.descriptionHtml);
    $('#beschrijving-js').html(data.descriptionJs);
    $('pre#html').html(data.html);
    $('pre#js').html(data.js);
    $('#voorbeeld').html(data.voorbeeld);
    $('#jstest').toggle(data.schakelaar);

    for (i = 0; i < data.features.length; i += 1) {
      html += '<li>' + data.features[i] + '</li>';
    }
    $('#kenmerken').html(html);

    selectedAction = action;
    $.cookie('selectedAction', selectedAction);

    if (action === 'wisselcitaat') {
      $('.quotes').randomquote();
    }
  }

  // handle navigation
  $('.action').click(function () {
    displayDemo(this.id);
  });

  // handle javascript schakelaar
  $test.click(function () {
    if ($test.hasClass('selected')) {
      $('#carrousel').carrousel('close');
      document.location.reload();
    } else {
      $test.addClass('selected');

      // actie hangt af van gekozen voorbeeld
      switch (selectedAction) {
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
          'afterExpiration': function () {
            $('.options-expiration').hide();
          }
        }, '#sessie-timer-verlengen', warnDialogContent, warnDialogTitle
          );
        break;
      case 'validatie':
        // nog niet gebouwd
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

  if ($.cookie('selectedAction') && $.cookie('selectedAction') !== 'undefined') {
    action = $.cookie('selectedAction');
  } else {
    action = 'tekenteller';
  }
  displayDemo(action);

});