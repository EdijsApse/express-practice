const { ObjectId } = require('mongodb');
const database = require('../database/connection');
const bcrypt = require('bcryptjs');
const SessionHelper = require('../utils/SessionHelper');

class User {

    constructor (collectionRecord) {

        const { name, surname, email, password, is_admin, created, _id } = collectionRecord;

        this.email = email;
        this.name = name;
        this.surname = surname;
        this.password = password;
        this.is_admin = is_admin;
        this.created = created;
        this._id = new ObjectId(_id);
    }

    static async findByEmail(email) {
        const user = await database.getDb().collection('users').findOne({ email });

        if (user) {
            return new User(user);
        }

        return null;
    }

    static async create(attributes) {
        const { name, password, email, surname } = attributes;
        const hashedPassword = await bcrypt.hash(password, 12);

        const { insertedId } = await database.getDb().collection('users').insertOne({
            name: name,
            surname: surname,
            email: email,
            password: hashedPassword,
            created: new Date(),
            is_admin: 1
        });

        if (insertedId) {
            const userById = await User.findById(insertedId);
            return userById;
        }

        return null;
    }

    async login(req) {
        SessionHelper.storeUser(req, {
            _id: this._id,
            name: this.name,
            surname: this.surname,
            email: this.email,
            is_admin: this.is_admin
        });
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

    static async findById(id) {
        const user = await database.getDb().collection('users').findOne({ _id: new ObjectId(id) });

        if (user) {
            return new User(user);
        }

        return null;
    }
}

module.exports = User;