<?php
header("Access-Control-Allow-Origin:*");
include("bConnection.php");
include_once './GCM.php';
$gcmf = new GCM();

$dataCur = date('o-m-d H:i:s');

$type = $_REQUEST['type'];

if($type == "su"){
$urn = $_REQUEST['urn'];
$pas = $_REQUEST['pas'];

$query = "SELECT * FROM tbl_urs WHERE usernm = '$urn'";
$result = mysqli_query($con,$query) or die(mysqli_error());
if(mysqli_num_rows($result)){
	
	$query = "SELECT * FROM tbl_urs WHERE usernm = '$urn' AND pass = '$pas'";
	$result = mysqli_query($con,$query) or die(mysqli_error());
	if(mysqli_num_rows($result)){
		echo 1;
	}else{
		echo 0;	
	}
}else{
	$query = "INSERT INTO tbl_urs (usernm, pass) VALUES('$urn', '$pas') ";
	mysqli_query($con,$query) or die(mysqli_error());
	echo 2;
}

}else if($type == "regdevice"){
$usr = $_REQUEST['urenm']; // Must be already set
$gcm = $_REQUEST['gcmdevice'];

$query = "UPDATE tbl_urs SET gcm = '$gcm' WHERE usernm = '$usr'";
	mysqli_query($con,$query) or die(mysqli_error());
	echo 1;
	
	
}else if($type == "saveset"){

$mg = $_REQUEST['mg'];
$yg = $_REQUEST['yg'];
$cn = $_REQUEST['cn'];
$sn = $_REQUEST['sn'];
$gm = $_REQUEST['gm'];
$usr = $_REQUEST['user'];

$query = "UPDATE tbl_urs SET country = '$cn', state = '$sn', iam = '$mg', ilike = '$yg', age = '$gm' WHERE pk_id = '$usr'";
mysqli_query($con,$query) or die(mysqli_error());
echo 1;
}else if($type == "getstype"){

$usr = isset( $_REQUEST['shwt'] ) ? $_REQUEST['shwt'] : "";
$country = isset( $_REQUEST['country'] ) ? $_REQUEST['country'] : "";

$prev = "";
if (isset($_REQUEST['prevFrom'])) {
$prev = $_REQUEST['prevFrom'];
}


$prevStm = "";
if($country==""  && $usr=="" && $prev != "" ){
$prevStm = " AND s.pk_id < $prev ";
}else if($country==""  && $usr!="" && $prev != "" ){
$prevStm = " AND s.pk_id < $prev ";
}else if($country!=""  && $usr=="" && $prev != "" ){
$prevStm = " AND s.pk_id < $prev ";
}else if($country!=""  && $usr!="" && $prev != "" ){
$prevStm = " AND s.pk_id < $prev ";
}



$cntryQry = "";
if($country==""){
$cntryQry = "";
}else if($country!="" && $usr!=""){
$cntryQry = " AND u.country = '$country' ";
}else if($country!="" && $usr==""){
$cntryQry = " AND u.country = '$country' ";
}


$condition = "";

if($usr==""){
$condition = "";
}else if($usr=="mf"){
$condition = " AND u.iam = 'm' AND u.ilike = 'f' ";
}else if($usr=="mm"){
$condition = " AND u.iam = 'm' AND u.ilike = 'm' ";
}else if($usr=="fm"){
$condition = " AND u.iam = 'f' AND u.ilike = 'm' ";
}else if($usr=="ff"){
$condition = " AND u.iam = 'f' AND u.ilike = 'f' ";
}else if($usr=="me"){
$condition = " AND u.iam = 'm' AND u.ilike = 'e' ";
}else if($usr=="fe"){
$condition = " AND u.iam = 'f' AND u.ilike = 'e' ";
}


$query = "SELECT s.pk_id,u.pk_id,u.usernm,u.country,u.state,s.status,u.iam,u.ilike,s.flag,s.time,u.age  FROM  tbl_status s,tbl_urs u WHERE s.user_pkid = u.pk_id ".$condition.$cntryQry.$prevStm." ORDER   BY  s.pk_id DESC LIMIT 0,8";


$result = mysqli_query($con,$query) or die(mysqli_error());
$json = array(); 
if(mysqli_num_rows($result)){

while($row=mysqli_fetch_row($result)){

			$json[]=$row; 
	
} echo json_encode($json);

 
} else{
echo '[["","00001","","","",""]]';
}


}else if($type == "getAllStatus"){

$fromUid = $_REQUEST['userid'];
$json = array(); 
$query = "SELECT * FROM tbl_status WHERE user_pkid = $fromUid ORDER BY  tbl_status.time DESC  LIMIT 0 , 12";

//echo $query;
$result = mysqli_query($con,$query) or die(mysqli_error());
$json = array(); 
if(mysqli_num_rows($result)){
	while($row=mysqli_fetch_row($result)){
				$json[]=$row; 
	} 
	echo json_encode($json);
}else{
	echo '[]';
}

}else if($type == "delMyStatus"){

$statid = $_REQUEST['statid'];
$json = array(); 
$query = "DELETE FROM tbl_status WHERE pk_id = $statid";

$result = mysqli_query($con,$query) or die(mysqli_error());
echo '1';

}else if($type == "saveStatus"){

$urn = $_REQUEST['userId'];
$status = $_REQUEST['thisVal'];

$query = "SELECT * FROM tbl_urs WHERE pk_id = $urn";


$result = mysqli_query($con,$query) or die(mysqli_error());
$row = mysqli_fetch_array($result,MYSQLI_BOTH) or die(mysqli_error());

$query = "INSERT INTO tbl_status (user_pkid, username, country, statenm,status,iam,ilike,time) VALUES('".$row['pk_id']."', '".$row['usernm']."','".$row['country']."','".$row['state']."','$status','".$row['iam']."','".$row['ilike']."','$dataCur') ";

mysqli_query($con,$query) or die(mysqli_error());


// $query = "SELECT  s.pk_id,u.pk_id,u.usernm,u.country,u.state,s.status,u.iam,u.ilike,s.flag,s.time,u.age FROM tbl_status s,tbl_urs u WHERE s.username = '$urn' AND s.username = u.usernm ORDER  BY time DESC LIMIT 0,1";
// $result = mysqli_query($con,$query) or die(mysqli_error());
// $json = array(); 
// if(mysqli_num_rows($result)){

// while($row=mysqli_fetch_row($result)){

// 			$json[]=$row; 
	
// } echo json_encode($json);

 
// } else{
echo '1';
// }



}else if($type == "privmsg"){

$toUserid = $_REQUEST['toUserid'];
$toUsernm = $_REQUEST['toUsernm'];
$frmusr = $_REQUEST['frmusr'];
$frmusrid = $_REQUEST['frmusrid'];
$primsg = $_REQUEST['msg'];
$noti = $_REQUEST['not'];

$query = "INSERT INTO tbl_primessages (frmid, frmnm, toid, tonm,messg,timestemp) VALUES('".$frmusrid."', '".$frmusr."','".$toUserid."','".$toUsernm."','$primsg','$dataCur') ";
mysqli_query($con,$query) or die(mysqli_error());
echo 1;
if($noti=='y'){
$msg =  $primsg;
$qry = "SELECT * FROM tbl_urs WHERE pk_id = '$toUserid' LIMIT 0,1";
$rlt = mysqli_query($con,$qry) or die(mysqli_error());
$rw=mysqli_fetch_array($rlt,MYSQLI_BOTH);
$registrationId = $rw['gcm'];
$title = $frmusr." sent msg!";
$gcmf->send_notification(array($registrationId),$title,$msg,0);
}


}else if($type == "getUserdetails"){

$fromUid = $_REQUEST['frmusr'];

$query = "SELECT pk_id,usernm,country,state,iam,ilike,age,time,lastlogged,about FROM tbl_urs WHERE pk_id = '$fromUid'";
$json = array(); 
$result = mysqli_query($con,$query) or die(mysqli_error());
//$row = mysqli_fetch_array($result,MYSQLI_BOTH) or die(mysqli_error());
//echo $row['pk_id'];
	if(mysqli_num_rows($result)){
		while($row=mysqli_fetch_row($result)){ 
			$json[]=$row; 
		} 
	} 
echo json_encode($json); 

}else if($type == "getUserdetailsName"){

$fromUid = $_REQUEST['frmusr'];

$query = "SELECT pk_id,usernm,country,state,iam,ilike,age,time,lastlogged,about FROM tbl_urs WHERE usernm = '$fromUid'";
$json = array(); 
$result = mysqli_query($con,$query) or die(mysqli_error());
//$row = mysqli_fetch_array($result,MYSQLI_BOTH) or die(mysqli_error());
//echo $row['pk_id'];
	if(mysqli_num_rows($result)){
		while($row=mysqli_fetch_row($result)){ 
			$json[]=$row; 
		} 
	} 
echo json_encode($json); 

}else if($type == "getChatUserDetails"){

$fromUid = $_REQUEST['userid'];
$json = array(); 
$query = "SELECT * FROM tbl_urs WHERE pk_id = '$fromUid'";
$result = mysqli_query($con,$query) or die(mysqli_error());
$row = mysqli_fetch_array($result,MYSQLI_BOTH) or die(mysqli_error());
$json[]=$row; 
echo json_encode($json);

}else if($type == "getMessagesRec"){

$usr = $_REQUEST['usrid'];
$msgtype = $_REQUEST['msgtype'];

//$query = "SELECT * FROM tbl_primessages as m, tbl_urs as u WHERE m.toid='$usr' AND  m.frmnm = u.usernm AND m.toid!=m.frmid AND  m.pk IN (SELECT MAX(p.pk) FROM tbl_primessages as p GROUP BY p.frmid) ORDER BY timestemp DESC";
//$query = "SELECT * FROM tbl_primessages as m, tbl_urs as u WHERE (m.toid='$usr' or m.frmnm ='$usr') AND m.frmnm = u.usernm AND m.toid!=m.frmid GROUP BY m.frmid ORDER BY timestemp DESC";
//$query = "SELECT * FROM tbl_primessages as m, tbl_urs as u WHERE m.toid='$usr' AND m.toid!=m.frmid GROUP BY m.frmid ORDER BY timestemp DESC";

//$query = "SELECT * FROM tbl_primessages as m, tbl_urs as u WHERE m.toid='$usr' AND  m.frmnm = u.usernm AND m.toid!=m.frmid AND  m.pk IN (SELECT MAX(p.pk) FROM tbl_primessages as p GROUP BY p.frmid) ORDER BY timestemp DESC";

if($msgtype == 'sent'){
//Sent	
$query = "SELECT * FROM tbl_primessages Where frmid = '$usr' GROUP BY toid ORDER BY timestemp DESC";

}else if($msgtype == 'resc'){
//Recieved 
$query = "SELECT * FROM tbl_primessages Where toid = '$usr' GROUP BY frmid  ORDER BY timestemp DESC";

}	
//echo $query;


$result = mysqli_query($con,$query) or die(mysqli_error());
$json = array(); 
if(mysqli_num_rows($result)){

while($row=mysqli_fetch_row($result)){

			$json[]=$row; 
	
} echo json_encode($json);

 
} else{
echo '[]';
}


}else if($type == "getlastid"){

$usr = $_REQUEST['user'];
$to = $_REQUEST['to'];

$query = "SELECT  * 
FROM    tbl_primessages a
WHERE   (a.frmid = '$usr' AND a.toid = '$to') OR
        (a.frmid = '$to' AND a.toid = '$usr') 
ORDER   BY pk DESC LIMIT 0, 1";
$result = mysqli_query($con,$query) or die(mysqli_error());
if(mysqli_num_rows($result)){
$row = mysqli_fetch_array($result,MYSQLI_BOTH) or die(mysqli_error());
echo $row['pk'];
}
}else if($type == "getOlderMsg"){

$from = $_REQUEST['user'];
$to = $_REQUEST['to'];
$mtime =  $_REQUEST['lastId'];


$query = "SELECT * FROM (
  SELECT * 
  FROM tbl_primessages a 
  WHERE ((a.frmid = '$from' AND a.toid = '$to') OR
        (a.frmid = '$to' AND a.toid = '$from')) AND pk <= '$mtime'  
  ORDER BY pk DESC
  LIMIT 10
) AS `table` ORDER by pk ASC";



