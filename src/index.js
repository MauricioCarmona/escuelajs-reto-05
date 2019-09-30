window.onload = localStorage.clear();

const $app = document.getElementById("app");
const $observe = document.getElementById("observe");
const API = "https://rickandmortyapi.com/api/character/";

const getData = api => {
  fetch(api)
    .then(response => response.json())
    .then(response => {
      const next = response.info.next;
      localStorage.setItem("next_fetch", next);
      const characters = response.results;
      let output = characters
        .map(character => {
          return `
      <article class="Card">
        <img src="${character.image}" />
        <h2>${character.name}<span>${character.species}</span></h2>
      </article>
    `;
        })
        .join("");
      let newItem = document.createElement("section");
      newItem.classList.add("Items");
      newItem.innerHTML = output;
      $app.appendChild(newItem);
    })
    .catch(error => console.log(error));
};

const noMoreCharacters = () => {
  let newItem = document.createElement("p");
  newItem.classList.add("Message");
  newItem.innerText = "Ya no hay más personajes para mostrar";
  $app.appendChild(newItem);
  intersectionObserver.unobserve($observe);
};

const loadData = async () => {
  try {
    const nextUrl = localStorage.getItem("next_fetch");
    console.log(`localStorage: ${nextUrl}`);
    if (nextUrl === null) {
      return await getData(API);
    } else if (nextUrl === "") {
      return noMoreCharacters();
    } else {
      return await getData(nextUrl);
    }
  } catch (error) {
    console.log(`Ocurió un error: ${error}`);
  }
};

const intersectionObserver = new IntersectionObserver(
  entries => {
    if (entries[0].isIntersecting) {
      loadData();
    }
  },
  {
    rootMargin: "0px 0px 100% 0px"
  }
);

intersectionObserver.observe($observe);
