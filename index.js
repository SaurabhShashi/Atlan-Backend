const express = require('express');
const cors = require('cors');
const fs = require('fs');
const app = express();
const bodyParser = require('body-parser');

app.use(cors());
app.use(bodyParser.json());

// Read model data from model_data.json
const modelData = JSON.parse(fs.readFileSync('model_data.json', 'utf8'));

// Define API routes
app.get('/api/models', (req, res) => {
    // send id, name, description, creator, featured, category, and reasonForFeatured
    const models = modelData.map(m => ({
        id: m.id,
        name: m.name,
        description: m.description,
        creator: m.creator,
        featured: m.featured,
        category: m.category,
        reasonForFeatured: m.reasonForFeatured
    }));
    res.json(models);
});

app.get('/api/models/:id', (req, res) => {
    const id = req.params.id;
    console.log(id);
    const model = modelData.find(m => m.id === id);
    if (model) {
        res.json(model);
    } else {
        res.status(404).json({ error: 'Model not found' });
    }
});

// featured models
app.get('/api/models-featured', (req, res) => {
    const featured = modelData.filter(m => m.featured);
    res.json(featured);
});

// create a model
app.post('/api/create-model', (req, res) => {
    const model = req.body;
    // generate a random id for the model
    model.id = Math.random().toString(36).substr(2, 9);

    // write the model to the model_data.json file
    modelData.push(model);
    fs.writeFileSync('model_data.json', JSON.stringify(modelData, null, 2));
    res.json({
        message: 'Model created successfully',
        success: true
    });


});


// Start the server
const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});