$result = mysqli_query($con,$query) or die(mysqli_error());
$json = array(); 
if(mysqli_num_rows($result)){while($row=mysqli_fetch_row($result)){ 
		$queryy = "UPDATE tbl_primessages SET seen='1' WHERE pk='".$row[0]."'"; 
		$resultt = mysqli_query($con,$queryy) or die(mysqli_error());
$json[]=$row; 
} 
} 
echo json_encode($json); 

}else if($type == "getMsg"){

$from = $_REQUEST['user'];
$to = $_REQUEST['to'];
$mtime =  $_REQUEST['lastId'];



$query = "SELECT  * 
FROM    tbl_primessages  a
WHERE   a.frmid = '$to' AND a.toid = '$from' AND pk > '$mtime'  
ORDER   BY pk ASC";

$result = mysqli_query($con,$query) or die(mysqli_error());
$json = array(); 
if(mysqli_num_rows($result)){while($row=mysqli_fetch_row($result)){
$qry = "UPDATE tbl_primessages  SET seen='1' WHERE frmid = '".$to."' AND toid='".$from."'  AND pk='".$row[0]."'";
mysqli_query($con,$qry) or die(mysqli_error());  
 
$json[]=$row; 
} 
} 
echo json_encode($json); 



}else if($type == "loadOlderMsg"){

$from = $_REQUEST['user'];
$to = $_REQUEST['to'];
$mtime =  $_REQUEST['lastId'];



$query = "SELECT * FROM (
  SELECT * 
  FROM tbl_primessages a 
  WHERE ((a.frmid = '$from' AND a.toid = '$to') OR
        (a.frmid = '$to' AND a.toid = '$from')) AND pk < '$mtime'  
  ORDER BY pk DESC
  LIMIT 10
) AS `table` ORDER by pk DESC";



