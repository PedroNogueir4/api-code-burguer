import * as Yup from "yup";
import Products from "../models/Products.js";
import Categories from "../models/Categories.js";
import User from "../models/User.js";
class ProductController {
    async store(request, response) {
        try {
            const schema = Yup.object().shape({
                name: Yup.string().required(),
                price: Yup.number().required(),
                category_id: Yup.number().required(),
                offer: Yup.boolean()
            });

            try {
                schema.validateSync(request.body, { abortEarly: false })
            } catch (error) {
                return response.status(400).json({ error: error.errors })
            };

            const { admin: isAdmin } = await User.findByPk(request.userId)

            if (!isAdmin) {
                return response.status(401).json()
            }

            const { filename: path } = request.file
            const { name, price, category_id, offer } = request.body

            const product = await Products.create({
                name,
                price,
                category_id,
                path,
                offer
            });


            return response.json(product)
        } catch (error) {
            console.log(error)
        }
    }

    async index(request, response) {

        const products = await Products.findAll({
            include: [{
                model: Categories,
                as: 'category',
                attributes: ['name']
            },
            ],
        })
        return response.json(products)

    }

    async update(request, response) {
        try {
            const schema = Yup.object().shape({
                name: Yup.string(),
                price: Yup.number(),
                category_id: Yup.number(),
                offer: Yup.boolean()
            });

            try {
                schema.validateSync(request.body, { abortEarly: false })
            } catch (error) {
                return response.status(400).json({ error: error.errors })
            };

            const { admin: isAdmin } = await User.findByPk(request.userId)

            if (!isAdmin) {
                return response.status(401).json()
            }

            const { id } = request.params
            const product = await Products.findByPk(id)

            if (!product) {
                return response.status(401).json({ error: "Make sure of Id is correct" })
            }

            let path
            if (request.file) {
                path = request.file.filename
            }

            const { name, price, category_id, offer } = request.body

            await Products.update({
                name,
                price,
                category_id,
                path,
                offer
            },
                { where: { id } }
            );


            return response.status(200).json()
        } catch (error) {
            console.log(error)
        }
    }
}

export default new ProductController()