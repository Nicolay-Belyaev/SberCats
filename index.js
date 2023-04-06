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
addCatButton.addEventListener('click', () => {
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
					deleteCatFromLocalStorage(event.target.value)
					alert("Котик удален!")
					refreshCatsAndContentLocal();
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
				updateCatInLocalStorage(cat)
				alert("Котик обновлен!")
				refreshCatsAndContentLocal();
			})
	}
});
// EventListeners END

// localStorage functions BEGIN
const refreshCatsAndContentLocal = () => {
	const content = document.getElementsByClassName('content')[0];
	content.innerHTML = '';
	const cards = JSON.parse(localStorage.getItem('cats'))
	content.insertAdjacentHTML('afterbegin',
		cards.reduce((acc, el) => acc + generateCard(el), ''))
}

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

const deleteCatFromLocalStorage = (catId) => {
	localStorage.setItem(
		'cats',
		JSON.stringify(JSON.parse(localStorage.getItem('cats')).filter((el) => el.id != catId))
	)
}

const updateCatInLocalStorage = (cat) => {
	let localCats = JSON.parse(localStorage.getItem('cats'))
	localCats[cat.id - 1] = cat
	localStorage.setItem(
		'cats',
		JSON.stringify(localCats)
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

const openCatCardPopup = (cat) => {
	const content = document.getElementsByClassName('content')[0]
	content.insertAdjacentHTML('afterbegin', generateCatPopup(cat))

	let catPopup = document.querySelector('.popup-wrapper-cat-card');
	let closePopup = document.querySelector('.popup-close-cat-card');
	closePopup.addEventListener('click', () => {
		catPopup.remove()
	})
}

const cleanModalForm = () => {
	for (const modalFormElement of modalForm.elements) {
		modalFormElement.value = null
	}
}
// localStorage functions END

refreshCatsAndContentLocal();