$result = mysqli_query($con,$query) or die(mysqli_error());
$json = array(); 
if(mysqli_num_rows($result)){while($row=mysqli_fetch_row($result)){ 
		$queryy = "UPDATE tbl_primessages SET seen='1' WHERE pk='".$row[0]."'"; 
		$resultt = mysqli_query($con,$queryy) or die(mysqli_error());
$json[]=$row; 
} 
} 
echo json_encode($json); 



}else if($type == "getCountryNames"){

$query = "SELECT DISTINCT(country) FROM tbl_urs WHERE country !='' AND flag = '0' ORDER BY country";
$result = mysqli_query($con,$query) or die(mysqli_error());
$json = array(); 
if(mysqli_num_rows($result)){
while($row=mysqli_fetch_row($result)){ 
$json[]=$row; 
} 
} 
echo json_encode($json); 

}else if($type == "getAllCountries"){

$query = "SELECT * FROM countries ORDER BY name ASC";
$result = mysqli_query($con,$query) or die(mysqli_error());
$json = array(); 
if(mysqli_num_rows($result)){
while($row=mysqli_fetch_row($result)){ 
$json[]=$row; 
} 
} 
echo json_encode($json); 

}else if($type == "checkNotification"){

$usr = $_REQUEST['usrid'];

$query = "SELECT DISTINCT(frmid) FROM tbl_primessages WHERE frmid != '$usr' AND toid = '$usr' AND seen = 0 ORDER BY timestemp DESC";

$result = mysqli_query($con,$query) or die(mysqli_error());
if(mysqli_num_rows($result)){
echo mysqli_num_rows($result);
} else{
echo 0;
}


}else if($type == "chatalert"){

$toUserid = $_REQUEST['toUserid'];
$toUsernm = $_REQUEST['toUsernm'];
$frmusr = $_REQUEST['frmusr'];
$frmusrid = $_REQUEST['frmusrid'];

$query = "SELECT * FROM tbl_primessages WHERE frmid = '$frmusrid' AND toid = '$toUserid' AND seen = 0 ORDER BY timestemp DESC LIMIT 0,1";


$result = mysqli_query($con,$query) or die(mysqli_error());
if(mysqli_num_rows($result)){
$row = mysqli_fetch_array($result,MYSQLI_BOTH) or die(mysqli_error());
$msg =  $row['messg'];

$qry = "SELECT * FROM tbl_urs WHERE pk_id = '$toUserid' LIMIT 0,1";
$rlt = mysqli_query($con,$qry) or die(mysqli_error());
$rw=mysqli_fetch_array($rlt,MYSQLI_BOTH);
$row=mysqli_fetch_array($result,MYSQLI_BOTH);
$registrationId = $rw['gcm'];
$title = $frmusr." sent msg!";
$gcmf->send_notification(array($registrationId),$title,$msg,0);
}


}


?>

