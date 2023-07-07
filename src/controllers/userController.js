const createError = require('http-errors');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const { findWithId } = require('../services/findItem');
const { successResponse } = require('./responseController');
const User = require('../models/userModel');
const { deleteImage } = require('../helper/deleteImage');
const { createJSONWebToken } = require('../helper/jsonWebToken');
const { jwtActivationKey, clientURL } = require('../secret');
const { emailWithNodeMailer } = require('../helper/email');

const getAllUsers = async (req, res, next) => {
    try {
        const search = req.query.search || '';
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 20;

        const searchRegExp = new RegExp('.*' + search + '.*', 'i');

        const filter = {
            isAdmin: { $ne: true },
            $or: [
                { name: { $regex: searchRegExp } },
                { email: { $regex: searchRegExp } },
                { phone: { $regex: searchRegExp } }
            ]
        };

        const options = {
            password: 0
        };

        const users = await User.find(filter, options)
            .limit(limit)
            .skip((page - 1) * limit);

        const count = await User.find(filter).countDocuments();

        if (!users) throw createError(404, 'No User Found!');

        return successResponse(res, {
            statusCode: 200,
            message: 'Users data fetch successfully!',
            payload: {
                users,
                pagination: {
                    totalPages: Math.ceil(count / limit),
                    currentPage: page,
                    previousPage: page - 1 > 0 ? page - 1 : null,
                    nextPage:
                        page + 1 <= Math.ceil(count / limit) ? page + 1 : null
                }
            }
        });
    } catch (error) {
        next(error);
    }
};

const getUser = async (req, res, next) => {
    try {
        const id = req.params.id;
        const options = {
            password: 0
        };
        const user = await findWithId(User, id, options);

        return successResponse(res, {
            statusCode: 200,
            message: 'User data fetch successfully',
            payload: {
                user
            }
        });
    } catch (error) {
        next(error);
    }
};

const deleteUser = async (req, res, next) => {
    try {
        const id = req.params.id;
        const options = {
            password: 0
        };
        const user = await findWithId(User, id, options);

        const userImagePath = user.image;
        deleteImage(userImagePath);

        await User.findByIdAndDelete({ _id: id, isAdmin: false });

        return successResponse(res, {
            statusCode: 200,
            message: 'User deleted successfully!'
        });
    } catch (error) {
        next(error);
    }
};

const processRegister = async (req, res, next) => {
    try {
        const { name, email, password, phone, address } = req.body;

        const userExists = await User.exists({ email: email });
        if (userExists) throw createError(409, 'Email has already taken');

        const newUser = {
            name,
            email,
            password,
            phone,
            address
        };

        const token = createJSONWebToken(newUser, jwtActivationKey, '10m');

        const emailData = {
            email: email,
            subject: 'Account activation email',
            html: `
                <h2>Hello ${name}</h2>
                <p>
                    Please click here to <a href="${clientURL}/api/users/activate/${token}" target="_blank">Active your account</a>
                </p>
            `
        };

        try {
            await emailWithNodeMailer(emailData);
        } catch (error) {
            next(createError(500, 'Faild to send verification email'));
            return;
        }

        return successResponse(res, {
            statusCode: 200,
            message: `Please check your email(${email}) to active your account`,
            payload: {
                toekn: token
            }
        });
    } catch (error) {
        next(error);
    }
};

const activeUserAccount = async (req, res, next) => {
    try {
        const token = req.body.token;
        if (!token) throw createError(404, 'Token not found!');

        try {
            const decoded = jwt.verify(token, jwtActivationKey);
            if (!decoded) throw createError(401, 'Unable to verify user');

            const userExists = await User.exists({ email: decoded.email });
            if (userExists) throw createError(409, 'Email has already taken');

            await User.create(decoded);

            return successResponse(res, {
                statusCode: 201,
                message: `User was registered successfully`
            });
        } catch (error) {
            if (error.name === 'TokenExpiredError') {
                throw createError(401, 'Token has expired!');
            } else if (error.name === 'JsonWebTokenError') {
                throw createError(401, 'Invalid Token');
            } else {
                throw error;
            }
        }
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getAllUsers,
    getUser,
    deleteUser,
    processRegister,
    activeUserAccount
};
