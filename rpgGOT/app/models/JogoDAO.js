const ObjectID = require('mongodb').ObjectId;

function JogoDAO(connection) {
  this._connection = connection;
}

JogoDAO.prototype.gerarParametros = function (usuario, req, res) {
  const dados = {
    operacao: "inserir",
    dados: {
      usuario: usuario,
      moeda: 15,
      suditos: 10,
      temor: Math.floor(Math.random() * 1000),
      sabedoria: Math.floor(Math.random() * 1000),
      comercio: Math.floor(Math.random() * 1000),
      magia: Math.floor(Math.random() * 1000),
    },
    collection: "jogo",
    callback: function (err, result) {},
  };
  this._connection(dados);
};

JogoDAO.prototype.iniciaJogo = function (usuario, casa, msg, req, res) {
  const dados = {
    operacao: "consultar",
    dados: { usuario: usuario },
    casa: casa,
    msg: msg,
    collection: "jogo",
    req: req,
    res: res,
    callback: function (err, result) {
      res.send(result);
    },
  };
  this._connection(dados);
};

JogoDAO.prototype.acao = function (acao, req, res) {
  const date = new Date();
  
  let tempo = null;

  switch (parseInt(acao.acao)) {
    case 1:
      tempo = 1 * 60 * 60000;
      break;
    case 2:
      tempo = 2 * 60 * 60000;
      break;
    case (3, 4):
      tempo = 5 * 60 * 60000;
      break;
  }

  acao.acao_termina_em = date.getTime() + tempo;
  let dados = {
    operacao: "inserir",
    dados: acao,
    collection: "acao",
    callback: function (err, result) {},
  };
  this._connection(dados);

  let moedas = null;

  switch (parseInt(acao.acao)) {
    case 1:
      moedas = -2 * acao.quantidade;
      break;
    case 2:
      moedas = -3 * acao.quantidade;
      break;
    case (3, 4):
      moedas = -1 * acao.quantidade;
      break;
  }

  dados = {
    operacao: "atualizar",
    referencia: { usuario: acao.usuario },
    condicional: {$inc: {moeda: moedas}},
    collection: "jogo",
    callback: function (err, result) {},
  };
  this._connection(dados);
};

JogoDAO.prototype.getAcoes = function (usuario, req, res) {
  const date = new Date();
  const momento_atual = date.getTime();

  const dados = {
    operacao: "consultar",
    dados: { usuario: usuario, acao_termina_em: { $gt: momento_atual } },
    collection: "acao",
    req: req,
    res: res,
    callback: function (err, result) {},
  };
  this._connection(dados);
};

JogoDAO.prototype.revogarAcao = function (_id, req, res) {
  const dados = {
    operacao: "excluir",
    dados: { _id: ObjectID(_id) },
    collection: "acao",
    req: req,
    res: res,
    callback: function (err, result) {
      res.redirect('jogo?msg=D');
    },
  };
  this._connection(dados);
}

module.exports = function () {
  return JogoDAO;
};
