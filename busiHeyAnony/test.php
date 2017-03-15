<?php
header("Access-Control-Allow-Origin:*");
include_once('simple_html_dom.php');
    //$url = 'http://m.usapoki.com/top30-punjabi-songs.php';
    //echo file_get_html($url);
	
	$str = file_get_html('http://m.usapoki.com/top30-punjabi-songs.php');

	// Find all images 
	//foreach($html->find('p.jatt') as $element){ 
			//foreach($element->a as $ele){ 
	//		echo $element. '<br>';
		//	}
	//}
	
	$html = str_get_html($str);
	$i = 0;
foreach($html->find('p.jatt') as $p) {
    foreach($p->find('a') as $a)
        echo $a->innertext . '<br>';
		
	echo $i++."------------------------------";	
}
	
?>