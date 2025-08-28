const EXTENSION_NAME = 'youtube-cuteify';
const TOTAL_THUMBS = 10;

function getThumbs(element) {
    const imageSelectors = [
        "ytd-thumbnail a > yt-image > img.yt-core-image",
        'img.style-scope.yt-img-shadow[width="86"]',
        '.yt-thumbnail-view-model__image img',
        'img.ytCoreImageHost',
        ".ytp-videowall-still-image",
        'div.ytp-cued-thumbnail-overlay-image'
    ];

    const allImages = [];
    for (const selector of imageSelectors) {
        allImages.push(...Array.from(element.querySelectorAll(selector)));
    }

    return allImages.filter(image => {
        const parent = image.parentElement;

        const processed = Array.from(parent.children).filter(child => {
            return child.id &&
                child.id.includes(EXTENSION_NAME);
        });

        return (
            processed.length <= 0
        );
    });
}

function replaceThumbs(element) {
    let thumbs = getThumbs(element);
    thumbs.forEach((thumbnailElement) => {
        let random_thumb_id = Math.trunc(Math.random() * TOTAL_THUMBS);
        const overlayImageURL = browser.runtime.getURL(`thumbs/thumb_${random_thumb_id}.png`);
        if (thumbnailElement.src) {
            thumbnailElement.src = overlayImageURL;
            thumbnailElement.id = EXTENSION_NAME;
        }
    });
}

replaceThumbs(document.body);

setInterval(() => {
    // I found this to be a better solution than using a mutation observer (somehow)
    replaceThumbs(document.body);
}, 500);
