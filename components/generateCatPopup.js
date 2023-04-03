const generateCatPopup = (cat) => {
    return `<div class="popup-wrapper-cat-card">
                <div>
                    <img src="${cat.image}">
                </div>
                <div>
                    <button type="button" class="popup-close-cat-card">Close</button>
                    <div>Имя котика: ${cat.name}</div>
                    <div>Описание котика:  ${cat.description}</div>
                    <div>Возрат: ${cat.age}</div>
                    <div>Рейтинг: ${cat.rate}</div>
                <div>
                </div>
            </div>`

}
