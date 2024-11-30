import dotenv from 'dotenv';
import path from 'path';



import app from "./app";
import connectDB from "./db";

const PORT = process.env.PORT || 5455;

const startServer = async () => {
  try {
    // Connect to MongoDB first
    await connectDB();

    // Start the server
    const server = app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });

    // Handle server errors
    server.on("error", (error: NodeJS.ErrnoException) => {
      if (error.code === 'EADDRINUSE') {
        console.error(`Port ${PORT} is already in use. Please try a different port.`);
        process.exit(1);
      } else {
        console.error("Server error:", error);
        throw error;
      }
    });

  } catch (err) {
    console.error("Startup error:", err);
    process.exit(1);
  }
};

startServer();
