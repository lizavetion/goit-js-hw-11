import { API_URL, DEFAULT_PIXABAY_PARAMS } from './config.js';
import { btnLoadMore } from '../index.js';
import axios from 'axios';
import Notiflix, { Notify } from 'notiflix';
import { btnLoadMore } from '../index.js';
export default async function dataFromPixabay({ q = '', page = '1' }) {
  try {
    const query = {
      ...DEFAULT_PIXABAY_PARAMS,
      page,
      q,
    };

    const response = await axios.get(API_URL, { params: query });
    const { hits: photos, total } = response.data;

    if (photos.length === 0 && page === '1') {
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      btnLoadMore.style.display = 'none';
      return;
    }
    if (page > Math.ceil(total / DEFAULT_PIXABAY_PARAMS.per_page)) {
      btnLoadMore.style.display = 'none';
      Notiflix.Notify.warning(
        "We're sorry, but you've reached the end of search results."
      );
      return;
    }
    if (page === '1' && q !== '') {
      btnLoadMore.style.display = 'flex';
      Notiflix.Notify.success(`Hooray! We found ${total} images.`);
    }
    return photos;
  } catch (e) {
    Notiflix.Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
  }
}