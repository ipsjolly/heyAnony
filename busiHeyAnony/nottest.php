<?php

 
    $headers = array("Content-Type:" . "application/json", "Authorization:" . "key=AIzaSyBpIrrQudtVMZYBPZPNcCTUA51qPyXZCes");
 
 $messageData = array
(
    'message' 		=> "hiii",
	'title'			=> "jkhfgdffkfds",
	'vibrate'	=> 1,
	'sound'		=> 0,
	'led' => 1
);   

$registrationIdsArray = array("APA91bExki3lUI8tiG0T4ambMsNJBHSlvki_CktABclrMW5-EU7-RU_9bKSoffXK5pREkQD-78hz_tzCGLzb8s2UqpsApq5LSsC1ykOdmMYtrW1WW5vykwpfImnyQAWGSNGwL_7CzqrpYk0LzU6BffdeSwZFaAIRIq4BtRBVEki3DVBYR22271g");

 $data = array(
        'data' => $messageData,
        'registration_ids' => $registrationIdsArray
    );
 

 
 
    $ch = curl_init();
 
    curl_setopt( $ch, CURLOPT_HTTPHEADER, $headers ); 
    curl_setopt( $ch, CURLOPT_URL, "https://android.googleapis.com/gcm/send" );
    curl_setopt( $ch, CURLOPT_SSL_VERIFYHOST, 0 );
    curl_setopt( $ch, CURLOPT_SSL_VERIFYPEER, 0 );
    curl_setopt( $ch, CURLOPT_RETURNTRANSFER, true );
    curl_setopt( $ch, CURLOPT_POSTFIELDS, json_encode($data) );
 
    $response = curl_exec($ch);
    curl_close($ch);
 
    return $response;

 
?>