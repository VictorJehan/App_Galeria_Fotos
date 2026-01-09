const PIXABAY_API_KEY = '54125408-a34e82c59038b6ed1193b4564';
const PIXABAY_API_URL = 'https://pixabay.com/api/';

const galleryContainer = document.getElementById('galleryContainer');
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');

let currentQuery = 'nature';


async function fetchPhotos(query = 'nature', perPage = 24) {
    try {
        const response = await fetch(
            `${PIXABAY_API_URL}?key=${PIXABAY_API_KEY}&q=${encodeURIComponent(query)}&image_type=photo&per_page=${perPage}&safesearch=true`
        );

        if (!response.ok) {
            throw new Error('Erro ao buscar fotos');
        }

        const data = await response.json();
        return data.hits;
    } catch (error) {
        console.error('Erro:', error);
        showError('Erro ao carregar fotos. Tente novamente mais tarde.');
        return [];
    }
}


function renderGallery(photos) {
    if (photos.length === 0) {
        galleryContainer.innerHTML = `
            <div class="no-results">
                <p>Nenhuma foto encontrada</p>
            </div>
        `;
        return;
    }

    const galleryHTML = `
        <div class="gallery-grid">
            ${photos.map(photo => `
                <div class="photo-card" onclick="window.open('${photo.pageURL}', '_blank')">
                    <img src="${photo.webformatURL}" alt="${photo.tags}" loading="lazy">
                    <div class="photo-info">
                        <h3>${photo.tags.split(',')[0].trim()}</h3>
                        <div class="photo-meta">
                            <span>Por: ${photo.user}</span>
                            <div class="photo-stats">
                                <span class="stat-item">❤️ ${photo.likes}</span>
                                <span class="stat-item">👁️ ${photo.views}</span>
                            </div>
                        </div>
                    </div>
                </div>
            `).join('')}
        </div>
    `;

    galleryContainer.innerHTML = galleryHTML;
}


function showError(message) {
    galleryContainer.innerHTML = `
        <div class="error-message">
            <p>${message}</p>
        </div>
    `;
}


function showLoading() {
    galleryContainer.innerHTML = `
        <div class="loading">
            <div class="spinner"></div>
            Carregando fotos...
        </div>
    `;
}


async function searchPhotos(query) {
    if (!query.trim()) {
        query = 'nature';
    }

    currentQuery = query;
    showLoading();
    searchBtn.disabled = true;

    const photos = await fetchPhotos(query);
    renderGallery(photos);

    searchBtn.disabled = false;
}


searchBtn.addEventListener('click', () => {
    searchPhotos(searchInput.value);
});

searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        searchPhotos(searchInput.value);
    }
});


searchPhotos(currentQuery);