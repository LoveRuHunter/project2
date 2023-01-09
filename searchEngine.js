const inputSearch = document.querySelector("input");
const inputApp = document.querySelector(".app-container");
const chosen = document.querySelector(".chosen-container");

chosen.addEventListener("click", function (event) {
    let target = event.target;
    if (!target.classList.contains("btn-close")) {
        return;
    }
    target.parentElement.remove();
});
inputApp.addEventListener("click", function (event) {
    let target = event.target;
    if (!target.classList.contains("app-content")) {
        return;
    }
addChosen(target);
    inputSearch.value = "";
    removePredictions();
});

function removePredictions () {
    inputApp.innerHTML = "";
}
function showPredictions(repositories) {
    let appPredictions = document.querySelectorAll(".app-container");
    removePredictions();

    for (let i = 0; i < 5; i++) {
        let name = repositories.items[i].name;
        let owner = repositories.items[i].owner.login;
        let stars = repositories.items[i].stargazers_count;

        let appContent = `<div class="app-content" data-owner="${owner}" data-stars="${stars}">${name}</div>`
        inputApp.innerHTML += appContent;
    }
}


function addChosen(target) {
    let name = target.textContent;
    let owner = target.dataset.owner;
    let stars = target.dataset.stars;

chosen.innerHTML += `<div class="chosen">Name: ${name}<br>Owner: ${owner}<br>Stars: ${stars}<button class="btn-close"></button></div>`;
}
async function getPredictions () {
    const urlRepositories = new URL("https://api.github.com/search/repositories?q=Q");
    let repositoriesPart = inputSearch.value;
    if (repositoriesPart === "") {
        removePredictions();
        return;
    }

    urlRepositories.searchParams.append("q", repositoriesPart)
    try {
        let response = await fetch(urlRepositories);
        if (response.ok) {
            let repositories = await response.json();
            showPredictions(repositories);
        } else {
            return null;
        }
    } catch (e) {
        return null;
    }
}
function deb(fn, timeout) {
    let time = null;
    return (...args) => {
        clearTimeout(time);
        return new Promise((resolve) => {
          time = setTimeout(
              () => resolve(fn(...args)),
              timeout,
          );
        });
    };
}

const getDebounce = deb(getPredictions, 200);
inputSearch.addEventListener("input", getDebounce);
