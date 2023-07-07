const express = require('express');
const {
    getAllUsers,
    getUser,
    deleteUser,
    processRegister,
    activeUserAccount
} = require('../controllers/userController');

const useRouter = express.Router();

useRouter.post('/process-register', processRegister);
useRouter.post('/verify', activeUserAccount);
useRouter.get('/', getAllUsers);
useRouter.get('/:id', getUser);
useRouter.delete('/:id', deleteUser);

module.exports = useRouter;
