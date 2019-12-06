<?php
    header("Access-Control-Allow-Origin: *");
    header('Content-Type: application/json');
    $data = array("temperature" => rand(24,50), "bpm" => rand(60,72));

    echo json_encode($data);


