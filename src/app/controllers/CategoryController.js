import Categories from "../models/Categories.js";
import * as Yup from "yup"
import User from "../models/User.js";

class CategoryController {
    async store(request, response) {
        try {
            const schema = Yup.object().shape({
                name: Yup.string().required()
            });

            try {
                schema.validateSync(request.body, { abortEarly: false })
            } catch (err) {
                return response.status(400).json({ error: err.errors })
            }

            const { admin: isAdmin } = await User.findByPk(request.userId)

            if (!isAdmin) {
                return response.status(401).json()
            }

            const { filename: path } = request.file
            const { name } = request.body

            const validateCategory = await Categories.findOne({
                where: { name }
            });

            if (validateCategory) {
                return response.status(400).json({ error: "Category already exists" })
            }

            const category = await Categories.create({
                name,
                path
            })

            return response.json(category)
        } catch (error) {
            console.log(error)
        }
    }

    async index(request, response) {

        const categories = await Categories.findAll()
        return response.json(categories)

    }

    async update(request, response) {
        try {
            const schema = Yup.object().shape({
                name: Yup.string()
            });

            try {
                schema.validateSync(request.body, { abortEarly: false })
            } catch (err) {
                return response.status(400).json({ error: err.errors })
            }

            const { admin: isAdmin } = await User.findByPk(request.userId)

            if (!isAdmin) {
                return response.status(401).json()
            }

            const { id } = request.params
            const { name } = request.body

            let path
            if (request.file) {
                path = request.file.filename
            }

            const validateCategory = await Categories.findByPk(id)

            if (!validateCategory) {
                return response.status(401).json({ error: "Make sure of category Id is correct" })
            }

            await Categories.update({ name, path }, { where: { id } });

            return response.status(200).json()
        } catch (error) {
            console.log(error)
        }
    }
}

export default new CategoryController()