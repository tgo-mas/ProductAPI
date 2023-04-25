const { Router, application } = require("express");
const { Produto } = require("../models/produto")
const router = Router();
const { produtoSchema } = require("../models/produto")
const multer = require("multer");

// Configuração de armazenamento
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads')
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now() + '.' + file.originalname.split(".")[1])
    }
});

const upload = multer({ storage });

// Atualização do Produto (PUT)
router.put("/produtos/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { error, value } = produtoSchema.validate(req.body);

        if (error) {
            const campoErro = error.details[0].context.label;
            const erroMensagem = error.details[0].message;
            return res.status(400).json({
                message: `Erro de validação no campo: ${campoErro}: ${erroMensagem}`
            });
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
router.post("/produtos", upload.single("imagemProduto"), async (req, res) => {
    const { nome, descricao, quantidade, preco, desconto, dataDesconto, categoria } = req.body;
    // Validação dos dados:
    if (!nome) {
        res.status(400).json({ message: "O nome do produto é obrigatório." });
    } else if (!descricao) {
        res.status(400).json({ message: "A descrição do produto é obrigatória." });
    } else if (!quantidade || isNaN(quantidade)) {
        res.status(400).json({ message: "A quantidade do produto é obrigatória e deve ser um número." });
    } else if (!preco || isNaN(preco)) {
        res.status(400).json({ message: "O preço do produto é obrigatório e deve ser um número." });
    } else if (!categoria) {
        res.status(400).json({ message: "A categoria do produto é obrigatória." });
    } else {
        try {
            // Criando um novo doc
            const produto = new Produto({ nome, descricao, quantidade, preco, desconto, dataDesconto, categoria, imagemProduto: req.file.filename});
            console.log(req.file.filename);
            await produto.save();
            res.json(produto);

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
    let resFinal = all;

    if (nome) {
        resFinal = resFinal.filter(
            (obj) => obj.nome.includes(nome)
        );
    }

    if (qtd) {
        resFinal = resFinal.filter(
            (obj) => obj.quantidade === qtd
        );
    }

    if (categoria) {
        resFinal = resFinal.filter(
            (obj) => obj.categoria === categoria
        );
    }

    if (preco) {
        resFinal = resFinal.filter(
            (obj) => obj.preco === preco
        );
    }

    if (dataDesconto) {
        resFinal = resFinal.filter(
            (obj) => obj.dataDesconto === dataDesconto
        );
    }

    res.json(resFinal);
});

router.get("/produtos/:id", async (req, res) => {
    try {
        const { id } = req.params;

        const produto = await Produto.findById(id);

        if (produto) {
            res.json(produto);
        } else {
            res.status(404).json("Produto não encontrado!");
        }

    } catch (err) {
        console.log(err);
        res.status(500).json(`Um erro aconteceu: ${err.message}`);
    }
});

// Deletar um produto
router.delete("/produtos/:id", async (req, res) => {
    try {
        // Checa se a tarefa existe, e então remove do banco
        const { id } = req.params;
        const produtoExistente = await Produto.findByIdAndRemove(id);

        if (produtoExistente) {
            res.json({ message: "Produto excluído." });
        } else {
            res.status(404).json({ message: "Produto não encontrada." });
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Um erro aconteceu." });
    }

});

module.exports = router;
