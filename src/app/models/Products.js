import { Sequelize, Model } from "sequelize";


class Products extends Model {
    static init(sequelize) {
        super.init(
            {
                name: Sequelize.STRING,
                price: Sequelize.INTEGER,
                path: Sequelize.STRING,
                offer: Sequelize.BOOLEAN,
                url: {
                    type: Sequelize.VIRTUAL,
                    get() {
                        return `https://api-code-burguer-production.up.railway.app/product-file/${this.path}`
                    }
                }
            },
            {
                sequelize,
            }
        )
        return this
    }

    static associate(models) {
        this.belongsTo(models.Categories, {
            foreignKey: 'category_id',
            as: 'category',
        })
    }
}
export default Products