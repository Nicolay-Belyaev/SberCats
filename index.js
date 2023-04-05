// не очень понимаю, как следует структурировать код, но пусть будет как-то так.

// Global BEGIN

let localStorage = window.localStorage
localStorage.setItem('modalFormShowButton', '')


// Global END


// HTML BEGIN

const modalFormDiv = document.getElementsByClassName('create-edit-modal-form')[0];
const modalForm = document.forms[0];
const content = document.getElementsByClassName('content')[0];

const addCatButton = document.getElementById('add-cat');
const closeModalFormButton = document.getElementById('close-form');

// HTML END


// EventListeners BEGIN

addCatButton.addEventListener('click', (event) => {
	cleanModalForm()
	modalFormDiv.classList.add('active')
	localStorage.setItem('modalFormShowButton', 'addCat') // если форма активирована кнопкой "Добавить котика".
});

closeModalFormButton.addEventListener('click', () => {
	cleanModalForm()
	modalFormDiv.classList.remove('active')
	localStorage.setItem('modalFormShowButton', '')
});

content.addEventListener('click', (event) => {
	if (event.target.tagName === 'BUTTON') {
		switch (event.target.className) {
			case 'cat-card-view':
				api.getCatById(event.target.value)
					.then((res) => {
						openCatCardPopup(res)
					})
				break;
			case 'cat-card-update':
				api.getCatById(event.target.value)
					.then((res) => {
						for (let i = 0; i < modalForm.elements.length; i++) {
							modalForm.elements[i].value = Object.values(res)[i]
						}
						modalFormDiv.classList.add('active')
						localStorage.setItem('modalFormShowButton', 'updateCat') // если форма активирована кнопкой "Изменить".
					})
				break;
			case 'cat-card-delete':
				api.deleteCat(event.target.value).then(() => {
					refreshCatsAndContent();
				})
				break;
		}
	}
});

modalForm.addEventListener('submit', (event) => {
	event.preventDefault();
	const formData = new FormData(modalForm)
	const cat = Object.fromEntries(formData.entries())
	switch (String(localStorage.getItem('modalFormShowButton'))) {
		case 'addCat':
			api.addCat(cat).then(() => {
				addCatInLocalStorage(cat)
				alert("Котик добавлен! Ура!")
				refreshCatsAndContentLocal();
			})
			break;
		case 'updateCat':
			api.updateCat(cat).then(() => {
				alert("Котик обновлен!")
				refreshCatsAndContent();
			})
	}

});

// EventListeners END

// async functions BEGIN

const refreshCatsAndContent = () => {
	const content = document.getElementsByClassName('content')[0];
	content.innerHTML = '';

	api.getAllCats().then((res) => {
		const cards = res.reduce((acc, el) => (acc += generateCard(el)), '');
		content.insertAdjacentHTML('afterbegin', cards);
	});
};

const openCatCardPopup = (cat) => {
	const content = document.getElementsByClassName('content')[0]
	content.insertAdjacentHTML('afterbegin', generateCatPopup(cat))

	let catPopup = document.querySelector('.popup-wrapper-cat-card');
	let closePopup = document.querySelector('.popup-close-cat-card');
	closePopup.addEventListener('click', () => {
		catPopup.remove()
	})
}

// async functions END

// localStorage functions BEGIN

const refreshCatsAndContentLocal = () => {
	const content = document.getElementsByClassName('content')[0];
	content.innerHTML = '';
	const cards = JSON.parse(localStorage.getItem('cats'))
	console.log(cards)
	if (cards.length) {
		content.insertAdjacentHTML('afterbegin', cards.reduce((acc, el) => (acc += generateCard(el))))
	} else {
		content.insertAdjacentHTML('afterbegin', generateCard(cards))
	}
}

// все сложность у нас тут потому что JSON.parse() в зависимост от того, что получил на вход, выдает разные
// результаты: Object, Array или value.
const addCatInLocalStorage = (cat) => {
	let localCat = localStorage.getItem('cats')
	// если у нас не было котиков, то мы пишем в строку value нового котика
	if (!localCat) {
		localStorage.setItem(
			'cats',
			JSON.stringify([cat]))
	// если у нас есть один котик, нам надо взять имеющегося в localStorage котика и нового котика.
	// JSON.parse() вернет нам Object-котика у которого нет свойства length
	} else if (!JSON.parse(localCat).length) {
		localStorage.setItem(
			'cats',
			JSON.stringify([localCat, cat])
		)
	// если у нас есть много котиков, нам надо взять котиков из localStorage и проспредить их, а потом добавить котика
	// JSON.parse() вернет нам Array из Object'ов-котиков.
	} else {
		localStorage.setItem(
			'cats',
			JSON.stringify([...JSON.parse(localStorage.getItem('cats')), cat]))
	}
}

const deleteCatFromLocalStorage = (catId) => {
	localStorage.setItem(
		'cats',
		JSON.stringify(
			JSON.parse(localStorage.getItem('cats')).filter((el) => el.id != catId)
		)
	)
}

const getNewIdOfCatLocal = () => {
	let localCats = JSON.parse(localStorage.getItem('cats'))
	if (localCats.length) {
		return Math.max(...localCats.map((el) => el.id)) + 1
	} else {
		return 1
	}
}

const cleanModalForm = () => {
	for (const modalFormElement of modalForm.elements) {
		modalFormElement.value = null
	}
}

// localStorage functions END

refreshCatsAndContentLocal();