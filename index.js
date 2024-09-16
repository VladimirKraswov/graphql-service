const { ApolloServer, gql } = require('apollo-server');

// Определяем схему GraphQL
const typeDefs = gql`
  type Post {
    id: ID!
    title: String!
    content: String!
  }

  input PostInput {
    title: String!
    content: String!
  }

  type Query {
    getPosts: [Post]
  }

  type Mutation {
    addPost(input: PostInput): Post
    updatePost(id: ID!, input: PostInput): Post
    deletePost(id: ID!): String
  }
`;

// Хранилище для постов (имитация базы данных)
let posts = [];
let idCounter = 1;

// Резолверы
const resolvers = {
  Query: {
    getPosts: () => posts,
  },
  Mutation: {
    addPost: (_, { input }) => {
      const newPost = {
        id: idCounter++,
        title: input.title,
        content: input.content,
      };
      posts.push(newPost);
      return newPost;
    },
    updatePost: (_, { id, input }) => {
      const postIndex = posts.findIndex((post) => post.id === parseInt(id));
      if (postIndex === -1) {
        throw new Error('Пост не найден');
      }
      posts[postIndex] = {
        ...posts[postIndex],
        title: input.title,
        content: input.content,
      };
      return posts[postIndex];
    },
    deletePost: (_, { id }) => {
      const postIndex = posts.findIndex((post) => post.id === parseInt(id));
      if (postIndex === -1) {
        throw new Error('Пост не найден');
      }
      posts.splice(postIndex, 1);
      return `Пост с ID ${id} удален`;
    },
  },
};

// Создание и запуск сервера Apollo
const server = new ApolloServer({ typeDefs, resolvers });

// Запуск сервера
server.listen(8181).then(({ url }) => {
  console.log(`🚀 Сервер запущен на ${url}`);
});
