import app from "./app";

// Connect to MongoDB
import "./utils/connectDb";

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});