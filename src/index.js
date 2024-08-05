const dotENV = require("dotenv");
dotENV.config();

require("../dbConnext");
const app = require("./app");

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.error(process.env.PORT);
  console.log(`Server is runing on ${PORT}`);
  console.log(`http://localhost:${PORT}`);
});
