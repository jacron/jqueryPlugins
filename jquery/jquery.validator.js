+/*
 * plugin, gemodelleerd naar validation.js 
 */
///////////////////////////////////////////////////////////////////
// FORM VALIDATION FUNCTIONS
// add class names to check the validation:
// bh_empty : check empty fields, checkbox groups, radiobutongroups, emtpty tables
// bh_zipcode : check zipcode pattern
// bh_numeric : check numeric pattern
// bh_alpha : check alphabetic pattern
// bh_alphanumeric : check alphanumeric pattern
// bh_email : check emailadres
// bh_date : check  date between 1900 and 2100
// bh_maxrange_### : check maximum number
// bh_minrange_### : check minimum number
// bh_confirm <idfield> : check if the inputfield has the same value as the related field
// bh_nonemptywhenempty <idfield>: check if not empty when related field is  empty
// bh_nonemptyrelated <idfield>: check if not empty when related field is NOT empty
// bh_minchar_### : check if value of field with class textField has a minimum length
// bh_hasnumber : check if input field value has a minimum of 1 number
// bh_phonenumber : check phone number pattern
///////////////////////////////////////////////////////////////// 

// bestaande inline code fragment: onclick="return /validate('eplatform_form')"
// eplatform_form is de id van de form tag
// in validate.js line 101: function validate(oForm, sMessageContainer)
// div id="errorMessage": kandidaat voor plugin

// aanroep van deze plugin: $('#eplatform_form').validator('#errorMessage');

// required: foutboodschappen.json.js

