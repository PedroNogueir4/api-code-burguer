import Sequelize from "sequelize";
import configDataBase from "../config/database.js";
import mongoose from "mongoose";

import User from "../app/models/User.js";
import Products from "../app/models/Products.js";
import Categories from "../app/models/Categories.js";

const models = [User, Products, Categories]
class Database {
    constructor() {
        this.init()
        this.mongo()
    }

    init() {
        this.connection = new Sequelize(configDataBase)
        models.map((model) => model.init(this.connection))
            .map(model => model.associate && model.associate(this.connection.models))
    }

    mongo() {
        this.mongoConnection = mongoose.connect(
            'mongodb://localhost:27017/codeburguer',
            {
                useNewUrlParser: true,
                useUnifiedTopology: true,
            }
        )
    }
}

export default new Database()