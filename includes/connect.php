<?php

class conexaoControle {

    var $query;
    var $link;
    var $resultado;

    function conexao(){
		$this->conectaBanco();
    }

    function conectaBanco() {

      $dados = parse_ini_file("/database.properties", false);

      $this->host     = $dados["host"];
      $this->dbase    = "chamados";
      $this->user     = $dados["user"];
      $this->senha    = $dados["pass"];

      $this->link = @mysql_connect($this->host,$this->user,$this->senha);
      if(!$this->link) {
        die();
      }
      elseif(!mysql_select_db($this->dbase,$this->link)) {
        die();
      }
    }

    function consultaBanco($query) {
      $this->conectaBanco();
      $this->query = $query;
      mysql_set_charset('utf8');
      if($this->resultado = mysql_query($this->query)) {
      $this->desconecta();
        return $this->resultado;
      }
      else {
        die(); $this->desconecta();
      }
    }

    function desconecta() {
      return mysql_close($this->link);
    }

}

?>
