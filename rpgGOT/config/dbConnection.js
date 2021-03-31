// importar o mongodb
const mongo = require("mongodb").MongoClient;
const assert = require("assert");

const dbName = "got";
const url = "mongodb://localhost:27017/" + dbName;

var connMongoDB = function (dados) {
  mongo.connect(url, function (err, client) {
    assert.equal(null, err);

    console.log("Servidor Online");

    const db = client.db(dbName);

    query(db, dados);

    client.close();
  });
};

function query(db, dados) {
  const collection = db.collection(dados.collection);

  switch (dados.operacao) {
    case "inserir":
      collection.insertOne(dados.dados, dados.callback);
      break;
    case "consultar":
      collection.find(dados.dados).toArray(function (err, result) {
        switch (dados.collection) {
          case "usuarios":
            if (result[0] != undefined) {
              dados.req.session.autorizado = true;

              dados.req.session.usuario = result[0].usuario;
              dados.req.session.casa = result[0].casa;
            }
            if (dados.req.session.autorizado) {
              dados.res.redirect("jogo");
            } else {
              dados.res.render("index", {
                validacao: [{ msg: "Usuário e/ou senha inválidos" }],
                dadosForm: { usuario: dados.dados.usuario },
              });
            }
            break;
          case "jogo":
            dados.res.render("jogo", {
              img_casa: dados.casa,
              jogo: result[0],
              msg: dados.msg,
            });
            break;
          case "acao":
            dados.res.render("pergaminhos", { acoes: result });
            break;
        }
      });
      break;
    case "atualizar":
      collection.update(dados.referencia, dados.condicional);
      break;
    case "excluir":
      collection.remove(dados.dados, dados.callback);
      break;
    default:
      break;
  }
}

module.exports = function () {
  return connMongoDB;
};
