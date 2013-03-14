<?php
include 'Controller.php';
include 'Dispatch.php';
include 'Model.php';

$controller = new Controller();
$result = $controller->handle($_REQUEST);
if ($result == 'success') {
  exit;
}
?>
<!DOCTYPE html>
<html>
  <head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">

    <title>jQuery plugins</title>

    <link type="text/css" rel="stylesheet" href="css/style.css"/>
    <link type="text/css" rel="stylesheet" href="css/carrousel.css"/>
    <link type="text/css" rel="stylesheet" href="css/jquery.snippet.css"/>

    <script type="text/javascript" src="jquery/jquery-1.8.3.min.js"></script>
    <script type="text/javascript" src="jquery/jquery.jqEasyCharCounter.js"></script>
    <script type="text/javascript" src="js/modernizr.js"></script>
    <script type="text/javascript" src="jquery/jquery.snippet.js"></script>
    <script type="text/javascript" src="jquery/jquery.divs2carrousel.js"></script>
    <script type="text/javascript" src="jquery/jquery.cookie.js"></script>

    <script type="text/javascript" src="js/main.js"></script>

  </head>
  <body>
      <div id="header" class="h1">
        <div>jQuery plugins-demo</div>
      </div>
    <div id="wrapper">
      <div id="navigatie-kolom">
        <ul>
          <li id="tekenteller">Tekenteller</li>
          <li id="carrousel">Carrousel</li>
          <li id="timer">Timer</li>
          <li id="validatie">Validatie<li>
          <li id="tekstlade">Tekstlade</li>
          <li id="wissel-citaat">Wissel-citaat</li>
        </ul>

      </div>
      <div id="content">
        <div id="error-message"><?=$result?></div>
        <div id="content-header"></div>
        <div id="content-body">
          <div id="voorbeeld"></div>
          <div class="clear">
      <div class="test">Javascript</div>
      <button id="test"></button>
        </div>
          <div id="beschrijving-html"></div>
          <div id="code-wrapper">
            <div>
              <pre id="html"></pre>
            </div>
          <div id="beschrijving-js"></div>
            <div>
              <pre id="js"></pre>
            </div>
          </div>
        </div>
      </div>
      <div id="sidebar">
          <div><ul id="kenmerken"></ul></div>
      </div>
    </div>
      <div id="footer">
        <div>
          <a href="http://jquery.com">jquery.com</a> | <a href="http://jcroonen.nl">jcroonen.nl</a>
        </div>
      </div>
  </body>
</html>
