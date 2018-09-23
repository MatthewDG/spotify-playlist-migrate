const App = require('./server');

const app = new App();

app.listen(process.env.PORT || 8888);
