const input = document.getElementById('searchInput');
const results = document.getElementById('results');
const paginate = document.getElementById('paginate');

let page = Number(window.location.hash.replace("#", "")) || 1;
let maxPage = 0;

function renderCharacters(characters) {
  results.innerHTML = characters.map(char => `
    <div class="col-md-4 mb-4">
      <div class="card h-100 shadow-lg">
        <img src="${char.image}" class="card-img-top" alt="${char.name}">
        <div class="card-body">
          <h5 class="card-title">${char.name}</h5>
          <p class="card-text">
            <strong>Espécie:</strong> ${char.species}<br>
            <strong>Gênero:</strong> ${char.gender}<br>
            <strong>Mundo/Dimensão:</strong> ${char.origin.name}<br>
            <strong>Status:</strong> 
            <span class="badge ${char.status === 'Alive' ? 'bg-success' : char.status === 'Dead' ? 'bg-danger' : 'bg-secondary'}">
              ${char.status}
            </span>
          </p>
        </div>
      </div>
    </div>
  `).join('');
}

async function getCharacters() {
  try {
    const res = await fetch(`https://rickandmortyapi.com/api/character?page=${page}`);
    const data = await res.json();
    maxPage = data.info.pages;
    renderCharacters(data.results);
    renderPagination();
  } catch (err) {
    results.innerHTML = `<p class="text-center text-warning">Erro ao carregar personagens!</p>`;
    console.error(err);
  }
}

function renderPagination() {
  let buttons = '';
  if (page > 1) {
    buttons += `<button class="btn btn-outline-light me-2" id="prev">Anterior</button>`;
  }
  if (page < maxPage) {
    buttons += `<button class="btn btn-outline-light" id="next">Próximo</button>`;
  }
  paginate.innerHTML = buttons;

  if (document.getElementById('prev')) {
    document.getElementById('prev').addEventListener('click', () => changePage(page - 1));
  }
  if (document.getElementById('next')) {
    document.getElementById('next').addEventListener('click', () => changePage(page + 1));
  }
}

function changePage(newPage) {
  page = newPage;
  window.location.hash = "#" + page;
  getCharacters();
}

input.addEventListener('input', async () => {
  const query = input.value.trim();
  if (!query) {
    getCharacters(); 
    return;
  }

  try {
    const res = await fetch(`https://rickandmortyapi.com/api/character/?name=${query}`);
    const data = await res.json();

    if (data.error) {
      results.innerHTML = `<p class="text-center text-danger">Nenhum personagem encontrado!</p>`;
      paginate.innerHTML = "";
      return;
    }

    renderCharacters(data.results);
    paginate.innerHTML = ""; 
  } catch (err) {
    results.innerHTML = `<p class="text-center text-warning">Erro ao buscar personagens!</p>`;
    console.error(err);
  }
});

getCharacters();
