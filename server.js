const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Student = require('./models/student');

const app = express();
const PORT = process.env.PORT || 3000;

 
mongoose.connect('mongodb://localhost:27017/crud_db', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Connected to MongoDB');
}).catch(err => {
    console.error('Error connecting to MongoDB:', err);
    process.exit(1);
});

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));

 
app.get('/', async (req, res) => {
    try {
        const students = await Student.find();
        res.render('index', { students });
    } catch (error) {
        console.error('Error fetching students:', error);
        res.status(500).send('Error fetching students');
    }
});

app.post('/students', async (req, res) => {
    try {
        const newStudent = new Student(req.body);
        await newStudent.save();
        res.redirect('/');
    } catch (error) {
        console.error('Error creating student:', error);
        res.status(500).send('Error creating student');
    }
});

app.put('/students/:id', async (req, res) => {
    try {
        const studentId = req.params.id;
        await Student.findByIdAndUpdate(studentId, req.body);
        res.sendStatus(200);
    } catch (error) {
        console.error('Error updating student:', error);
        res.status(500).send('Error updating student');
    }
});

app.delete('/students/:id', async (req, res) => {
    try {
        const studentId = req.params.id;
        await Student.findByIdAndDelete(studentId);
        res.sendStatus(200);
    } catch (error) {
        console.error('Error deleting student:', error);
        res.status(500).send('Error deleting student');
    }
});

 
app.listen(PORT, () => {
    console.log({PORT});
});