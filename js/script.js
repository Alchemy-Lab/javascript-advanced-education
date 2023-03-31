const searchBar = document.querySelector('.searchbar'),
	buttonFind = document.querySelector('.button-find'),
	buttonLucky = document.querySelector('.button-lucky'),
	bookList = document.querySelector('.book-list'),
	cancelBtn = document.querySelector('.cancel-btn'),
	errorBox = document.querySelector('.error-box')

const modal = document.querySelector('.modal'),
	overlay = document.querySelector('.overlay'),
	closeModalBtn = document.querySelector('.btn-close')

let baseUrl = 'https://openlibrary.org'
let itemsFound = false
let luckyBooks = []

searchBar.focus()

buttonFind.addEventListener('click', getBooksForCategory)
buttonLucky.addEventListener('click', getLuckyBook)

searchBar.addEventListener('keydown', (e) => {
	cancelBtn.classList.remove('hide')
	if (e.key === 'Enter') {
		getBooksForCategory()
	}
})

cancelBtn.addEventListener('click', () => {
	searchBar.value = ''
	cancelBtn.classList.add('hide')
})

function createDomElement(el, cl, content) {
	const tag = document.createElement(el)
	tag.classList.add(cl)
	const text = document.createTextNode(content)
	tag.appendChild(text)
	return tag
}

async function getBooksForCategory() {
	if (searchBar.value.length === 0) return
	itemsFound = false
	try {
		const fullURL =
			baseUrl +
			'/subjects/' +
			searchBar.value.toLowerCase().replaceAll(' ', '_') +
			'.json'
		const res = await fetch(fullURL)
		const data = await res.json()
		const books = parseData(data['works'])
	} catch (error) {
		errorBox.innerHTML = `<p>Sorry, an error occurred while fetching: ${error.message}</p>`
		bookList.innerHTML = ''
	}
}

async function getBookDetails(book) {
	try {
		const res = await fetch(baseUrl + book + '.json')
		const data = await res.json()
		if (data['covers'] !== undefined) {
			let image = document.querySelector('.modal-book-cover')
			let downloadingImage = new Image()
			downloadingImage.onload = function () {
				image.src = this.src
			}
			downloadingImage.src =
				'https://covers.openlibrary.org/b/id/' + data['covers'][0] + '.jpg'
		}

		document.querySelector('.modal-book-title').innerHTML = data['title']
		if (data['description'] !== undefined) {
			if (
				typeof data['description'] === 'object' &&
				data['description'] !== null
			) {
				document.querySelector('.modal-book-desc').innerHTML =
					data['description']['value']
			} else {
				document.querySelector('.modal-book-desc').innerHTML =
					data['description']
			}
		}

		openModal()
	} catch (error) {
		errorBox.innerHTML = `<p>Sorry, an error occurred while fetching: ${error.message}</p>`
		bookList.innerHTML = ''
	}
}

async function getLuckyBook() {
	luckyBooks = []
	if (searchBar.value.length === 0) return
	await getBooksForCategory()
	if (itemsFound) {
		const luckyOne = luckyBooks[Math.floor(Math.random() * luckyBooks.length)]
		getBookDetails(luckyOne)
	}
}

function parseData(data) {
	errorBox.innerHTML = ''
	if (Array.isArray(data)) {
		if (data.length > 0) {
			itemsFound = true
			bookList.innerHTML = ''
			let div, title, cl, content
			data.forEach((book) => {
				luckyBooks.push(book.key)
				let authors = ''
				book.authors.forEach((author) => {
					authors += `${author.name}, `
				})
				authors = authors.substring(0, authors.length - 2)

				div = createDomElement('div', 'book-block', '')
				title = createDomElement('h3', 'book-title', book.title)
				title.setAttribute('key', book.key)
				title.addEventListener('click', () => {
					getBookDetails(book.key)
				})
				div.appendChild(title)
				div.appendChild(createDomElement('p', 'book-auth', authors))
				// div.appendChild(createDomElement('p', 'book-desc', ''))
				bookList.appendChild(div)
			})
		} else {
			errorBox.innerHTML = `<p>Sorry, I can’t find any book for this category</p>`
			bookList.innerHTML = ''
		}
	}
}

// MODAL ----------------------------------------------------------------
closeModalBtn.addEventListener('click', closeModal)
overlay.addEventListener('click', closeModal)
document.addEventListener('keydown', (e) => {
	if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
		modalClose()
	}
})

function openModal() {
	modal.classList.remove('hidden')
	overlay.classList.remove('hidden')
}

function closeModal() {
	modal.classList.add('hidden')
	overlay.classList.add('hidden')
	resetModal()
}

function resetModal() {
	document.querySelector('.modal-book-cover').src = './images/Book.gif'
	document.querySelector('.modal-book-title').innerHTML = ''
	document.querySelector('.modal-book-desc').innerHTML = ''
}
// END MODAL ----------------------------------------------------------------
