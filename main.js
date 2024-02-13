import prompt from "prompt-sync";
import mongoose from "mongoose";

const p = prompt();

console.log("1. View all movies");
console.log("2. Add a new movie");
console.log("3. Update a movie");
console.log("4. Delete a movie");
console.log("5. Exit");

// Define the movies schema
const moviesSchema = mongoose.Schema({
  title: { type: String },
  director: { type: String },
  releaseYear: { type: Number },
  genres: [String],
  ratings: [Number],
  cast: [String],
});

// Connecting to the MongoDB database
mongoose.connect("mongodb://127.0.0.1:27017/erik-asignment-1");

// Creating an async function
async function handleMovies() {
  // Retrieve the movies model
  const movies = mongoose.model("Movies", moviesSchema);

  let runApp = true;

  while (runApp) {
    let input = p("Make a choice by entering a number: ");

    switch (input) {
      case "1":
        console.log("Here is a list of all the movies:");
        try {
          // Find all movies from the database
          let allMovies = await movies.find({});
          console.log(allMovies);
        } catch (error) {
          console.error("Error fetching movies:", error);
        }
        // Displaying all movies
        break;
      case "2":
        console.log("Enter the data of the new movie");
        let title = p("Title: ");
        let director = p("Director: ");
        let releaseYear = p("Release Year: ");
        let genres = p("Genres: ");
        let ratings = p("Ratings: ");
        let cast = p("Cast: ");

        // Adding a new movie
        const newMovie = new movies({
          title: title,
          director: director,
          releaseYear: releaseYear,
          genres: genres,
          ratings: ratings,
          cast: cast,
        });

        await newMovie.save();
        console.log("New movie added successfully!");
        break;
      case "3":
        console.log("Enter the title of the movie to update: ");
        let movieTitleToUpdate = p("Title: ");
        let newTitle = p("New Title: ");

        try {
          //  Updating the movie(s):
          const movieToUpdate = await movies.findOne({
            title: movieTitleToUpdate,
          });

          if (movieToUpdate) {
            // Update the movie's title
            await movies.updateOne(
              { _id: movieToUpdate._id },
              { $set: { title: newTitle } }
            );
            console.log(`Movie "${movieTitleToUpdate}" updated successfully.`);
          } else {
            console.log(`Movie "${movieTitleToUpdate}" not found.`);
          }
        } catch (error) {
          console.error("Error updating movie:", error);
        }
        break;
      case "4":
        //Deleting a movie
        console.log("Enter the title of the movie to delete:");
        let movieTitleToDelete = p("Title: ");

        try {
          // Find the movie to delete
          const movieToDelete = await movies.findOne({
            title: movieTitleToDelete,
          });

          if (movieToDelete) {
            // Delete the movie
            await movies.deleteOne({ _id: movieToDelete._id });
            console.log(`Movie "${movieTitleToDelete}" deleted successfully.`);
          } else {
            console.log(`Movie "${movieTitleToDelete}" not found.`);
          }
        } catch (error) {
          console.error("Error deleting movie:", error);
        }
        break;
      case "5":
        //Exiting:
        runApp = false;
        console.log("Exiting the application...");
        break;
      default:
        console.log("Please enter a number between 1 and 5.");
    }
  }

  // Close the database connection after exiting the loop
  mongoose.connection.close();
}

// Call the async function to start the application
handleMovies();
