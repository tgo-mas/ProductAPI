const { Router } = require("express");
const Produto = require("../models/produto")
const router = Router();
const Joi = require("joi");

const produtoSchema = Joi.object({
    nome: Joi.string().required(),
    descricao: Joi.string().required(),
    quantidade: Joi.number().integer().min(0).required(), 
    preco: Joi.number().precision(2).min(0).required(),
    desconto: Joi.number().integer().min(0).max(100).default(0),
    dataDesconto: Joi.date().iso().required(),
    categoria: Joi.string().required(),
    imagemProduto: Joi.string().uri().optional()
})




// Atualização do Produto (PUT)
router.put("/produtos/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { error, value } = produtoSchema.validate(req.body);
        
        if(error) {
            const campoErro = error.details[0].context.label;
            const erroMensagem = error.details[0].message;
            return res.status(400).json({ 
                message: `Erro de validação no campo: ${campoErro}: ${erroMensagem}`});
        }

        const produtoExistente = await Produto.findByIdAndUpdate(id, value);

        if (!produtoExistente) {
            return res.status(404).json({ error: "Produto não encontrado." });
        } 
        res.json({ message: "Produto editado com sucesso." });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Um erro aconteceu." });
    }
    });


module.exports= router;