<?php
    header("Access-Control-Allow-Origin: *");
    header('Content-Type: application/json');
    $data = array("temperature" => rand(24,30));

    echo json_encode($data);


