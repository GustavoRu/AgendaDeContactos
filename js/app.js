const formularioContactos= document.querySelector('#contacto'), 
      listadoContactos = document.querySelector('#listado-contactos tbody'),
      inputBuscador= document.querySelector('#buscar');

eventListener();
function eventListener(){
    //cuando el formulario de crear o editar se ejecuta
    formularioContactos.addEventListener('submit', leerFormulario);

    //listener para eliminar el boton
    if(listadoContactos){
        listadoContactos.addEventListener('click', eliminarContacto);
    }
    //buscardor
    inputBuscador.addEventListener('input', buscarContactos);

    numeroContactos();
    
}

function leerFormulario(e){
    e.preventDefault();
    //leer los datos de los inputs
    const nombre= document.querySelector('#nombre').value,
            empresa= document.querySelector('#empresa').value,
            telefono= document.querySelector('#telefono').value,
            accion = document.querySelector('#accion').value;

    if (telefono==="" || nombre==="" || empresa==="") {
        mostrarNotificacion('Todos los campos son obligatorios', 'error');
    }else{
        //pasa la validacion, crear llamado a ajax
        const infoContacto= new FormData();
        infoContacto.append('nombre', nombre);
        infoContacto.append('empresa', empresa);
        infoContacto.append('telefono', telefono);
        infoContacto.append('accion', accion);
        console.log(infoContacto);
        if (accion==='crear') {
            //creamos un nuevo contacto
            insertarBD(infoContacto);
        }else{
            //editar el contacto
            const idRegistro= document.querySelector('#id').value;
            infoContacto.append('id', idRegistro);
            actualizarRegistro(infoContacto); 
        }
    }
    
}
//inserta en la db via ajax
function insertarBD(datos) {
    //llamado a ajax

    //crear el objeto
    const xhr= new XMLHttpRequest();
    //abrir conexion
    xhr.open('POST', 'inc/modelos/modelo-contacto.php', true);
    //pasar los datos 
    xhr.onload= function(){
        if(this.status===200){
            console.log(JSON.parse(xhr.responseText));
            //leemos la respuesta de php(JSON.parse convierte el string en objeto)
            const respuesta=JSON.parse(xhr.responseText);
           
            //insertamos un nuevo elemento en la tabla
            const nuevoContacto= document.createElement('tr');

            nuevoContacto.innerHTML=`
                <td>${respuesta.datos.nombre}</td>
                <td>${respuesta.datos.empresa}</td>
                <td>${respuesta.datos.telefono}</td>
            `;
            //crear contenedor para los botones
            const contenedorAcciones= document.createElement('td');

            //crear el icono de editar
            const iconoEditar = document.createElement('i');
               iconoEditar.classList.add('fas', 'fa-pen-square');

            // crea el enlace para editar
            const btnEditar = document.createElement('a');
            btnEditar.appendChild(iconoEditar);
            btnEditar.href = `editar.php?id=${respuesta.datos.id_insertado}`;
            btnEditar.classList.add('btn', 'btn-editar');
            
            // agregarlo al padre
            contenedorAcciones.appendChild(btnEditar);

            // crear el icono de eliminar
            const iconoEliminar = document.createElement('i');
            iconoEliminar.classList.add('fas', 'fa-trash-alt');

            // crear el boton de eliminar
            const btnEliminar = document.createElement('button');
            btnEliminar.appendChild(iconoEliminar);
            btnEliminar.setAttribute('data-id', respuesta.datos.id_insertado);
            btnEliminar.classList.add('btn', 'btn-borrar');

            // agregarlo al padre
            contenedorAcciones.appendChild(btnEliminar);

            // Agregarlo al tr
            nuevoContacto.appendChild(contenedorAcciones);

            // agregarlo con los contactos
            listadoContactos.appendChild(nuevoContacto);       
            
            // Resetear el formulario
            document.querySelector('form').reset();

            // Mostrar la notificacion
            mostrarNotificacion('Contacto Creado Correctamente', 'correcto');

            // Actualizar el número
            numeroContactos();
        }
    }
    //enviar los datos
    xhr.send(datos);

}

function actualizarRegistro (datos) {
    //crear el objeto
    const xhr= new XMLHttpRequest();
    //abrir la conexion
    xhr.open('POST', 'inc/modelos/modelo-contacto.php', true);
    //leer la respuesta
    xhr.onload= function () {
        if (this.status===200) {
            const respuesta= JSON.parse(xhr.responseText);
            if (respuesta.respuesta==='correcto') {
                //mostrar notificacion
                mostrarNotificacion('Contacto editado correctamente', 'correcto');
            }else{
                //hubo un error
                mostrarNotificacion('Hubo un error al editar el contacto', 'error');
            }
            setTimeout(() => {
                window.location.href='index.php'
            }, 4000);
        }
    }
    //enviar la peticion
    xhr.send(datos);


}
//eliminar el contacto
function eliminarContacto(e) {
    if(e.target.parentElement.classList.contains('btn-borrar')){
        //tomar el id
        const id = e.target.parentElement.getAttribute('data-id');

        //preguntar al usuario
        const respuesta= confirm('Estas seguro');

        if(respuesta){
            //llamado a ajax
            //crear el objeto
            const xhr=new XMLHttpRequest();

            //abrir la conexion
            xhr.open('GET', `inc/modelos/modelo-contacto.php?id=${id}&accion=borrar`, true);
            
            //leer la respuesta
            xhr.onload= function() {
                if (this.status===200) {
                    const resultado= JSON.parse(xhr.responseText); 
                    console.log(resultado);
                    
                    if (resultado.respuesta==='correcto') {
                        //elimina el registro del DOM
                        console.log(e.target.parentElement.parentElement.parentElement);
                        e.target.parentElement.parentElement.parentElement.remove();
                        //mostrar notificacion
                        mostrarNotificacion('Contacto eliminado', 'correcto');

                        //actualizar el numero
                        numeroContactos();
                    }else{
                        //mostramos una notificacion
                        mostrarNotificacion('Hubo un error...', 'error');
                    }
                }
            }
            //enviar la peticion
            xhr.send();
        }   
    }
}

//notificacion en pantalla
function mostrarNotificacion(mensaje,clase){
    const notificacion= document.createElement('div');
    notificacion.classList.add(clase, 'notificacion', 'sombra');
    notificacion.textContent=mensaje;

    //formulario
    formularioContactos.insertBefore(notificacion, document.querySelector('form .legend'));

    //ocultar y mostrar la notificacion
    setTimeout(() => {
        notificacion.classList.add('visible');
        setTimeout(() => {
            notificacion.classList.remove('visible');
            setTimeout(() => {
                notificacion.remove();
            }, 500);
        }, 3000);
    }, 100);
}

//Buscador de registros
function buscarContactos(e){
    const expresion= new RegExp(e.target.value, "i"),
          registros= document.querySelectorAll('tbody tr');

    registros.forEach(registro=> {
        registro.style.display= 'none';

        if (registro.childNodes[1].textContent.replace(/\s/g, " ").search(expresion) != -1) {
            registro.style.display= 'table-row';
        }
        numeroContactos();
    }

    )
}

//Mostrar total de contactos
function numeroContactos() {
    const totalContactos= document.querySelectorAll('tbody tr'),
          contenedorNumero= document.querySelector('.total-contactos span');
    
    let total=0;
    totalContactos.forEach(contacto=>{
        if (contacto.style.display==='' || contacto.style.display=='table-row') {
            total++;
        }
    });
    //console.log(total);
    contenedorNumero.textContent= total;
}
