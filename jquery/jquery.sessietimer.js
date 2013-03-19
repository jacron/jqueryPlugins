/**
 * jquery.sessietimer.js
 *
 * Plugin die een timer start om de sessieduur te spiegelen, d.w.z. aan de clientkant
 * een zelfde duur bij te houden als aan de serverkant, bijv. 15 minuten.
 *
 * Als een grenswaarde overschreden wordt, verschijnt een dialoog met een
 * waarschuwingstekst, en een aflopende teller.
 *
 * Voor de dialoog die wordt aangeroepen is de jQuery UI bibliotheek noodzakelijk.
 *
 * Als de sessieduur verstreken is, verdwijnt de waarschuwing als die nog zichtbaar is,
 * en wordt een callback aangeroepen, bijv. om de uitloglink te verbergen.
 *
 * author: Jan Croonen
 * date: 10/2012
 */
/*global jQuery */
(function ($) {

  'use strict';

  $.fn.sessietimer = function (p_options, verlengen, warnDialogContent, warnDialogTitle) {

    var
      settings = {
        'bijwerkInterval': 1, // in seconden
        'sessieDuur': 15,  // in minuten
        'waarschuwingsGrens': 3, // in minuten (0 = niet waarschuwen)
        'sessieAanBoodschap': 'Uw sessie verloopt in %duur% minuten.',
        'sessieEindeBoodschap': 'Uw sessie is verlopen',
        'afterExpiration': $.noop
      },
      noMoreWarning = false,
      sessieTijdOver, // in seconden
      options = $.extend(settings, p_options),
      timerTekst,
      intervalId,
      warnExpirationDialog = null,

      resetTimer = function () {
        if (intervalId) {
          sessieTijdOver = parseInt(options.sessieDuur, 10) * 60;
        }
      },

      makeWarnExpirationDialog = function () {
        return $(warnDialogContent.replace('%duur%', options.sessieDuur)).dialog({
          autoOpen: false,
          title: warnDialogTitle.replace('%duur%', options.waarschuwingsGrens),
          modal: true,
          buttons: [
            {
              text: 'OK',
              click: function () {
                resetTimer();
                $(this).dialog('close');
                berichtSessie();
                noMoreWarning = false;
              },
              deflt: true
            },
            {
              text: 'Annuleer',
              click: function () {
                $(this).dialog('close');
              }
            }
          ],
          open: function () {
            jQuery(this).parents('ui-dialog-buttonpane button:eq(0)').focus();
          },
          close: function () {
            noMoreWarning = true;
          }
        });
      },

      callUIDialogWarnExpiration = function () {
        if (warnExpirationDialog === null) {
          warnExpirationDialog = makeWarnExpirationDialog();
        }
        warnExpirationDialog.dialog('open');
      },

      berichtSessie = function () {
        var seconden, minuten, tijd, msg;

        seconden = sessieTijdOver % 60;
        if (seconden < 10) {
          seconden = '0' + seconden;
        }
        minuten = (sessieTijdOver - seconden) / 60;
        tijd  = minuten + ':' + seconden;
        msg = options.sessieAanBoodschap.replace('%duur%', tijd);

        timerTekst.html(msg);
        $('.timer-tekst').html(tijd); // vul het verstrijken der tijd ook in in de dialoog

        sessieTijdOver -= 1;
        if (sessieTijdOver === 0) {
          timerTekst.html(options.sessieEindeBoodschap);
          clearInterval(intervalId);
          options.afterExpiration();
          if (warnExpirationDialog) {
            warnExpirationDialog.dialog('close');
          }
        }
        if (options.waarschuwingsGrens > 0 && minuten < options.waarschuwingsGrens && !noMoreWarning) {
          callUIDialogWarnExpiration();
        }
      };

    $(verlengen).click(function () {
      sessieTijdOver = parseInt(options.sessieDuur, 10) * 60;
      berichtSessie();
    });

    return this.each(function () {
      timerTekst = $(this);
      sessieTijdOver = parseInt(options.sessieDuur, 10) * 60;
      berichtSessie();
      intervalId = setInterval(berichtSessie, options.bijwerkInterval * 1000);
    });
  }
}(jQuery));

