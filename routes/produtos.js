const { Router } = require("express");
const Produto = require("../models/produto")
const router = Router();


//Inserção do Produto


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