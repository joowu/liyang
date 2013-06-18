##Prerequisite
- Install [Node.js](http://nodejs.org/)
- Install Grunt and Bower
    ```
    sudo npm install -g grunt-cli bower
    ```
- Install compass
    ```
    sudo gem update --system && sudo gem install compass
    ```

## Get Started
- Initial dependencies
    ```
    npm install && bower install
    ```
- Start server
    ```
    grunt server
    ```

## Grunt command
- grunt - build an optimized, production-ready version of your app
- grunt server - preview an app you have generated (with Livereload)
- grunt test  - run the unit tests for an app
- grunt test:e2e  - run the end to end tests for an app
