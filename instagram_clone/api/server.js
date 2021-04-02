const express = require("express");
const bodyParser = require("body-parser");
const mongodb = require("mongodb").MongoClient;
const assert = require("assert");
const ObjectID = require("mongodb").ObjectId;
const multiparty = require("connect-multiparty");
const fs = require("fs");

// Instancia express
const app = express();

// body-parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(multiparty());
app.use(function (req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "content-type");
  res.setHeader("Access-Control-Allow-Credentials", true);

  next();
});

const port = 3000;

app.listen(port);

const dbName = "instagram";
const url = "mongodb://localhost:27017/" + dbName;

const conn = function (dados) {
  mongodb.connect(url, function (err, client) {
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
      collection.insertOne(dados.dados, function (err, rst) {
        if (err) {
          dados.res.status(400).json(err);
        } else {
          dados.res.status(200).json({ result: rst.result, ops: rst.ops[0] });
        }
      });
      break;
    case "consultar":
      let params = {};
      if (dados.params !== "") {
        params = dados.params;
      }
      collection.find(params).toArray(function (err, rst) {
        if (err) {
          dados.res.status(404).json(err);
        } else {
          dados.res.status(200).json(rst);
        }
      });
      break;
    case "atualizar":
      collection.update(
        dados.params,
        {
          $push: {
            comentarios: {
              id_comentario: new ObjectID(),
              comentario: dados.dados.comentario,
            },
          },
        },
        {},
        function (err, rst) {
          if (err) {
            dados.res.status(304).json(err);
          } else {
            dados.res.status(200).json(rst);
          }
        }
      );
      break;
    case "excluir":
      collection.update(
        {},
        { $pull: {
            comentarios: { id_comentario: ObjectID(dados.params._id) },
          },
        },
        { multi: true },
        function (err, rst) {
          if (err) {
            dados.res.status(404).json(err);
          } else {
            dados.res.status(200).json(rst);
          }
        }
      );
      break;
    default:
      break;
  }
}

console.log(`Servidor HTTP está escutando a porta: ${port}!`);

app.get("/", function (req, res) {
  res.send({ msg: "olá" });
});

app.post("/api", function (req, res) {
  const data = new Date();
  const timestamp = data.getTime();

  const url_imagem = timestamp + "_" + req.files.arquivo.originalFilename;

  const path_origem = req.files.arquivo.path;
  const path_destino = "./uploads" + url_imagem;

  fs.rename(path_origem, path_destino, function (err) {
    if (err) {
      res.status(500).json({ error: err });
      return;
    }

    const dados = {
      url_imagem: url_imagem,
      titulo: req.body.titulo,
      collection: "postagens",
      operacao: "inserir",
      req,
      res,
    };

    conn(dados);
  });
});

app.get("/api", function (req, res) {
  const dados = {
    collection: "postagens",
    operacao: "consultar",
    req,
    res,
  };
  conn(dados);
});

app.get("/imagens/:imagem", function (req, res) {
  const img = req.params.imagem;
  fs.readFile(`./uploads/${img}`, function (err, conteudo) {
    if (err) {
      res.status(400).json(err);
      return;
    }
    res.writeHead(200, { "content-type": "image/jpg" });
    res.end(content);
  });
});

app.get("/api/:id", function (req, res) {
  const dados = {
    params: { _id: ObjectID(req.params.id) },
    collection: "postagens",
    operacao: "consultar",
    req,
    res,
  };
  conn(dados);
});

app.put("/api/:id", function (req, res) {
  const dados = {
    params: { _id: ObjectID(req.params.id) },
    dados: req.body,
    collection: "postagens",
    operacao: "atualizar",
    req,
    res,
  };
  conn(dados);
});

app.delete("/api/:id", function (req, res) {
  const dados = {
    params: { _id: ObjectID(req.params.id) },
    collection: "postagens",
    operacao: "excluir",
    req,
    res,
  };
  conn(dados);
});
