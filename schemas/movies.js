const z = require("zod");

const movieSchema = z.object({
    title: z.string({
        invalid_type_error: "Titulo de la pelicula debe ser string",
        required_error: "Titulo de pelicula es obligatorio"
    }),
    year: z.number().int().min(1900).max(2025),
    director: z.string(),
    duration: z.number().int().positive(),
    rate: z.number().min(0).max(10).default(5),
    poster: z.string().url({
        messege: "El poster debe ser una url valida"
    }),
    genre: z.array(
        z.enum(['Action', 'Adventure', 'Crime', 'Comedy', 'Drama', 'Fantasy', 'Horror', 'Thriller', 'Sci-Fi']),
        {
            required_error: "Debe uncluir genero",
            invalid_type_error: "El género de la película debe ser uno del array de enumeración Género"
        }
    )
})

const validateMovie = (object) => {
    return movieSchema.safeParse(object);
};

const validateParcialMovie = (object) => {
    return movieSchema.partial().safeParse(object);
};

module.exports = { validateMovie, validateParcialMovie };
