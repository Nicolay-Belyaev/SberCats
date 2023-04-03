// не очень понимаю, как следует структурировать код, но пусть будет как-то так.

// Global BEGIN

let localStorage = window.localStorage

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
	modalFormDiv.classList.add('active')
	console.log(event.target.value)
});
closeModalFormButton.addEventListener('click', () => {modalFormDiv.classList.remove('active')});

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
	console.log(event.target)
	const formData = new FormData(modalForm)
	let cat = {
		//TODO: перепилить на Object
		id: formData.get('id'),
		name: formData.get('name'),
		image: formData.get('image'),
		age: formData.get('age'),
		rate: formData.get('rate'),
		description: formData.get('description')
	}
	api.addCat(cat).then(() => {
		alert("Котик добавлен! Ура!")
		refreshCatsAndContent();
	})
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

	const cards = JSON.parse(localStorage.getItem('cats')).reduce(
		(acc, el) => (acc += generateCard(el))
	)
	content.insertAdjacentHTML('afterbegin', cards)
}

const addCatInLocalStorage = (cat) => {
	localStorage.setItem(
		'cats',
		JSON.stringify([...JSON.parse(localStorage.getItem('cats')), cat])
	)
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

// localStorage functions END

refreshCatsAndContent();