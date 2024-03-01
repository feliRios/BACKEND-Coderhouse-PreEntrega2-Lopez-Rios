// Implementacion de logica para desplazarse entre las paginas disponibles

const back = document.querySelector(".back");
const forward = document.querySelector(".forward");
const controls = document.querySelector(".controls");

const currentUrl = window.location.href;
const url = new URL(currentUrl);
const params = new URLSearchParams(url.search);

const currentPage = parseInt(params.get("page")) || 1;

forward.addEventListener("click", () => {
  const nextPage = currentPage + 1;
  if(nextPage <= controls.dataset.pages){
    // Condicional para evitar que se sigan sumando paginas inexistentes
    params.set("page", nextPage);
    url.search = params.toString();
    window.location.href = url.toString();
  }
});

back.addEventListener("click", () => {
  const prevPage = Math.max(currentPage - 1, 1);
  params.set("page", prevPage);
  url.search = params.toString();
  window.location.href = url.toString();
});