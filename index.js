const modalFormDiv = document.getElementsByClassName('create-edit-modal-form')[0];
const modalForm = document.forms[0];
const content = document.getElementsByClassName('content')[0];

const addCatButton = document.getElementById('add-cat');
const closeModalFormButton = document.getElementById('close-form');

addCatButton.addEventListener('click', (event) => {
	modalFormDiv.classList.add('active')
	console.log(event.target.value)
});
closeModalFormButton.addEventListener('click', () => {modalFormDiv.classList.remove('active')});

content.addEventListener('click', (event) => {
	if (event.target.tagName === 'BUTTON') {
		switch (event.target.className) {
			case 'cat-card-view':
				break;
			case 'cat-card-update':
				console.log(event.target.value)
				modalFormDiv.classList.add('active')
				let newCat =
				api.updateCat(newCat)
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
	// api.addCat() с использованием getNewIdOfCat
	// api.updateCat() с использованием getNewIdOfCat
});


const refreshCatsAndContent = () => {
	const content = document.getElementsByClassName('content')[0];
	content.innerHTML = '';

	api.getAllCats().then((res) => {
		const cards = res.reduce((acc, el) => (acc += generateCard(el)), '');
		content.insertAdjacentHTML('afterbegin', cards); //загуглите insertAdjacentHTML afterbegin
	});
};

refreshCatsAndContent();

// const getNewIdOfCat = () => {
// 	return api.getIdsOfCat().then((res) => {
// 		return Math.max(...res) + 1;
// 	});
// };
//
// getNewIdOfCat().then((res) => {
// 	console.log(res);
// });

// console.log(getNewIdOfCat())
