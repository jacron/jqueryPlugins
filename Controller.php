<?php
class Controller {
  public function handle($req) {
    $model = new Model();
    $dispatch = new Dispatch();
    $result = '';

    if (isset($req['ajax'])) {
      $m = $req['ajax'];
      switch($m) {
        case 'tekenteller':
          $dispatch->render($model->get($m));
          $result = 'success';
          break;
        case 'carrousel':
          $dispatch->render($model->get($m));
          $result = 'success';
          break;

        default:
          $result = 'error: wrong ajax-request';
          break;
      }
    }
    return $result;
  }
}