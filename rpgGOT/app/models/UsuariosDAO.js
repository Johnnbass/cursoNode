const crypto = require("crypto");

function UsuariosDAO(connection) {
  this._connection = connection;
}

UsuariosDAO.prototype.inserirUsuario = function (usuario, req, res) {
  const senha_crypto = crypto.createHash("md5").update(usuario.senha).digest("hex");
  usuario.senha = senha_crypto;

  const dados = {
    operacao: "inserir",
    dados: usuario,
    collection: "usuarios",
    callback: function (err, result) {
      res.render("sucesso");
    },
  };
  this._connection(dados);
};

UsuariosDAO.prototype.autenticar = function (usuario, req, res) {
  const senha_crypto = crypto.createHash("md5").update(usuario.senha).digest("hex");
  usuario.senha = senha_crypto;

  const dados = {
    operacao: "consultar",
    dados: usuario,
    collection: "usuarios",
    req: req,
    res: res,
    callback: function (err, result) {
      res.send(result);
    },
  };
  this._connection(dados);
};

module.exports = function () {
  return UsuariosDAO;
};
