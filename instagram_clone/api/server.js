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
      // collection.insertOne(dados.dados, function (err, rst) {
      //   if (err) {
      //     dados.res.status(400).json(err);
      //   } else {
      //     dados.res.status(200).json({ result: rst.result, ops: rst.ops[0] });
      //   }
      // });
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
        { $set: dados.dados },
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
      collection.remove(dados.params, function (err, rst) {
        if (err) {
          dados.res.status(404).json(err);
        } else {
          dados.res.status(200).json(rst);
        }
      });
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
  res.setHeader("Access-Control-Allow-Origin", "*");

  const dados = {
    dados: req.body,
    collection: "postagens",
    operacao: "inserir",
    req,
    res,
  };
  console.log(dados)
  // const path_origem = req.files.arquivo.path;
  // const path_destino = "./uploads" + req.files.arquivo.originalFilename;

  // fs.rename(path_origem, path_destino, function (err) {
  //   if (err) {
  //     res.status(500).json({ error: err });
  //     return;
  //   }
  //   conn(dados);
  // });
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
