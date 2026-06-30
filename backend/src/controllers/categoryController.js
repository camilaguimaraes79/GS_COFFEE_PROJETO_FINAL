import categoryModel from "../models/categoryModel.js";

class CategoryController {

    async getAll(req, res) {

        const categories =
            await categoryModel.getAllCategories();

        return res.status(200).json(categories);
    }


    async create(req, res) {
        const { nome } = req.body;
    
        const result =
            await categoryModel.createCategory(nome);
    
        return res.status(201).json({
            message: "Categoria criada com sucesso",
            id: result.insertId
        });
    }

    async update(req, res) {
        const { id } = req.params;
        const { nome } = req.body;
    
        const result = await categoryModel.updateCategory(id, nome);
    
        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: "Categoria não encontrada"
            });
        }
    
        return res.status(200).json({
            message: "Categoria atualizada com sucesso"
        });
    }

    async getById(req, res) {
        const { id } = req.params;
    
        const category = await categoryModel.getCategoryById(id);
    
        if (!category.length) {
            return res.status(404).json({
                message: "Categoria não encontrada"
            });
        }
    
        return res.status(200).json(category[0]);
    }
    
    async delete(req, res) {
        const { id } = req.params;
    
        const result = await categoryModel.deleteCategory(id);
    
        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: "Categoria não encontrada"
            });
        }
    
        return res.status(200).json({
            message: "Categoria removida com sucesso"
        });
    }

}




export default new CategoryController();