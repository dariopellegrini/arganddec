<?php

include 'dbUtilities.php';

$session_expiration = time() + 3600 * 24 * 2; // +2 days
session_set_cookie_params($session_expiration);
session_start();

$connection=dbConnect();

if (!isset($_SESSION['id'])) {
	echo "Your session expired...";
	die();
}

$owner = $_POST['uid'];
$debateid = $_POST['did'];

$sql = mysql_query("SELECT users.username, rights.accessright FROM rights INNER JOIN "
        . "users ON rights.userid=users.id WHERE rights.debateid='$debateid'") or die(mysql_error());

/*SELECT Customers.CustomerName, Orders.OrderID
FROM Customers
INNER JOIN Orders
ON Customers.CustomerID=Orders.CustomerID
ORDER BY Customers.CustomerName;*/

$num=mysql_num_rows($sql);

$str='Participants: <b>';
$accessright='';

if($num>0) {

    while($row = mysql_fetch_array($sql)){

        if($row["accessright"]=='o') {
            $accessright = 'owner';
        }
        else if($row["accessright"]=='r') {
            $accessright = 'read only';
        }
        else if($row["accessright"]=='w') {
            $accessright = 'read and modify';
        }
      
        $str.=$row["username"]."-".$accessright.", ";

    }
    
    $str = substr($str, 0, strlen($str)-2);

}

echo $str."</b>";

mysql_close($connection);