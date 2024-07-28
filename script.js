const urlTitres = "http://localhost:8000/api/v1/titles/"
const urlTrier = "http://localhost:8000/api/v1/titles/?page_size=6&sort_by=-imdb_score&genre="
const urlGenres = "http://localhost:8000/api/v1/genres/"
const urlNombreGenres = "http://localhost:8000/api/v1/genres/?page_size="

const urlTrierComedie = urlTrier + "Comedy"
const urlTrierCrime = urlTrier + "Crime"

let listeGenresFilm = []
let images = document.getElementById("image-meilleur-film")
let titreMeilleurFilm = document.getElementById("titre-meilleur-film")
let descriptionMeilleureFilm = document.getElementById("description-meilleure-film")
let bouton = document.getElementById("bouton-meilleur-film")

meilleurFilm()
espaceImages(urlTrierComedie, 'comedie')
espaceImages(urlTrierCrime, 'policier')
espaceImages(urlTrier, 'mieux-note')
toutesCategories()
voirPlus()

// La fonction affiche le film le mieux noté
function meilleurFilm() {
    fetch(urlTrier)
        .then(Response => Response.json())
        .then(data => {
            images.src = data.results[0].image_url
            titreMeilleurFilm.innerHTML = data.results[0].title
            fetch(data.results[0].url)
                .then(Response => Response.json())
                .then(data => {
                    descriptionMeilleureFilm.innerHTML = data.description
                })
            let meilleurFilmId = data.results[0].id
            bouton.addEventListener("click", () => {
                modal(meilleurFilmId)
            });
        });
}

// La fonction cree une zone d'images avec overlay
function espaceImages(urlSection, classId) {
    fetch(urlSection)
        .then(Response => Response.json())
        .then(datas => {
            const section = document.getElementById(classId)
            section.innerHTML = ""
            datas.results.forEach(espace => {
                let nouvelElement = document.createElement("div")
                nouvelElement.classList.add("espace")
                images = espace.image_url
                nouvelElement.innerHTML = `
                        <img src="${images}" alt="${espace.title}">
                        <div class="overlay">
                            <em>${espace.title}</em>
                            <button id="details" espace='${JSON.stringify(espace)}'>Détails</button>
                        </div>`
                section.appendChild(nouvelElement)
            });
            document.querySelectorAll('#details').forEach(button => {
                button.addEventListener('click', (espaceimage) => {
                    let meilleurFilmId = JSON.parse(espaceimage.target.getAttribute('espace'))
                    modal(meilleurFilmId.id)
                });
            });
        });
}

// La fonction récupére des films par catégorie
function toutesCategories() {
    fetch(urlGenres)
        .then(Response => Response.json())
        .then(data => {
            let url = urlNombreGenres
            let nombreCategorie = data.count
            fetch(url + nombreCategorie)
                .then(Response => Response.json())
                .then(data => {
                    for (i = 0; i < nombreCategorie; i++) {
                        let categorie = data.results[i].name
                        listeGenresFilm.push(categorie)
                    }
                    menuDeroulant(listeGenresFilm)
                });
        });
}

// La fonction affiche les films de la liste
function menuDeroulant(liste) {
    let selection = document.getElementById("categories")
    for (i = 0; i < liste.length; i++) {
        let options = `<option value="${liste[i]}">${liste[i]}</option>`
        selection.innerHTML += options
    }
    const element = document.getElementById('categories')
    element.addEventListener('change', function () {
        const selectedGenreId = element.options[element.selectedIndex].textContent
        let urlTrierSelection = urlTrier + selectedGenreId
        espaceImages(urlTrierSelection, 'choix-categorie')

    });

}

// La fonction récupére des données pour la fenêtre modale
function modal(meilleurFilmId) {
    fetch(urlTitres + meilleurFilmId)
        .then(Response => Response.json())
        .then(data => {

        document.getElementById("mImage").src = data.image_url
        document.getElementById("mTitre").innerHTML = data.title
        document.getElementById("mGenre").innerHTML = data.genres
        document.getElementById("mDate").innerHTML = data.date_published
        document.getElementById("mClassification").innerHTML = data.rated
        document.getElementById("mScore").innerHTML = data.imdb_score + "/10"
        document.getElementById("mRealisateur").innerHTML = data.directors
        document.getElementById("mActeurs").innerHTML = data.actors
        document.getElementById("mDuree").innerHTML = data.duration + " min"
        document.getElementById("mPays").innerHTML = data.countries
        let mBoxOffice = document.getElementById("mRecettes")
        if (data.worldwide_gross_income === null) {
            mBoxOffice.innerHTML = "Non disponible"
        } else {
            mBoxOffice.innerHTML = data.worldwide_gross_income.toLocaleString() + " " + data.budget_currency
        }
        let mdescription = document.getElementById("mResume")
        if (data.long_description === null || data.long_description === "|") {
            mdescription.innerHTML = "Le résumé pour ce film est non disponible pour le moment "
        } else {
            mdescription.innerHTML = data.long_description
        }

    });
    let modal = document.getElementById("modal")
    modal.classList.add("mVisible")
    const modalClose = modal.querySelector("[data-dismiss=dialog]")
    modalClose.addEventListener("click", () => {
        modal.classList.remove("mVisible")
    });
}

// La fonction pour visualiser plus ou moins des films pour tablette ou smartphone
function voirPlus() {
    let listeBoutons = document.querySelectorAll('button')
    for (let i = 0; i < listeBoutons.length; i++) {
        let boutonActuel = listeBoutons[i]
        boutonActuel.addEventListener('click', (event) => {
            monBouton = event.target
            if(monBouton.id == "bouton1"){
                const categoriesDiv = document.getElementById("mieux-note")
                categoriesDiv.classList.toggle("categories")
                categoriesDiv.classList.toggle("visible")
            }
            if (monBouton.id == "bouton2") {
                const categoriesDiv = document.getElementById("policier")
                categoriesDiv.classList.toggle("categories")
                categoriesDiv.classList.toggle("visible")
            }
            if (monBouton.id == "bouton3") {
                const categoriesDiv = document.getElementById("comedie")
                categoriesDiv.classList.toggle("categories")
                categoriesDiv.classList.toggle("visible")
            }
            if (monBouton.id == "bouton4") {
                const categoriesDiv = document.getElementById("choix-categorie")
                categoriesDiv.classList.toggle("categories")
                categoriesDiv.classList.toggle("visible")
            }

        });
    }
}
