function runScriptForever() {
    // Function to check if an element is present and interactable
    function isElementPresentAndInteractable(selector) {
      const element = document.evaluate(
        selector,
        document,
        null,
        XPathResult.FIRST_ORDERED_NODE_TYPE,
        null
      ).singleNodeValue;
  
      return element && element.offsetParent !== null;
    }
  
    // Function to click on an element if it's present and interactable
    function clickIfPresentAndInteractable(selector) {
      const element = document.evaluate(
        selector,
        document,
        null,
        XPathResult.FIRST_ORDERED_NODE_TYPE,
        null
      ).singleNodeValue;
  
      if (element && element.offsetParent !== null) {
        element.click();
      }
    }
  
    // Try clicking on the first element
    const firstElementSelector =
      '/html/body/main/div[1]/div[2]/div/div/div/div/div[1]/div/div/div/div/div/button';
    clickIfPresentAndInteractable(firstElementSelector);
  
    // If the first element is not present or interactable, try the second one
    const secondElementSelector =
      '/html/body/main/div[1]/div[2]/div/div/div/div/div[1]/div/div/div/div/div/div[2]/div/div/div[1]/button[1]';
    if (!isElementPresentAndInteractable(firstElementSelector)) {
      clickIfPresentAndInteractable(secondElementSelector);
    }
  
    // If neither of the first two elements is present or interactable, try the third one
    const thirdElementSelector =
      '/html/body/main/div[1]/div[2]/div/div/div/div/div[1]/div/div/div/div/div[2]/div[2]/button[2]';
    if (!isElementPresentAndInteractable(firstElementSelector) && !isElementPresentAndInteractable(secondElementSelector)) {
      clickIfPresentAndInteractable(thirdElementSelector);
    }
  
    // Click on all additional elements concurrently
    const additionalElements = [
      '/html/body/main/div[1]/div[2]/div/div/div/div/div[1]/div/div/div/div/div[1]/div/form/div/ul/ul/li[1]/div',
      '/html/body/main/div[1]/div[2]/div/div/div/div/div[1]/div/div/div/div/div[1]/div/form/div/ul/ul/li[2]/div',
      '/html/body/main/div[1]/div[2]/div/div/div/div/div[1]/div/div/div/div/div[1]/div/form/div/ul/ul/li[6]/div',
      '/html/body/main/div[1]/div[2]/div/div/div/div/div[1]/div/div/div/div/div[1]/div/form/div/ul/li[11]/div'
    ];
  
    Promise.all(additionalElements.map((selector) => clickIfPresentAndInteractable(selector)))
      .then(() => {
        // Click on the final element after clicking on all additional elements
        const finalElementSelector =
          '/html/body/main/div[1]/div[2]/div/div/div/div/div[1]/div/div/div/div/div[1]/div/form/div[2]/button';
        clickIfPresentAndInteractable(finalElementSelector);
      });
  }
  
  // Run the script forever with a specified interval (e.g., 5 seconds)
  setInterval(runScriptForever, 5000); 
  