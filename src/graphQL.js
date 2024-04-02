"use strict";

import { randomUUID } from "crypto";

export const schema = `
  type Post {
    id: ID
    title: String!
    content: String!
    tag: Tag!
  }

  type Tag {
    id: ID!
    name: String!
  }

  input PostCreate {
    title: String!
    content: String!
    tagId: ID!
  }

  input PostUpdate {
    id: ID!
    title: String
    content: String
  }
  
  input PostDelete {
    id: ID!
  }

  input TagCreate {
    name: String!
  }

  type Query {
    getTags: [Tag!]!
    getPosts: [Post!]!
    getPost(id: ID!): Post
    getPostByTag(tagId: ID!): [Post!]
  }

  type Mutation {
    createPost(newPost: PostCreate!): Post!
    deletePost(deletePost: PostDelete!): Post
    updatePost(updatePost: PostUpdate!): Post!
    createTag(newTag: TagCreate!): Tag!
  }
`;

export const resolvers = {
  Query: {
    getTags: (_parent, args, { app }) => {
      return app.db.tags;
    },
    getPostByTag: (_parent, args, { app }) => {
      const { tagId } = args;
      console.log("--------------");
      console.log(tagId);
      console.log("--------------");
      const postWithMatchTag = app.db.posts.filter((post) => {
        return post.tag && post.tag.id === tagId;
      });
      return postWithMatchTag;
    },
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
      const { title, content, tagId } = newPost;
      const post = {
        id: randomUUID(),
        title,
        content,
        tag: {
          id: tagId,
          name: app.db.tags.find((tag) => tag.id).name,
        },
      };
      app.db.posts.push(post);
      return post;
    },
    deletePost: (_parent, { deletePost }, { app }) => {
      const { id } = deletePost;
      const postDelete = app.db.posts.filter((post) => post.id !== id);

      app.db.posts = postDelete;
    },
    updatePost: (_parent, { updatePost }, { app }) => {
      const { id, title, content } = updatePost;
      const post = app.db.posts.find((post) => post.id === id);

      if (title) {
        post.title = title;
      }
      if (content) {
        post.content = content;
      }

      return post;
    },
    createTag: (_parent, { newTag }, { app }) => {
      const { name } = newTag;

      const tag = {
        id: randomUUID(),
        name: name,
      };
      app.db.tags.push(tag);
      return tag;
    },
  },
};

export const loaders = {};
