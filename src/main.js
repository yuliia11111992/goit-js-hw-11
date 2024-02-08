import iziToast from 'izitoast';

import 'izitoast/dist/css/iziToast.min.css';

import SimpleLightbox from 'simplelightbox';

import 'simplelightbox/dist/simple-lightbox.min.css';

const fetchPicturesForm = document.querySelector('.form');
const gallery = document.querySelector('.gallery');
const userInput = document.querySelector('input');
const container = document.querySelector('.container');

// ідентифікатор загрузки
const showLoader = () => {
  const loader = document.createElement('span');
  loader.classList.add('loader');
  container.append(loader);
};

const hideLoader = () => {
  const loader = document.querySelector('.loader');
  if (loader) {
    loader.remove();
  }
};

fetchPicturesForm.addEventListener('submit', event => {
  showLoader();
  event.preventDefault();
  gallery.innerHTML = '';
  const apiKey = '42261083-50fe706ca9c2c1734499a9937';
  const query = userInput.value;

  fetch(
    `https://pixabay.com/api/?key=${apiKey}&q=${encodeURIComponent(
      query
    )}&image_type=photo&orientation=horizontal&safesearch=true`
  )
    .then(response => {
      if (!response.ok) {
        throw new Error(response.status);
      }
      return response.json(); // перетворення в JSON
    })
    .then(data => {
      if (data.hits.length === 0)//перевіряється довжина масиву  
      {
        iziToast.error({
          title: '',
          backgroundColor: '#EF4040',
          message:
            'Sorry, there are no images matching your search query. Please try again!',
        });//якщо не знайдено жодного зображення, виводиться помилкове повідомлення за допомогою iziToast.error()
      } else {
        let markup = ''; 

for (let i = 0; i < data.hits.length; i++) {
  const imageData = data.hits[i]; // отримати дані про окреме зображення
  markup += `<li class="gallery-item">
    <a href="${imageData.webformatURL}">
      <img class="gallery-image" src="${imageData.webformatURL}" alt="${imageData.tags}">
    </a>
    <p><b>Likes: </b>${imageData.likes}</p>
    <p><b>Views: </b>${imageData.views}</p>
    <p><b>Comments: </b>${imageData.comments}</p>
    <p><b>Downloads: </b>${imageData.downloads}</p>
  </li>`;
}

// вставити усі рядки розмітки у контейнер галереї
gallery.insertAdjacentHTML('afterbegin', markup);
        const lightbox = new SimpleLightbox('.gallery a', options);
        lightbox.on('show.simplelightbox');
        lightbox.refresh();
        fetchPicturesForm.reset();//форма вводу очищається 
      }
    })
    .catch(error => {
      console.log(error);
    })
    .finally(() => {
      hideLoader();
    });
});

const options = {
  captions: true,
  captionSelector: 'img',
  captionType: 'attr',
  captionsData: 'alt',
  captionPosition: 'bottom',
  animation: 250,
};
