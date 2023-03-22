const inputCategory = document.querySelector('.input-category'),
	buttonFind = document.querySelector('.button-find')

let baseUrl = 'https://openlibrary.org/subjects/'

buttonFind.addEventListener('click', getBooksForCategory)

function getBooksForCategory(e) {
	e.preventDefault()
	fetch(baseUrl + inputCategory.value + '.json')
		.then((res) => res.json())
		.then((data) => parseData(data['works']))
		.catch((err) => console.error(err))
}

function parseData(data) {
	data.forEach((book) => {
		console.log(book.title)
	})
}
