module.exports.index = function (application, req, res) {
  res.render("index", { validacao: {}, dadosForm: {} });
};

module.exports.autenticar = function (application, req, res) {
  const dadosForm = req.body;

  req.assert("usuario", "Usuário não poder ser vazio").notEmpty();
  req.assert("senha", "Senha não pode ser vazia").notEmpty();

  const erros = req.validationErrors();

  if (erros) {
    res.render("index", { validacao: erros, dadosForm: dadosForm });
    return;
  }

  const connection = application.config.dbConnection;
  const UsuariosDAO = new application.app.models.UsuariosDAO(connection);

  UsuariosDAO.autenticar(dadosForm, req, res);
};

module.exports.cadastro = function (application, req, res) {
  res.render("cadastro");
};
