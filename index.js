const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;

// Middle ware
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('programming sage running')
});

app.listen(post, () => {
    console.log(`programming sage running on ${port}`);
});