<?php

$accion = (isset($_REQUEST['accion'])) ? $_REQUEST['accion'] : '';
if ($accion=='crear'){
    //creara un nuevo registro en la base de datos
    require_once('../funciones/db.php');

    //validar las entradas
    $nombre= filter_var($_POST['nombre'], FILTER_SANITIZE_STRING);
    $empresa= filter_var($_POST['empresa'], FILTER_SANITIZE_STRING);
    $telefono= filter_var($_POST['telefono'], FILTER_SANITIZE_STRING);
    

    try {
        $stm = $db->prepare("INSERT INTO contactos (nombre, empresa, telefono) VALUES (?,?,?)" );
        $stm->bind_param("sss", $nombre, $empresa, $telefono);
        $stm->execute();
        if ($stm->affected_rows==1) {//si hay uno afectado
            $respuesta=array(
                'respuesta'=> 'correcto',
                'datos'=> array(
                    'nombre'=>$nombre,
                    'empresa'=> $empresa,
                    'telefono'=>$telefono,
                    'id_insertado'=>$stm->insert_id
                )
            );
        }
        $stm->close();
        $db->close();

    } catch (Exception $e) {
        $respuesta=array(
            'error'=> $e->getMessage()
        );
        
    }
    echo json_encode($respuesta);
};
if($accion == 'borrar') {
    require_once('../funciones/db.php');

    //validar las entradas
    $id= filter_var($_GET['id'], FILTER_SANITIZE_NUMBER_INT);
    
    try { 
        $stm= $db->prepare("DELETE  FROM contactos WHERE id= ?" );
        $stm->bind_param("i", $id);
        $stm->execute();

        if ($stm->affected_rows==1) {
            $respuesta=array(
                'respuesta'=>'correcto'
            );
        }
        $stm->close();
        $db->close();
    } catch (Exception $e) {
        $respuesta=array(
            'error'=> $e->getMessage()
        );
    }
    echo json_encode($respuesta);
};

if($accion == 'editar') {
    //echo json_encode($_POST);
    require_once('../funciones/db.php');

    //validar las entradas
    $nombre= filter_var($_POST['nombre'], FILTER_SANITIZE_STRING);
    $empresa= filter_var($_POST['empresa'], FILTER_SANITIZE_STRING);
    $telefono= filter_var($_POST['telefono'], FILTER_SANITIZE_STRING);
    $id= filter_var($_POST['id'], FILTER_SANITIZE_NUMBER_INT);

    try {
        $stm= $db->prepare("UPDATE contactos SET nombre= ?, telefono=?, empresa=? WHERE id =?");
        $stm->bind_param("sssi", $nombre, $telefono, $empresa, $id);
        $stm->execute();

        if ($stm->affected_rows == 1) {
            $respuesta=array(
                'respuesta'=> 'correcto'
            );
        }else {
            $respuesta=array(
                'respuesta'=> 'error'
            );
        }
        $stm->close();
        $db->close();

    } catch (Exception $e) {
        $respuesta= array(
            'error'=>$e->getMessage()
        );
    }
    echo json_encode($respuesta); 
}    