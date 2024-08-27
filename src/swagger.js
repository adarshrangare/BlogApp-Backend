const swaggerAutogen = require('swagger-autogen')();

const doc = {
  info: {
    title: 'My API',
    description: 'Description'
  },
  host: 'localhost:3000',
  basePath: '/api/v1',
  tags: [
    {
      name: 'User',
      description: 'Operations related to user management',
    },
    {
      name: 'Blog',
      description: 'Operations related to blog management',
    },
    {
      name: 'Comment',
      description: 'Operations related to comments on blogs',
    },
  ],
};

const outputFile = './swagger-output.json';
const routes = ['./routes/userRoutes.js', './routes/blogRoutes.js', './routes/commentsRoutes.js'];

// Automatically generate the swagger-output.json
module.exports = ()=>{swaggerAutogen(outputFile, routes, doc)}