import { formTemplate } from './template';
import './yandex.html';

const reviews = [

]

document.addEventListener('DOMContentLoaded', () => {
    ymaps.ready(init);

    function init() {
        const myMap = new ymaps.Map('map', {
            center: [59.94158, 30.276959],
            zoom: 10,
        });

        myMap.events.add('click', function(e) {
            const coords = e.get('coords');
            openBalloon(myMap, coords);
        });
    }
});

function getOptionsCluster(coords) {
    const clusterObjects = [];

    for (const review of reviews) {
        // что это за условие? для чего тут json?
        if (JSON.stringify(review.coords) === JSON.stringify(coords)) {
            const geoObj = new ymaps.GeoObject({
                geometry: { type: 'Point', coordinates: coords }
            })
            clusterObjects.push(geoObj)
        }
    }
    return clusterObjects
}

function addCluster(map, coords) {
    const clusterer = new ymaps.Clusterer({ clusterDisableClickZoom: true })
    clusterer.options.set('hasBalloon', false)

    function addToCluster() {
        const myGeoObjects = getOptionsCluster(coords)
        clusterer.add(myGeoObjects)
        map.geoObjects.add(clusterer)
        map.balloon.close()
    }

    clusterer.events.add('click', function(e) {
        e.preventDefault()
        openBalloon(map, coords, clusterer, addToCluster)
    })
    addToCluster()
}

function getReviewList(coords) {
    let reviewListHTML = ''
    for (const review of reviews) {
        if (JSON.stringify(review.coords) === JSON.stringify(coords)) {
            reviewListHTML += `
<div class="review">
    <div><strong>Место:</strong>${review.place}</div>
    <div><strong>Имя:</strong>${review.author}</div>
    <div><strong>Отзыв:</strong>${review.reviewText}</div>
</div>
        `
        }

    }
    return reviewListHTML
}

// почему вынесена функция здесь?
async function openBalloon(map, coords, clusterer, fn) {
    await map.balloon.open(coords, {
        content: `<div class="reviews">${getReviewList(coords)} </div>${formTemplate}`,
    });

    document.querySelector('#add-form').addEventListener('submit', function(e) {
        e.preventDefault();
        if (clusterer) {
            clusterer.removeAll()
        }
        reviews.push({
                coords: coords,
                // что тут идет дальще?
                author: this.elements.author.value,
                place: this.elements.place.value,
                reviewText: this.elements.rewiew.value,
            })
            // что за строка идет дальше ! ? :
            !fn ? addCluster(map, coords) : fn()
        addCluster(map, coords)
        map.balloon.close()
    })
}