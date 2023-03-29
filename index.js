const express = require('express');
const uploadRouter = require('./router');

const app = express();
app.get('/', (__, res) => {
	res.sendFile(`${__dirname}/index.html`);
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(uploadRouter);


app.listen(4000, () => {
	console.log("app port no is 4000");
});
