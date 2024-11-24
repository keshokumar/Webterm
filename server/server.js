const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());

mongoose.connect("mongodb://localhost:27017/cricketer", {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const cricSchema = new mongoose.Schema({
    name: String,
    age: Number,
    batsman: String,
    centuries: Number
});

const Cricket = mongoose.model("Cricket", cricSchema);

app.get('/crics', async (req, res) => {
    const crics = await Cricket.find();
    res.json(crics);
});

app.post('/crics', async (req, res) => {
    const cric = new Cricket(req.body);
    await cric.save();
    res.json(cric);
});

app.put('/crics/:id', async (req, res) => {
    const cric = await Cricket.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(cric);
});


app.delete('/crics/:id', async (req, res) => {
    await Cricket.findByIdAndDelete(req.params.id);
    res.status(200).send('Deleted');
});

const port = 5000;
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
