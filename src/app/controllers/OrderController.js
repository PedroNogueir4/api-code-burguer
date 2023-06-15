import * as Yup from "yup";
import Products from "../models/Products.js";
import Categories from "../models/Categories.js"
import Order from "../schemas/Order.js";
import User from "../models/User.js";
class OrderController {
  async store(request, response) {
    try {
      const schema = Yup.object().shape({
        products: Yup.array()
          .required()
          .of(
            Yup.object().shape({
              id: Yup.number().required(),
              quantity: Yup.number().required()
            })
          )
      });

      try {
        schema.validateSync(request.body, { abortEarly: false });
      } catch (error) {
        return response.status(400).json({ error: error.errors });
      }

      const productsId = request.body.products.map(products => products.id)

      const updatedProducts = await Products.findAll({
        where: {
          id: productsId
        },
        include: [{
          model: Categories,
          as: 'category',
          attributes: ['name']
        }]
      }
      );

      const editedProduct = updatedProducts.map(product => {

        const productIndex = request.body.products.findIndex(requestProduct => requestProduct.id === product.id)

        const newProduct = {
          id: product.id,
          name: product.name,
          price: product.price,
          category: product.category.name,
          url: product.url,
          quantity: request.body.products[productIndex].quantity
        }
        return newProduct
      }
      );


      const order = {
        user: {
          id: request.userId,
          name: request.userName
        },
        products: editedProduct,
        status: 'Pedido Realizado'
      }

      const orderResponse = await Order.create(order)


      return response.status(201).json(orderResponse);
    } catch (error) {
      console.log(error)
    }
  }


  async index(request, response) {
    const orders = await Order.find()

    return response.json(orders)
  }

  async update(request, response) {
    try {
      const schema = Yup.object().shape({
        status: Yup.string().required()
      });

      try {
        schema.validateSync(request.body, { abortEarly: false });
      } catch (error) {
        return response.status(400).json({ error: error.errors });
      }

      const { admin: isAdmin } = await User.findByPk(request.userId)

      if (!isAdmin) {
        return response.status(401).json()
      }

      const { id } = request.params
      const { status } = request.body

      try {
        await Order.updateOne({ _id: id }, { status })
      } catch (error) {
        return response.status(400).json({ error: error.message })
      }

      return response.json({ message: "Status updated Successfully" })
    } catch (error) {
      console.log(error)
    }
  }
}

export default new OrderController();
