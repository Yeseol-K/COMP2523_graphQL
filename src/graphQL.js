"use strict";

import { randomUUID } from "crypto";

export const schema = `
  type Post {
    id: ID!
    title: String!
    content: String!
  }

  input PostCreate {
    title: String!
    content: String!
  }

  type Query {
    getPosts: [Post!]!
    getPost(id: ID!): Post
  }

  type Mutation {
    createPost(newPost: PostCreate!): Post!
  }
`;

export const resolvers = {
  Query: {
    getPosts: (_parent, args, { app }) => {
      return app.db.posts;
    },
    getPost: (_parent, args, { app }) => {
      const { id } = args;
      return app.db.posts.find((post) => post.id === id);
    },
  },
  Mutation: {
    createPost: (_parent, { newPost }, { app }) => {
      const { title, content } = newPost;

      const post = {
        id: randomUUID(),
        title,
        content,
      };
      app.db.posts.push(post);
      return post;
    },
  },
};

export const loaders = {};
