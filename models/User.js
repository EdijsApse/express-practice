const { ObjectId } = require('mongodb');
const database = require('../database/connection');
const bcrypt = require('bcryptjs');
const emailValidator = require('email-validator');

class User {
    
    constructor (name, surname, email, password, id = null) {
        
        if (id) {
            this._id = new ObjectId(id)
        }

        this.name = name;
        this.surname = surname;
        this.email = email;
        this.password = password;
    }

    static async findByEmail(email) {
        const user = await database.getDb().collection('users').findOne({ email });

        if (user) {
            return new User(user.name, user.surname, user.email, user.password, user._id);
        }

        return null;
    }

    async register() {
        await this.hashPassword();
        await this.create();
    }

    async login(req) {
        req.session.user = this;
    }

    async hashPassword() {
        this.password = await bcrypt.hash(this.password, 12);
    }

    async create() {
        const createdUser = await database.getDb().collection('users').insertOne({
            email: this.email,
            name: this.name,
            surname: this.surname,
            password: this.password,
            created: new Date()
        });

        this._id = createdUser.insertedId;
    }

    async comparePasswords(rawPwd) {
        const isMatching = await bcrypt.compare(rawPwd, this.password);

        if (!isMatching) {
            this.isValid = false;
            this.errorMessage = 'Invalid credentials';
        }
    }

    static async findById(id) {
        const user = await database.getDb().collection('users').findOne({ _id: new ObjectId(id) });
        
        if (user) {
            return new User(user.name, user.surname, user.email, user.password, user._id);
        }

        return null;
    }
}

module.exports = User;