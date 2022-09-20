import './assets/css/normalize.css';
import './assets/css/skeleton.css';
import './assets/css/custom.css';
import { Article } from './domain/article.interface';

type EventElement = Event & HTMLElement & {
  target: HTMLElement
};

const $ = <T = HTMLElement>(selector: string) => {
  const element = document.querySelector(selector);
  if (element) return element as T;
  throw new Error("Element not found");
}

const $query = <T = HTMLElement>(e: HTMLElement, selector: string) => {
  const element = e.querySelector(selector);
  if (element) return element as T;
  throw new Error("Element not found");
}

// Variables
const $carrito = $('#carrito');
const $listaCursos = $('#lista-cursos');
const $contenedorCarrito = $('#lista-carrito tbody');
const $vaciarCarritoBtn = $('#vaciar-carrito');
let articulosCarrito: Article[] = [];

// Listeners
cargarEventListeners();

function cargarEventListeners() {
  // Dispara cuando se presiona "Agregar Carrito"
  $listaCursos.addEventListener('click', agregarCurso);

  // Cuando se elimina un curso del carrito
  $carrito.addEventListener('click', eliminarCurso);

  // Al Vaciar el carrito
  $vaciarCarritoBtn.addEventListener('click', vaciarCarrito);

}




// Funciones
// Función que añade el curso al carrito
function agregarCurso(e: Event) {
  e.preventDefault();
  const event = e as EventElement;
  console.log(event.target.parentElement!.parentElement);
  // Delegation para agregar-carrito
  if (event.target.classList.contains('agregar-carrito')) {
    const curso = event.target.parentElement!.parentElement;
    // Enviamos el curso seleccionado para tomar sus datos
    leerDatosCurso(curso as HTMLElement);
  }

}


// Lee los datos del curso
function leerDatosCurso(curso: HTMLElement) {
  const infoCurso: Article = {
    imagen: $query<HTMLImageElement>(curso, 'img').src,
    titulo: $query(curso, 'h4').textContent ?? "",
    precio: curso.querySelector('.precio span')!.textContent ?? "",
    id: parseInt($query(curso, 'a').getAttribute('data-id') ?? "0"),
    cantidad: 1
  }


  if (articulosCarrito.some(curso => curso.id === infoCurso.id)) {
    const cursos = articulosCarrito.map(curso => {
      if (curso.id === infoCurso.id) {
        curso.cantidad++;
        return curso;
      } else {
        return curso;
      }
    })
    articulosCarrito = [...cursos];
  } else {
    articulosCarrito = [...articulosCarrito, infoCurso];
  }

  // console.log(articulosCarrito)



  // console.log(articulosCarrito)
  carritoHTML();
}

// Elimina el curso del carrito en el DOM
function eliminarCurso(e: Event) {
  e.preventDefault();
  const event = e as EventElement;
  if (event.target.classList!.contains('borrar-curso')) {
    // e.target.parentElement.parentElement.remove();
    const cursoId = parseInt(event.target.getAttribute('data-id') ?? "0")
    // Eliminar del arreglo del carrito
    articulosCarrito = articulosCarrito.filter(curso => curso.id !== cursoId);
    carritoHTML();
  }

}


// Muestra el curso seleccionado en el Carrito
function carritoHTML() {

  vaciarCarrito();

  articulosCarrito.forEach(curso => {
    const row = document.createElement('tr');
    row.innerHTML = `
               <td>  
                    <img src="${curso.imagen}" width=100>
               </td>
               <td>${curso.titulo}</td>
               <td>${curso.precio}</td>
               <td>${curso.cantidad} </td>
               <td>
                    <a href="#" class="borrar-curso" data-id="${curso.id}">X</a>
               </td>
          `;
    $contenedorCarrito.appendChild(row);
  });

}

// Elimina los cursos del carrito en el DOM
function vaciarCarrito() {
  // forma lenta
  // contenedorCarrito.innerHTML = '';


  // forma rapida (recomendada)
  while ($contenedorCarrito.firstChild) {
    $contenedorCarrito.removeChild($contenedorCarrito.firstChild);
  }
}

