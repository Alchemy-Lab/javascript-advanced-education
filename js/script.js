const searchBar = document.querySelector('.searchbar'),
	buttonFind = document.querySelector('.button-find'),
	buttonLucky = document.querySelector('.button-lucky')

let baseUrl = 'https://openlibrary.org/subjects/'

buttonFind.addEventListener('click', getBooksForCategory)
buttonLucky.addEventListener('click', getLuckyBook)

searchBar.addEventListener('keydown', (e) => {
	if (e.key === 'Enter') {
		getBooksForCategory()
	}
})

// function getBooksForCategory() {
// 	fetch(baseUrl + searchBar.value + '.json')
// 		.then((res) => res.json())
// 		.then((data) => parseData(data['works']))
// 		.catch((err) => console.error(err))
// }

async function getBooksForCategory() {
	try {
		const res = await fetch(baseUrl + searchBar.value + '.json')
		const data = await res.json()
		const books = parseData(data['works'])
	} catch (error) {
		console.error(error)
	}
}

function getLuckyBook() {}

function parseData(data) {
	if (Array.isArray(data)) {
		if (data.length > 0) {
			data.forEach((book) => {
				console.log(book.title)
			})
		} else {
			console.log('No book for this category')
		}
	}
}
