<?php

function obtenerContactos(){
    include 'db.php';
    try {
        $consulta="SELECT * FROM contactos";
        return $db->query($consulta);
    } catch (Exception $e) {
        echo "Error!!". $e->getMessage(). "<br>";
        return false;
    }
}

//obtiene un contacto toma un id
function obtenerContacto($id){
    include 'db.php';
    try {
        $consulta="SELECT * FROM contactos WHERE id='$id'";
        return $db->query($consulta);
    } catch (Exception $e) {
        echo "Error!!". $e->getMessage(). "<br>";
        return false;
    }
}