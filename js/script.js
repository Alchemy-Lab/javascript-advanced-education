const searchBar = document.querySelector('.searchbar'),
	buttonFind = document.querySelector('.button-find'),
	buttonLucky = document.querySelector('.button-lucky'),
	bookList = document.querySelector('.book-list'),
	cancelBtn = document.querySelector('.cancel-btn')

let baseUrl = 'https://openlibrary.org/subjects/'

buttonFind.addEventListener('click', getBooksForCategory)
buttonLucky.addEventListener('click', getLuckyBook)

searchBar.addEventListener('keydown', (e) => {
	cancelBtn.classList.remove('hide')
	if (e.key === 'Enter') {
		// cancelBtn.classList.add('hide')
		getBooksForCategory()
	}
})

cancelBtn.addEventListener('click', () => {
	searchBar.value = ''
	cancelBtn.classList.add('hide')
})

async function getBooksForCategory() {
	try {
		const res = await fetch(baseUrl + searchBar.value.toLowerCase() + '.json')
		const data = await res.json()
		const books = parseData(data['works'])
	} catch (error) {
		bookList.innerHTML = `<p class="error"></p>Sorry, an error occurred while fetching: ${error.message}</p>`
		// console.error(error)
	}
}

function getLuckyBook() {}

function parseData(data) {
	if (Array.isArray(data)) {
		if (data.length > 0) {
			// let bookList_html = ''
			bookList.innerHTML = ''
			let div, cl, content
			data.forEach((book) => {
				let authors = ''
				book.authors.forEach((author) => {
					authors += `${author.name}, `
				})
				authors = authors.substring(0, authors.length - 2)

				div = createDomElement('div', 'book-block', '')
				div.appendChild(createDomElement('h3', 'book-title', book.title))
				div.appendChild(createDomElement('p', 'book-auth', authors))
				div.appendChild(createDomElement('p', 'book-desc', ''))
				bookList.appendChild(div)

				// 	bookList_html += `
				// 	<div class="book-block">
				// 	<h3 class="book-title">${book.title}</h3>
				// 	<p class="book-auth">${authors}</p>
				// </div>
				// 	`
			})
			// bookList.innerHTML = bookList_html
		} else {
			console.log('No book for this category')
		}
	}
}

function createDomElement(el, cl, content) {
	const tag = document.createElement(el)
	tag.classList.add(cl)
	const text = document.createTextNode(content)
	tag.appendChild(text)
	return tag
	//   var element = document.getElementById("new");
	//   element.appendChild(tag);
}
