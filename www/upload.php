<?php
include 'config.php';
include 'dbUtilities.php';

$session_expiration = time() + 3600 * 24 * 2; // +2 days
session_set_cookie_params($session_expiration);
session_start();

$connection=dbConnect();

if ($_FILES['userfile']['error'] !== UPLOAD_ERR_OK) {
    die("Upload failed with error " . $_FILES['userfile']['error']);
}

if (!isset($_FILES['userfile']) || !is_uploaded_file($_FILES['userfile']['tmp_name'])) {
   echo 'Non hai inviato nessun file...';
  exit;    
}

//percorso della cartella dove mettere i file caricati dagli utenti
//$uploaddir = 'C:\xampp\htdocs\arganddec\public_html\www\upload\';

//Recupero il percorso temporaneo del file
$userfile_tmp = $_FILES['userfile']['tmp_name'];

//recupero il nome originale del file caricato
$userfile_name = $_FILES['userfile']['name'];

// Controllo se il file esiste già, e in caso lo rinomino
$fullpath = $uploaddir . $userfile_name;
$additional = '1';

while (file_exists($fullpath)) {
    $info = pathinfo($fullpath);
    $fullpath = $info['dirname'] . '/'
              . $info['filename'] . $additional
              . '.' . $info['extension'];
}


//copio il file dalla sua posizione temporanea alla mia cartella upload
//move_uploaded_file($userfile_tmp, $fullpath);
$result = array();
if (move_uploaded_file($userfile_tmp, $fullpath)) {
  //Se l'operazione è andata a buon fine...
    $result['success']=1;
    $result['path']=$fullpath;
   echo json_encode($result);
   
   
}else{
  //Se l'operazione è fallta...
  $result['success']=0;
  $result['path']=null;
  echo json_encode($result);
}

mysql_close($connection);
?>