import './css/styles.css';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import Notiflix, { Notify } from 'notiflix';
import dataFromPixabay from './js/pixabay.js';


const searchQuery = document.querySelector('input[name="searchQuery"]');
const searchForm = document.querySelector('.search-form');
export const btnLoadMore = document.querySelector('.load-more');
const numberOfPage = document.querySelector('input[name="page"]');

searchForm.addEventListener('submit', showResults);
searchForm.dispatchEvent(new Event('submit'));
btnLoadMore.addEventListener('click', showMore);

let createSimpleLightBox = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionDelay: '250',
});
createSimpleLightBox.on('show.simplelightbox', function () {});

async function showResults(e) {
  e.preventDefault();
  e.target.page.value = '1';
  const q = searchQuery.value;
  await loadPhotos({ q, page: '1' });
}

async function loadPhotos({ q, page }) {
  const photos = await dataFromPixabay({ q, page });
  drawResults({ photos, page });
  createSimpleLightBox.refresh();
}

function drawResults({ photos, page }) {
  const gallery = document.querySelector('.gallery');
  if (page === '1') {
    gallery.innerHTML = '';
  }
  gallery.innerHTML = getPhotos(photos);
}

const getPhotos = photo => {
  return photo
    .map(
      ({
         largeImageURL,
         webformatURL,
         tags,
         likes,
         views,
         comments,
         downloads,
       }) => {
        return `<a class="photo-card" href="${largeImageURL}"><img src="${webformatURL}" alt="${tags}" loading="lazy" class="image"/>
    <div class="info">
      <p class="info-item">
        <b>Likes ${likes}</b>
      </p>
      <p class="info-item">
        <b>Views ${views}</b>
      </p>
      <p class="info-item">
        <b>Comments ${comments}</b>
      </p>
      <p class="info-item">
        <b>Downloads ${downloads}</b>
      </p>
    </div>
  </a>`;
      }
    )
    .join(' ');
};
async function showMore() {
  const page = parseInt(numberOfPage.value);
  numberOfPage.value = page + 1;
  await loadPhotos({ q: searchQuery.value, page: numberOfPage.value });
}