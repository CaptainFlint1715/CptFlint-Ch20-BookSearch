const { AuthenticationError } = require('apollo-server-express');
const { User } = require('../models')
const { signToken } = require('../utils/auth');

const resolvers = {
    Query: {
        me: async (parent, args, context) => {
            if (context.user) {
                return User.findOne({ _id: context.user._id })
            }
            throw new AuthenticationError('You must be logged in!')
        }
    },

    Mutation: {
        login: async (parent, { email, password }) => {
            const user = await User.findOne({ email })

            if (!user) {
                throw new AuthenticationError('No user found with this email!')
            }

            const correctPass = await user.isCorrectPassword(password)

            if (!correctPass) {
                throw new AuthenticationError('Password incorrect!')
            }
            
            const token = signToken(user)
            return { token, user }
        },

        addUser: async (parent, { username, email, password }) => {
            const user = await User.create({ username, email, password })
            const token = signToken(user)

            return { token, user }
        },

        saveBook: async (parent, { bookInfo }, context) => {
            if (context.user) {
                const savedBookData = await User.findOneAndUpdate(
                    { _id: context.user._id },
                    {
                        $addToSet: { savedBooks: bookInfo }
                    },
                    {
                        new: true
                    }
                )
                return savedBookData
            }
            throw new AuthentificationError('Must be logged in to save book!')
        },
        
        removeBook: async (parent, { bookId }, context) => {
            if (context.user) {
                const updatedUser = await User.findOneAndUpdate(
                    { _id: context.user._id },
                    {
                        $pull: { savedBooks: {bookId: bookId}}
                    },
                    {
                        new: true
                    }
                )
                return updatedUser
            }
            throw new AuthentificationError('Must be logged in to remove book!')
        }
    }
}

module.exports = resolvers