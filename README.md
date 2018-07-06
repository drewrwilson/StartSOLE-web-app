# StartSOLE2

This is new version of the StartSOLE webapp. Work in progress!

# Tech stack

This uses the following tools:
 * Node
 * Express 4
 * Handlebars for templating
 * Some other misc frontend scripts like jquery, materializecss, dropzone, etc

# Tips

Install Supervisor so you don't have to relaunch the server every time you make a change.

`npm install supervisor -g`

Then you can run the app from the terminal:

`supervisor server.js`

Then open your browser and point it to `http:\\localhost:8080` to see the page

# Things we want to do in the future

 * Use SASS to keep styles well structured and clean
 * Use React and replace the node express backend entirely
