const express = require('express');
const morgan = require('morgan');
const colors = require('colors')

const app = express();
const PORT = 3000;

const db = require('./db'); // Import the database connection


// middlewares
app.use(express.json()); // Parse JSON request bodies
app.use(express.urlencoded({ extended: true })); // parse form data into req body
app.use(morgan('dev')); // Log requests to the console

//  configuration
app.set('view engine', 'ejs'); // Set EJS as the view engine
app.set('views', __dirname + '/views'); // Set the views directory
app.use(express.static('public')); // Serve static files from the 'public' directory





// main page route
app.get('/', (req, res) => {
    res.render('index', { message: "Hello from the other side!" });
});



// you will have to change a lot of this code to fit your project needs
// but don't feel afraid, almost everything that you need is here, you will just have to adapt it to your project


app.get('/studentlist', (req, res) => {

    console.log("Fetching student list...");
    // Here you would typically fetch the student list from the database

    db.query('SELECT * FROM students;')
        .then(([rows]) => {
            if (rows.length > 0) {
                students = rows; // Return the first student found
                res.render('studentlist', { students: students, error: null });
            } else {
                students = []; // Return the first student found
                res.render('studentlist', { students: students, error: null });
            }
        }).catch((err) => {
            console.error("Error fetching student list:", err);
            res.status(500).render("studentlist", { students: [], error: err.message });
        })


});


app.get("/studentadd", (req, res) => {
    res.render('studentadd', { error: null });
});

app.get("/student/:studentId", async (req, res) => {
    const studentId = req.params.studentId;
    console.log(`Fetching details for student ID: ${studentId}`);

    let student = null;

    // Here you would typically fetch the student details from the database using the studentId
    // use db.query to get the student details
    db.query('SELECT * FROM students WHERE id = ?', [studentId])
        .then(([rows]) => {
            if (rows.length > 0) {
                student = rows[0]; // Return the first student found
                res.render('student', { student: student, error: null });
            } else {
                res.status(404).render('errors/404', { error: "Student not found" });
            }
        }).catch((err) => {
            console.error("Error fetching student details:", err);
            res.status(500).render('student', { student: null, error: err.message });
        });


});



app.post('/studentadd', (req, res) => {
    console.log(req.body); //   { FirstName: 'John ', LastName: 'Doe', email: 'heyy@passerellesnumerique.org', group:  1, comment :"this is a comment" }

    const { FirstName, LastName, Group, Email, comment } = req.body;

    db.query(
        'INSERT INTO students (FirstName, LastName, PNGroup, Email, Comment) VALUES (?, ?, ?, ?, ?)',
        [FirstName, LastName, Group, Email, comment || null]
    )
        .then(() => {
            res.redirect('/studentlist');
        }).catch((err) => {
            console.error("Error inserting student:", err);
            res.render('studentadd', { error: err.message });
        });




});




// if no previous route matches, render the 404 page
app.use((req, res) => {
    // res.status(404).json({ error: "Not Found, are you lost? You are here --> #", cat: "https://http.cat/status/404" });
    res.status(404).render('errors/404', {});
});

// handle errors
app.use((err, req, res, next) => {
    console.error(err.stack);


    res.status(500).json({ error: err.message, stack: err.stack });

});

// Start the server
app.listen(PORT, () => {
    console.log(`📚 Student website is running at ` + `http://localhost:${PORT}`.rainbow);
});

