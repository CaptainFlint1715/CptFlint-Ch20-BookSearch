const { gql } = require('apollo-server-express')

const typeDefs = gql`
    input BookInput {
        authors: [String!]!
        description: String!
        bookId: String!
        image: String!
        link: String!
        title: String!
    }

    type Mutation {
        saveBook(bookInfo: BookInput!): User
    }
    `