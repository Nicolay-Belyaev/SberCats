const addCatInLocalStorage = (cat) => {
    let localCat = localStorage.getItem('cats')
    if (!localCat) {
        localStorage.setItem(
            'cats',
            JSON.stringify([cat]))
    } else {
        localStorage.setItem(
            'cats',
            JSON.stringify([...JSON.parse(localStorage.getItem('cats')), cat])
        )}
}

const openCatCardPopup = (cat) => {
    const content = document.getElementsByClassName('content')[0]
    content.insertAdjacentHTML('afterbegin', generateCatPopup(cat))

    let catPopup = document.querySelector('.popup-wrapper-cat-card');
    let closePopup = document.querySelector('.popup-close-cat-card');
    closePopup.addEventListener('click', () => {
        catPopup.remove()
    })
}
const updateCatInLocalStorage = (cat) => {
    let localCats = JSON.parse(localStorage.getItem('cats'))
    for (let i = 0; i < localCats.length; i++) {
        if (localCats[i].id == cat.id) {
            localCats[i] = cat
        }
    }
    localStorage.setItem(
        'cats',
        JSON.stringify(localCats)
    )
}
const deleteCatFromLocalStorage = (catId) => {
    localStorage.setItem(
        'cats',
        JSON.stringify(JSON.parse(localStorage.getItem('cats')).filter((el) => el.id != catId))
    )
}

const refreshCatsAndContentLocal = () => {
    const content = document.getElementsByClassName('content')[0];
    content.innerHTML = '';
    const cards = JSON.parse(localStorage.getItem('cats'))
    content.insertAdjacentHTML('afterbegin',
        cards.reduce((acc, el) => acc + generateCard(el), ''))
}
