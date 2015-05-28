# Road Trip Advisor

Discover your adventure, along the journey.

__[roadtrip-advisor.herokuapp.com](https://roadtrip-advisor.herokuapp.com/)__

## Summary

Road Trip Advisor recommends the best places to eat, drink, sleep and play, along your road trip. You choose the types of stops you're most interested in. Looking for a great local restaurant or nightlife? We've got something for everybody.

## Features

- Interactive map from the Google Maps API
- Content from Yelp
- Works anywhere in the world

## Tech Stack

Angular, Node/Express

## Developer Environment

1. Include Yelp API keys (get from Yelp directly):
   ```sh
   # Create a new file server/api/local_key.js, formatted as:
   module.exports = {
     consumer_key: 'YOUR-KEY',
     consumer_secret: 'YOUR-KEY',
     token: 'YOUR-KEY',
     token_secret:  'YOUR-KEY',
     ssl: true
   };
   ```

1. Run the following in the project directory:

    ```sh
    # install dependencies
    npm install
    bower install

    # start server
    node server.js
    ```

1. Open http://localhost:3456 in your browser.

## Screenshots

Homepage:
![Image of Homepage]
(http://gdurl.com/t8CU)


Set your destination:
![Image of Map]
(http://gdurl.com/IHl2)


Get information about your trip:
![Image of Results]
(http://gdurl.com/FAzQ)



## Team

- Travis Neufeld - [github.com/TravisJN](https://github.com/TravisJN)
- Seven Li - [github.com/7seven7lst](https://github.com/7seven7lst)
- David Tan - [github.com/davidtansf](https://github.com/davidtansf)
- Paul Brady - [github.com/pablobrady](https://github.com/pablobrady)
