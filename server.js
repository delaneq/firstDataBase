const express = require('express');
const mongoose = require('mongoose')

const app = express();
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded());


mongoose.connect('mongodb://127.0.0.1:27017/todo').then(() => {
    console.log('Connected To MongoDB')
}).catch((e) => {
    console.log('Failed to connect MongoDB')
});

const ToDoSchema = new mongoose.Schema({
    title: String,
    description: String
});

const ToDo = mongoose.model('todo', ToDoSchema)




app.get('/', async(req, res) => {
    const tasks = await ToDo.find();

    res.render('index', {'tasks': tasks})
}); 


app.get('/new', (req, res) => {
    res.render('new')
});
app.post('/new', async(req, res) => {
    // console.log(req.body);
    if (req.body.title.length != 0) {
        await new ToDo({
            title: req.body.title,
            description: req.body.description
        }).save();
        res.redirect('/')

    } else {
        res.redirect('/new?error=1')
    }
})


app.get('/edit', (req, res) => {
    res.render('edit')
}); 
app.get('/edit/:id', async(req, res) => {
    const tasksID = req.params.id;
    const task = await ToDo.findById(tasksID);
    res.render('edit', {'task': task});
});
app.post('/edit', async(req, res) => {
    if (req.body.title.length != 0) {
        await ToDo.updateOne(
            {
                _id: req.body.id
            },
            {
                title: req.body.title,
                description: req.body.description
            }
        )
        res.redirect('/')

    } else {
        res.redirect('/edit?error=1')
    }
})

app.delete('/delete/:id', async(req, res) => {
    await ToDo.deleteOne({_id: req.params.id});
    res.status(200).send('Task was deleted')
})


const PORT = 7000;
app.listen(PORT, () => {
    console.log(`Server listening on PORT ${PORT}`)
})