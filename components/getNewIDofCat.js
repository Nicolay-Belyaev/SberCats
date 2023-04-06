const getNewIdOfCatLocal = () => {
    let localCats = JSON.parse(localStorage.getItem('cats'))
    if (localCats.length) {
        return Math.max(...localCats.map((el) => el.id)) + 1
    } else {
        return 1
    }
}