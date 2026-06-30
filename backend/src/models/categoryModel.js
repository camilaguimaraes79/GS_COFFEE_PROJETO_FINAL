import pool from "../database/database.js";

class CategoryModel {

    async getAllCategories() {
        const query = `SELECT * FROM categorias`;

        const [rows] = await pool.execute(query);

        return rows;
    }

    async createCategory(nome) {
        const query = `
            INSERT INTO categorias (nome)
            VALUES (?)
        `;
    
        const [result] = await pool.execute(query, [nome]);
    
        return result;
    }

    async updateCategory(id, nome) {
        const query = `
            UPDATE categorias
            SET nome = ?
            WHERE categoria_id = ?
        `;
    
        const [result] = await pool.execute(query, [nome, id]);
    
        return result;
    }


    async getCategoryById(id) {
        const query = `
            SELECT * FROM categorias
            WHERE categoria_id = ?
        `;
    
        const [rows] = await pool.execute(query, [id]);
    
        return rows;
    }
    
    async deleteCategory(id) {
        const query = `
            DELETE FROM categorias
            WHERE categoria_id = ?
        `;
    
        const [result] = await pool.execute(query, [id]);
    
        return result;
    }

}



export default new CategoryModel();