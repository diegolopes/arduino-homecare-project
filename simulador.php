<?php
    /* Simulador
     *   Esse script foi criado apenas para testar os gráficos
     *  de forma rápida. no script main.js basta adicionar o
     *  url desse script.
    */


    header("Access-Control-Allow-Origin: *");
    header('Content-Type: application/json');
    $data = array("temperature" => rand(24,50), "bpm" => rand(60,72));

    echo json_encode($data);


