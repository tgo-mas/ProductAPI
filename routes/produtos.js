const { Router, application } = require("express");
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

//Listagem dos produtos
router.get("/produtos", async (req, res) => {
    const { nome, qtd, categoria, preco, dataDesconto } = req.query;
    const all = await Produto.find();
    const resFinal = all;

    if(nome){
        resFinal = resFinal.filter(
            (obj) => obj.nome === nome
        );
    }

    if(qtd){
        resFinal = resFinal.filter(
            (obj) => obj.quantidade === qtd
        );
    }

    if(categoria){
        resFinal = resFinal.filter(
            (obj) => obj.categoria === categoria
        );
    }

    if(preco){
        resFinal = resFinal.filter(
            (obj) => obj.preco === preco
        );
    }

    if(dataDesconto){
        resFinal = resFinal.filter(
            (obj) => obj.dataDesconto === dataDesconto
        );
    }

    res.json(response);
});

router.get("/produtos/:id", async (req, res) => {
    try{
        const { id } = req.params();

        const produto = Produto.findById(id);

        if(produto){
            res.json(produto);
        }else{
            res.status(404).json("Produto não encontrado!");
        }

    }catch(err){
        console.log(err);
        res.status(500).json(`Um erro aconteceu: ${err.message}`);
    }
});

module.exports= router;
