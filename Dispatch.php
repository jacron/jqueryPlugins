<?php

/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * Description of Dispatch
 *
 * @author jan
 */
class Dispatch {
  public function render($data) {
      header('Content-Type: application/x-json');
      //error_log('rendered: ' . print_r($data, true));
      echo json_encode($data); //utf8_encode($parms['json']);
  }
}

?>
