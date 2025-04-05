const express = require("express");
const crypto = require("node:crypto");
const movies = require("./movies.json"); // commonJS permite obtener JSON
const { validateMovie, validateParcialMovie } = require("./schemas/movies");

const app = express();
app.use(express.json()); // Transformar JSON recibido a js
app.disable("x-powered-by"); // Desabilitar header x-Powered-By: Express

app.get("/", (req, res) => {
    // res.send(req.query.genre);
    res.header("Access-Control-Allow-Origin", "*");

    const { genre } = req.query;

    if (genre) {
        const moviesFilter = movies.filter((movie) => 
            movie.genre.some((movieGenre) => movieGenre.toLowerCase() === genre.toLowerCase())
        );
        return res.json(moviesFilter);
    }
    res.json(movies);
});

app.post("/movies", (req, res) => {
    const result = validateMovie(req.body);

    if (result.error) {
        return res.status(400).json({ error: result });
    }

    const newMovie = {
        id: crypto.randomUUID(), // uuid version 4
        ...result.data
    }

    movies.push(newMovie);
    
    res.status(201).json(result);
});

app.delete("/movies/:id", (req, res) => {
    res.header("Access-Control-Allow-Origin", "*");

    const { id } = req.params;
    const movieIndex = movies.findIndex(movie => movie.id === id);

    if (movieIndex === -1) return res.status(404).json({ message: 'Movie not found' });

    movies.splice(movieIndex, 1);

    return res.json({ message: 'Movie deleted' });
});

app.patch("/movies/:id", (req, res) => {
    const result = validateParcialMovie(req.body);
    
    if (result.error) return res.status(400).json({ error: result });
    
    const { id } = req.params;
    const indexMovie = movies.findIndex((movie) => movie.id === id);

    if (indexMovie < 0) return res.status(404).json({messege: "Not found"});

    const updateMovie = {
        ...movies[indexMovie],
        ...result.data
    }

    movies[indexMovie] = updateMovie;

    res.json(updateMovie);
});

app.get("/movies/:id", (req, res) => {
    const { id } = req.params;
    const movie = movies.find(movie => movie.id == id);

    if (movie) return res.json(movie);

    res.status(404).json({messege: "Not found"});
});

app.options("/movies/:id", (req, res) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE");

    res.send(200);
});

const PORT = process.env.PORT ?? 3000;

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});