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

        this.isValid = true;
        this.errorMessages = null;
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

    async validate() {
        await this.validateEmail();
        this.validateName();
        this.validateSurname();
        this.validatePassword();
    }
    
    async validateEmail() {
        const findByEmail = await User.findByEmail(this.email);

        if (findByEmail) {
            this.isValid = false;
            this.errorMessage = 'Email already taken!'
        }

        if (!emailValidator.validate(this.email)) {
            this.isValid = false;
            this.errorMessage = 'Invalid email address!';
        }
    }

    validateName() {
        const name = this.name.trim();

        if (name.length < 2) {
            this.isValid = false;
            this.errorMessage = 'Name must be atleast 2 characters long';
        }
    }

    validateSurname() {
        const surname = this.surname.trim();

        if (surname.length < 2) {
            this.isValid = false;
            this.errorMessage = 'Surname must be atleast 2 characters long';
        }
    }

    confirmPassword(pwd_confirmation) {
        if (this.password !== pwd_confirmation) {
            this.isValid = false;
            this.errorMessage = 'Passwords do not match';
        }
    }

    validatePassword() {
        if (this.password.length < 5) {
            this.isValid = false;
            this.errorMessage = 'Password must be atleast 5 characters long';
        }
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