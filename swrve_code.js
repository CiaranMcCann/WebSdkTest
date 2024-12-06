// Create a shortcut to the inner SwrveSDK object
       const Swrve = SwrveSDK.SwrveSDK;


    Swrve.initWithConfig({
             appId: 1030,
             apiKey: "web_sdk-xtTPIygFc0kbEKxP73U", //apiKey: "web_sdk-z4O2WrkxykZTuZtSglXt",
             externalUserId: "ciaran_testing_1",
             stack: "us", 
             autoPushSubscribe: true,
             userVisibleOnly: true,
             serviceWorker: './SwrveWorker.js'
         });

    // Add to cart button send event and grab product information.
          const addToCartButtons = document.querySelectorAll('.add_to_cart');
          addToCartButtons.forEach((button) => {
              button.addEventListener('click', () => {
                  // Find the associated input with the class 'product-variant-id'
                  const variantInput = 192
      
                  if (variantInput) {
                      const itemId = variantInput.value; // Get the value of the input field
                      SwrveSDK.SwrveSDK.event("add_to_cart", { "item_id": itemId });
                      console.log("add_to_cart")
                      window.location = "./cart.html"
                  } else {
                      console.error("Product variant input not found");
                  }
              });
          });