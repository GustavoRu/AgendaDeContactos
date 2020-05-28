
<?php 
    include 'inc/funciones/funciones.php';
    include 'inc/layout/header.php';
?>
<div class="contenedor-barra">
    <h1>Agenda de contactos</h1>
</div>
<div class="bg-amarillo contenedor sombra">
    <form id="contacto" action="#">
        <div class="legend">Añada un contacto <span>Todos los campos son obligatorios</span></div>
        <?php include 'inc/layout/formulario.php';?>
    </form>
</div>
<div class="bg-blanco contenedor sombra contactos">
    <div class="contenedor-contactos">
        <h2>Contactos</h2>
        <input type="text" id="buscar" class="buscador sombra" placeholder="Buscar contactos...">

        <p class="total-contactos"><span></span> contactos</p>

        <div class="contenedor-tabla">
            <table id="listado-contactos" class="listado-contactos">
                <thead> 
                    <tr>
                        <th>Nombre</th>
                        <th>Empresa</th>
                        <th>Telefono</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    <?php $contactos= obtenerContactos();
                        if ($contactos->num_rows) {
                            foreach($contactos as $contacto){?> 
                              
                            <tr>
                                <td><?php echo $contacto['nombre'];?></td>
                                <td><?php echo $contacto['empresa'];?></td>
                                <td><?php echo $contacto['telefono'];?></td>
                                <td>
                                    <a href="editar.php?id=<?php echo $contacto['id'];?>" class="btn-editar btn">E
                                        <i class="fas fa-pen-square"></i>
                                    </a>
                                    <button data-id="<?php echo $contacto['id'];?>" type="button" class="btn-borrar btn">
                                        <i class="fas fa-trash-alt">X</i>
                                    </button>
                                </td>
                            </tr>
                    <?php  }
                        }
                    ?>
                </tbody>
            </table>
        </div>
    </div>
</div>


<?php include 'inc/layout/footer.php';?>