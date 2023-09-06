      // Define a function to click an element using its XPath
      function clickElementByXPath(xpath) {
        const element = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
        if (element) {
          element.click();
          return true;
        } else {
          return false;
        }
      }
      
      // Define a list of XPath elements to click on
      const xpaths = ${JSON.stringify(xpaths)}; // Load XPaths from JSON

      // Keep track of the current user index
      let currentUserIndex = 0;
      
      // Define a function to perform the snap sending process for all users
      function sendSnapsToAllUsers() {
        if (currentUserIndex < xpaths.length) {
          const elementClicked = clickElementByXPath(xpaths[currentUserIndex]);
          if (elementClicked) {
            setTimeout(() => {
              // Capture or send the snap here (You can add your logic)
              console.log('Sending snap to user');
              
              // You may need to add code to navigate back to the list of users
              // and increment the user index to proceed to the next user.
              
              currentUserIndex++;
              sendSnapsToAllUsers(); // Continue to the next user
            }, 2000); // Adjust the delay as needed between sending snaps to users
          } else {
            console.log('Element with XPath not found.');
            currentUserIndex++;
            sendSnapsToAllUsers(); // Continue to the next user
          }
        } else {
          console.log('All snaps sent.');
          currentUserIndex = 0; // Reset the index to start over
          setTimeout(sendSnapsToAllUsers, 500); // Start again after a delay
        }
      }
      
      // Start the process by sending snaps to all users
      setTimeout(sendSnapsToAllUsers, 500); // Start again after a delay
      