(function($) {
 $.fn.validator = function(messagebox, g_options) {
   var options = $.extend(foutboodschappen, g_options),
      errors = [],
      $messagebox = $(messagebox),
      $form,
      form;

  // check if it and its parents are visible and enabled
  var isEnabled = function(el){
    var bEnabled = false;
    
    if (el == null) return true;
    
    while (el != document.body &&
      (!el.disabled && 
      !($(el).hasClass('hide') || !($(el).is(':visible'))
        ))) {
            //console.log(el);
          el = el.parentNode;
      }
    if (el == document.body) {
      bEnabled = true;
    }
    return bEnabled;
  }

  /* Gebruik als veldnaam in een foutboodschap in volgorde van voorkeur:
   * 1. attribuut title
   * 2. attribuut name
   * 3. attribuut id
   */
  var getTitle = function($el) {

    var title = $el.attr('title');
    if (!title || title == 'undefined' || title.length == 0) {
      title = $el.attr('name');
    }
    if (!title || title == 'undefined' || title.length == 0) {
      title = $el.attr('id');
    }
    return title;      
  };

  // Vul veldnaam in, in foutboodschap.
  var newError = function(msg, $el) {
    var title = getTitle($el);
    return msg
      .replace(/<field>/g, title)
      .replace(/%field%/g, title);
  };

  // Vul veldnaam en waarde in, in foutboodschap.
  var newErrorValue = function(msg, waarde, $el) {
    var title = getTitle($el);
    return msg
      .replace(/<field>/g, title)
      .replace(/<value>/g, waarde)
      .replace(/%field%/g, title)
      .replace(/%value%/g, waarde);
  };

  // Vul veldnaam en 2 waarden in, in foutboodschap.
  var newErrorValue2 = function(msg, waarde, waarde2, $el) {
    var title = getTitle($el);
    return msg
      .replace(/<field>/g, title)
      .replace(/<value>/g, waarde)
      .replace(/<value2>/g, waarde2)
      .replace(/%field%/g, title)
      .replace(/%value%/g, waarde)
      .replace(/%value2%/g, waarde2)
      ;
  };

  // Vul twee veldnamen in, in foutboodschap.
  var newErrorVeld = function(msg, veld2, $el) {
    var title = getTitle($el);
    return msg
      .replace(/<field>/g, title)
      .replace(/<field2>/g, veld2)
      .replace(/%field%/g, title)
      .replace(/%field2%/g, veld2)
      ;
  };

  var attachErrorToField = function(error, $v) {
    $v.parents('div.formField')
      .prepend('<div class="errorMessage">' + error + '</div>')
      .addClass('notvalid');
  };
  
  // Controleer of radiobuttons- of checkboxes-groep leeg is.
  var validateGroup = function($nonempty, group, element) {
    var empty = false;
    if ($nonempty.hasClass(group)) {
      empty = true;
      $nonempty.find(element).each(function(i,v){
        if ($(v).is(':checked')){
          empty = false;
        }
      });
    }
    return empty;
  };
  
  var validateRelated = function($nonempty, bEmpty) {
    var sClass = bEmpty? 'bh_nonemptywhenempty': 'bh_nonemptyrelated';
    return true;
  };
  
  var validateTable = function($nonempty) {
    var table = $nonempty.find('table');
    if (!table || !isEnabled(table)) return true;
    if ($(table).find('tr').length > 0) {
      return true;
    }
    return false;
  };
  
  var validateForm = function($nonempty) {
    
  };
  
  // check nonempty fields based on bh_nonempty class
  var validateNonEmpty = function() {
    var empty = false,
        emptyTextfield, emptyRadio, emptyChk, 
        //emptyRelatedEmpty, emptyRelatedNonEmpty,
        emptyTable, emptyForm;

    $form.find('.bh_nonempty').each(function(i,v){
      var $v = $(v);

      if (!isEnabled(v)) return true;  // continue 

      emptyTextfield = $v.is(':input') && $v.val().trim().length == 0;
      emptyRadio = validateGroup($v, 'radiobuttons', ':radio');
      emptyChk = validateGroup($v, 'checkboxes', ':checkbox');
      //emptyRelatedEmpty = validateRelated($v, true);
      //emptyRelatedNonEmpty = validateRelated($v, false);
      //emptyTable = validateTable($v);
      emptyForm = validateForm($v);
      
      if (emptyTextfield || emptyRadio || emptyChk || emptyTable) {
        //$v.addClass('notvalid');
        
        // add error to list
        errors[$v.attr('id')] = newError(options.lijst.messageEmpty, $v);
        
        // add error to field
        var error = newError(options.velden.messageEmpty, $v);
        attachErrorToField(error, $v);
        
        empty = true;
      }
    });
    return !empty;
  };
  
  // check nonempty textfield on minimum amount of characters
  var validateMinChar = function() {
    var valid = true,
        $n = $form.find('.textField');
    
    $n.each(function(i,v){
      var $v = $(v),
          cls = v.className,
          sReg = /bh_minchar_([0-9]+){1}/,
          m, n;

      if (!isEnabled(v)) return true;  // continue 
      if ($v.hasClass('notvalid')) return true;  // continue 
      
      m = cls.match(sReg);
      if (!m || m.length < 2) return true;  // continue
      
      n = m[1];
      if ($v.val().length < n) {
        valid = false;
        //$v.addClass('notvalid');
        errors[$v.attr('id')] = newErrorValue(options.lijst.messageMinChar, n, $v);        

        var error = newErrorValue(options.velden.messageMinChar, n, $v);
        attachErrorToField(error, $v);
      }
    });
    return valid;    
  };

  // check on valid date (dd-mm-jjjj)
  var validateDate = function() {
    var valid = true,
        sReg = /^(\d{2})[./-](\d{2})[./-](\d{4})$/,
        m, dag, maand, jaar,
        $n = $form.find('.bh_date');
        
    $n.each(function(i,v){
      var $v = $(v),
          val = $v.val(),
          dValid = false;

      if (!isEnabled(v)) return true;  // continue 
      if (val.length == 0) return true;  // continue (empty date is not invalid)
      
      m = val.match(sReg);  
      if (m !== null) {
        dValid = true;
        dag = m[1];
        maand = m[2];
        //jaar = m[3];
        
        // Onvolledige validatie op geldig dag- en maandgetal;
        // meer volledige validatie moet op de server gebeuren.
        if (dag < 1 || dag > 31) dValid = false;
        if (maand < 1 || maand > 12) dValid = false;
      }
      if (!dValid) {
        valid = false;
        var div = $v.next('div'),
            msg,
            error;
            
        if (div && $(div).hasClass('bh_date_msg')) {
          var msg = $(div).html(),
              error = newError(msg, $v);
        }
        else {
          error = newError(options.velden.messageDate, $v);
        }
        attachErrorToField(error, $v);
        errors[$v.attr('id')] = newError(options.lijst.messageDate, $v);                  
      }
    });  
    return valid;    
  }

  // check on valid time (HH:mm)
  var validateTime = function() {
    var valid = true,
        sReg = /^(\d{2})\:(\d{2})$/,
        m, hour, min;
  
    $form.find('.bh_time').each(function(i,v){
      var $v = $(v),
          val = $v.val(),
          dValid = true;

      if (!isEnabled(v)) return true;  // continue 
      if (val.length == 0) return true;  // continue (empty value is not invalid)
      
      m = val.match(sReg);  
      if (m !== null) {
        hour = m[1];
        min = m[2];
        
        // Validatie op geldig uren en minuten.
        if (hour < 1 || hour > 23) dValid = false;
        if (min < 1 || min > 59) dValid = false;
      }
      if (!dValid) {
        valid = false;
        errors[$v.attr('id')] = newError(options.lijst.messageTime, $v);        
      }
    });
    return valid;    
  }

 /** validateFormat: algemene validatie 
   * @clsName: string, validatie class
   * @regExp: string, reguliere expressie om tegen te testen
   * @lijstMessage: string, boodschap voor in de lijst
   * @veldMessage: string, boodschap voor boven het veld
   * 
   * N.B. leading en trailing whitespace negeren? (met trim())
   * Doet de achterkant dat?
   */
  var validateFormat = function(clsName, regExp, lijstMessage, veldMessage) {
    var valid = true;
    
    $form.find(clsName).each(function(i,v){
      var $v = $(v),
          val = $v.val();
      
      if (!isEnabled(v)) return true;  // continue 
      if (val.length == 0) return true;  // continue (empty value is not invalid)
      
      if (!regExp.test(val)) {
        valid = false;
        errors[$v.attr('id')] = newError(lijstMessage, $v);                
        attachErrorToField(newError(veldMessage, $v), $v);
      }
    });
    return valid;        
  };
  
  // waarde moet numeriek zijn en eventueel binnen minimum en/of maximum waarde liggen
  var validateNumeric = function() {
    var valid = true,
        $n = $form.find('.bh_numeric');
    
    $n.each(function(i,v){
      var $v = $(v),
          val = $v.val().trim(),
          cls = v.className,
          sRegNum = /^[+-]?\d+$/,
          sRegMin = /bh_minrange_([0-9]+){1}/,
          sRegMax = /bh_maxrange_([0-9]+){1}/,
          min, minVal = null, max, maxVal = null,
          error,
          numValid = true;

      if (!isEnabled(v)) return true;  // continue 
      if ($v.hasClass('notvalid')) return true;  // continue 
      if (val.length == 0) return true;  // continue 
      
      // numerieke string?
      if (!sRegNum.test(val)) {
        //console.log('not numeric', val);
        numValid = false;         
      }
      else {
        // test minimum
        min = cls.match(sRegMin);
        if (min && min.length == 2) {
          minVal = min[1];
          if (parseInt(val) < minVal) {
            numValid = false;
          }
          else {
            minVal = null;
          }
        }

        // test maximum
        max = cls.match(sRegMax);
        if (max && max.length == 2) {      
          maxVal = max[1];
          if (parseInt(val) > parseInt(maxVal)) {
            numValid = false;
          }
          else {
            maxVal = null;
          }
        }
      }
      // display errors
      if (!numValid) {
        
        // error in lijst
        errors[$v.attr('id')] = newError(options.lijst.messageNumeric, $v);        
        
        // error bij veld, toegespitst op min- of max-fout, of beiden
        if (minVal && maxVal) {
          error = newErrorValue2(options.velden.messageNumericMinMax, minVal, maxVal, $v);
        }
        else if (!minVal && maxVal) {
          error = newErrorValue(options.velden.messageNumericMax, parseInt(maxVal) + 1, $v);
        }
        else if (!maxVal && minVal) {
          error = newErrorValue(options.velden.messageNumericMin, minVal - 1, $v);          
        }
        else {
          error = newError(options.velden.messageNumeric, $v);
        }
        attachErrorToField(error, $v);        
      }
    });
    return valid;    
  }

  var validateAlpha = function() {
    return validateFormat(
      '.bh_alpha', 
      /[^a-zA-Z]/g,
      options.lijst.messageAlpha,
      options.velden.messageAlpha
    );
  }

  var validateAlphaNumeric = function() {
    return validateFormat(
      '.bh_alphanumeric', 
      /[^a-zA-Z0-9]/g,
      options.lijst.messageAlphaNumeric,
      options.velden.messageAlphaNumeric
    );
  }
/*
  var validateAdr = function() {
    return validateFormat(
      '.bh_zip', 
      /^[0-9]{4}[a-z|A-Z]{2}?$/,
      options.lijst.messageNoAddress,
      options.velden.messageNoAddress
    );
  }
*/

  // postcode moet 4 cijfers en meteen daarna 2 letters bevatten
  // n.b. waarom mag er geen spatie tussen cijfers en de letters?
  var validatePostcode = function() {
    return validateFormat(
      '.bh_zip', 
      /^[0-9]{4}[a-z|A-Z]{2}?$/,
      options.lijst.messageZip,
      options.velden.messageZip
    );
  }

  // validatie email
  // [naam]@[domeinnaam].[top-level-domain]
  // [naam] mag 1 punt bevatten
  // [domeinnaam] mag 1 punt bevatten
  // [top-level-domain] mag 2 tot 4 tekens bevatten - pas op! achterhaald!
  var validateEmail = function() {
    return validateFormat(
      '.bh_email', 
      /^[_a-zA-Z0-9-]+(\.[_a-zA-Z0-9-]+)*@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*(\.[a-zA-Z]{2,4})$/,
      options.lijst.messageEmail,
      options.velden.messageEmail
    );
  };

  // telefoonnummer mag cijfers en mintekens bevatten
  // Deze validatie wordt niet gebruikt (?)
  var validatePhoneNumber = function() {
    return validateFormat(
      '.bh_phone', 
      /^[\s\+\-0-9]/g,
      options.lijst.messagePhoneNumber,
      options.velden.messagePhoneNumber
    );
  };

  var validateHasNumber = function() {
    return validateFormat(
      '.bh_hasnumber', 
      /\d+/g,
      options.lijst.messageHasNumber,
      options.velden.messageHasNumber
    );
  };

  var validateConfirmEmail = function() {
    var valid = true,
        n = $form.find('.bh_confirm.emailadres'),
        conf = [];
  
    n.each(function(i,v){
      if (!isEnabled(v)) return true;  // continue 
      conf[conf.length] = v;
    });
    
    if (conf.length != 2) return true; // no pair to validate
    
    var $first = $(conf[0]),
        $second = $(conf[1]);
        
    if ($first.val() != $second.val()) {
      valid = false;
      errors[$second.attr('id')] = newError(options.lijst.messageConfirm, $second);  
      attachErrorToField(newError(options.velden.messageConfirm, $second), $second);      
    }    
    return valid;    
  }

  var getElementsByClassName = function(pattern, el) {
    var elements = new Array();
    if (el == null) {
      el = document;
    }
    var childElements = el.getElementsByTagName('*'),
        reg = new RegExp(pattern),
        len = childElements.length,
        i;

    for (i = 0; i < len; i++) {
      if (reg.test(childElements[i].className)) {
        elements.push(childElements[i]);
      }
    }
    return elements;
  }
  
  var showErrors = function() {
    var html = options.lijst.messageHeader + '<ul>',
        elements = getElementsByClassName('bh_[a-zA-Z0-9]+', form);

    // volgorde van de elementen in het formulier aanhouden        
    for(var i = 0; i < elements.length; i++) {
      var $element = $(elements[i]),
          elementId = $element.attr('id');
          
      if (elementId) {
        var error = errors[elementId];
        if (error && error !== 'undefined') {
          html += '<li>' + error + '</li>';                        
        }
      }
    }
    $messagebox.html(html + '</ul>');
    $messagebox.show();
  };
  
  /* hoofdroutine */
  return this.each(function() {
    // init form
    form = this;
    $form = $(this);
    
    // attach messagebox, if absent
    if ($messagebox.length == 0) {  // geen box voor error lijst aanwezig
      $messagebox = $('<div class="errorMessages"></div>');
      $form.prepend($messagebox);
    }
    $form.submit(function() {
      var bValid = true;

      // init
      $messagebox.hide();
      
      // reset errors
      $form.find('*').removeClass('notvalid');
      errors = [];
      $form.find('.errorMessage').remove();

      if (!validateNonEmpty()) {
        bValid = false;
      }
      if (!validateMinChar()) {
        bValid = false;
      }
      if (!validateDate()) {
        bValid = false;
      }
      if (!validateTime()) {
        bValid = false;
      }
      if (!validateNumeric()) {
        bValid = false;
      }
      if (!validateAlpha()) {
        bValid = false;
      }
      if (!validateAlphaNumeric()) {
        bValid = false;
      }
      if (!validatePostcode()) {
        bValid = false;
      }
      if (!validateEmail()) {
        bValid = false;
      }
      if (!validatePhoneNumber()) {
        bValid = false;
      }
      if (!validateHasNumber()) {
        bValid = false;
      }
      if (!validateConfirmEmail()) {
        bValid = false;
      }
      
      if (!bValid) {
        showErrors();
      }
      /*return false; // debug */
      return bValid;  // if false, prevents the submit action
    });
  });        
 }
})(jQuery);
