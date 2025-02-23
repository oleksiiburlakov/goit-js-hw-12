import { renderImages } from './render-function.js';
import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";
import axios from 'axios';

const loader = document.querySelector('.loader');
const list = document.querySelector('.list');
const btnMore = document.querySelector('.btn-more');

let page = 1;
let limit = 15;
btnMore.style.display = 'none';
if (loader) loader.style.display = 'none';

const key = '48878518-9063069941d99e969b9b19843';
const baseUrl = 'https://pixabay.com/api/';

export async function findMyFetch(query, page = 1, limit = 20, append = false) {

    if (loader) loader.style.display = '';

    const url = `${baseUrl}?key=${key}&q=${encodeURIComponent(query)}&image_type=photo&orientation=horizontal&safesearch=true&per_page=${limit}&page=${page}`;

    try {
        const response = await axios.get(url);
        const data = response.data;

        if (loader) loader.style.display = 'none';

        if (!data.hits || data.hits.length === 0) {
            btnMore.style.display = 'none';
            iziToast.error({
                message: "Sorry, there are no images matching your search query. Please try again!",
                timeout: 5000,
                position: 'topRight',
            });
            return
        } else {
            const markup = renderImages(data.hits);
            if (append) {
                list.insertAdjacentHTML('beforeend', markup);
            } else {
                list.innerHTML = markup;
            }

            btnMore.style.display = '';
        }

        return data;
    } catch(error) {
        btnMore.style.display = 'none';
        iziToast.error({
            message: error.message,
            timeout: 5000,
            position: 'topRight',
        });
        if (loader) loader.style.display = 'none';
    }
}