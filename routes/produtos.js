const { Router, application } = require("express");
const Produto = require("../models/produto")
const router = Router();


//Inserção do Produto



// Rota POST:
router.post("/produtos", async(req, res) => {
    const { nome, descricao, quantidade, preco, desconto, dataDesconto, categoria, imagemProduto } = req.body;
    // Validação dos dados:
    if (!nome) {
        res.status(400).json({ message: "O nome do produto é obrigatório." });
    }else if (!descricao) {
        res.status(400).json({ message: "A descrição do produto é obrigatória." });
    }else if (!quantidade || isNaN(quantidade)) {
        res.status(400).json({ message: "A quantidade do produto é obrigatória e deve ser um número." });
    }else if (!preco || isNaN(preco)) {
        res.status(400).json({ message: "O preço do produto é obrigatório e deve ser um número." });
    }else if (!categoria) {
        res.status(400).json({ message: "A categoria do produto é obrigatória." });
    }else if (!imagemProduto) {
        res.status(400).json({ message: "A imagem do produto é obrigatória." });
    }else {
        try {
            // Criando um novo doc
            const produto = new Produto({ nome, descricao, quantidade, preco, desconto, dataDesconto, categoria, imagemProduto })
            // Inserir
            await produto.save();
            res.status(201).json(produto);
        } catch (err) {
            console.log(err);
            res.status(500).json({ message: "Não foi possível criar produto." })
        }
    }
});

module.exports= router;
