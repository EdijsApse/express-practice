const { ObjectId } = require('mongodb');
const database = require('../database/connection');

class ShippingAddress {
    constructor(collectionRecord) {
        const { country, city, state, zip, address_line, _id, user_id } = collectionRecord;

        this.country = country;
        this.city = city;
        this.state = state;
        this.zip = zip;
        this.address_line = address_line;
        this._id = new ObjectId(_id);
        this.user_id = new ObjectId(user_id);
    }

    static async create(attributes) {
        const { country, city, state, zip, address_line, user_id } = attributes;

        const { insertedId } = await database.getDb().collection('shipping_addresses').insertOne({
            country: country,
            city: city,
            state: state,
            zip: zip,
            address_line: address_line,
            user_id: new ObjectId(user_id)
        });

        if (insertedId) {
            const address = await ShippingAddress.findById(insertedId);
            return address;
        }

        return null;
    }

    static async findById(id) {
        const address = await database.getDb().collection('shipping_addresses').findOne({ _id: new ObjectId(id) });
        if (address) {
            return new ShippingAddress(address);
        }
        return null;
    }

    static async findByUserId(user_id) {
        const address = await database.getDb().collection('shipping_addresses').findOne({ user_id: new ObjectId(user_id) });
        if (address) {
            return new ShippingAddress(address);
        }
        return null;
    }

    static async updateById(id, attributes) {
        const { country, city, state, zip, address_line } = attributes;

        const { modifiedCount } = await database.getDb().collection('shipping_addresses').updateOne(
            {
                _id: new ObjectId(id)
            },
            {
                $set: {
                    country: country,
                    city: city,
                    state: state,
                    zip: zip,
                    address_line: address_line,
                }
            }
        );

        if (modifiedCount) {
            const address = await ShippingAddress.findById(id);
            return address;
        }

        return null;
    }
}

module.exports = ShippingAddress;