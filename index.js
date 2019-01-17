const Server = require('./server/Server');

const app = new Server();

app.init();
app.start();