const {model, Schema} = require("mongoose");
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

const Produto = model("produto",
new Schema({
    nome: {
        type: String,
        required: true

    },
    descricao: {
        type: String,
        required: true

    },
    quantidade: {
        type: Number,
        required: true

    }, 
    
    preco: {
        type: Number,
        required: true

    },

    desconto: {
        type: Number,
        required: true

    },

    dataDesconto: {
        type: Date,
        required: true,
        default: Date.now

    },

    categoria: {
        type: String,
        required: true,

    },

    imagemProduto: {
        type: String,
        required: true,
    }
})
);

module.exports=  {
    Produto,
    produtoSchema
}