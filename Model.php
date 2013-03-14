<?php

/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * Description of Model
 *
 * @author jan
 */
class Model {

  private function escapeHtml($s) {
    return str_replace('>', '&gt;', str_replace('<', '&lt;', $s));
  }

  private function tekentellerData() {
    return array(

    'header' => 'Tekenteller',
    'descriptionHtml' => 'Bij het tekstvak staat, hoeveel tekens er maximaal mogen worden ingevoerd. Als
      u de plugin inschakelt wordt de melding dynamisch.',

    'descriptionJs' => 'Bij het aanroepen in javascript kunt u o.a. een sjabloontekst meegeven voor de melding.',

    'features' => array('jqEasyCharCounter',
'Hieraan heb ik toegevoegd: hoeveel tekens over?',
'<a href="http://www.jqeasy.com/jquery-character-counter/">on line documentatie</a>',
'<a href="jquery/jquery.jqEasyCharCounter.js">plugin code</a>',
),
    'html' => $this->escapeHtml('<textarea id="testtextarea" cols="60" rows="5"></textarea>'),

    'js' => "$(document).ready(function($) {
  $('#testtextarea').jqEasyCounter({
    msgString: 'U kunt nog %left% tekens invoeren.',
    msgSingleCharString: 'U kunt nog 1 teken invoeren.',
    maxChars: 100,
    maxCharsWarning: 90
  });
});",

    'voorbeeld' => '<textarea id="testtextarea" cols="50" rows="5"></textarea>' .
    '<div class="max-warning">Max. 100 tekens</div>',
    );
  }

  private function carrouselData() {
    return array(
      'header' => 'Carrousel',

      'descriptionHtml' => "Maak van een willekeurig aantal pagina's (divs binnen een div)
      een carrousel met navigatieknoppen.",

       'descriptionJs' => '',

        'features' => array('een willekeurig aantal plaatjes tot een carrousel maken\'s',
      'Timer stopt als de gebruiker een paginanummer kiest',
      '<a href="jquery/jquery.divs2carrousel.js">plugin code</a>',
            ),


        'html' => $this->escapeHtml('<div id="carrouselcontainer">
    <div class="blok slide1">
      <div class="innerblok">
      <p>Pagina 1</p>
      </div>
    </div>
    <div class="blok slide2">
      <div class="innerblok">
      <p>Pagina 2</p>
      </div>
    </div>
    <div class="blok slide3">
      <div class="innerblok">
      <p>Pagina 3</p>
      </div>
    </div>
</div>'),

        'js' => "$('#carrouselcontainer').carrousel({
  carrouselSlideDuration: 3000
});",

        'voorbeeld' => '<div id="carrouselcontainer">
      <div class="blok slide1">
        <div class="innerblok">
        <p>Pagina 1</p>
        </div>
      </div>
      <div class="blok slide2">
        <div class="innerblok">
        <p>Pagina 2</p>
        </div>
      </div>
      <div class="blok slide3">
        <div class="innerblok">
        <p>Pagina 3</p>
        </div>
      </div>
    </div>
 ',

    );
  }

  public function get($m) {
    switch($m) {
      case 'tekenteller':
        return $this->tekentellerData();
      case 'carrousel':
        return $this->carrouselData();
    }
  }
}

?>
