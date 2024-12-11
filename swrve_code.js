// Create a shortcut to the inner SwrveSDK object
const Swrve = SwrveSDK.SwrveSDK;


Swrve.initWithConfig({
    appId: 1030,
    apiKey: "web_sdk-xtTPIygFc0kbEKxP73U", //apiKey: "web_sdk-z4O2WrkxykZTuZtSglXt",
    stack: "us",
    autoPushSubscribe: true,
    userVisibleOnly: true,
    serviceWorker: './SwrveWorker.js'
});

const addToCartButtons = document.querySelectorAll('.add_to_cart');
addToCartButtons.forEach((button) => {
    button.addEventListener('click', () => {
        const variantInput = 192

        if (variantInput) {
            const itemId = variantInput.value; 
            SwrveSDK.SwrveSDK.event("add_to_cart", {
                "item_id": itemId
            });
            console.log("add_to_cart")
        } else {
            console.error("Product variant input not found");
        }
    });
});


const currentParams = window.location.search;
const links = document.querySelectorAll('a');

links.forEach(link => {
    const href = link.getAttribute('href');
    if (href && !href.startsWith('#') && currentParams) {
        const separator = href.includes('?') ? '&' : '?';
        link.setAttribute('href', `${href}${separator}${currentParams.substring(1)}`);
    }
});