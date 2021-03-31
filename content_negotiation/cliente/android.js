const http = require("http");

const opcoes = {
  hostname: "localhost",
  port: 3000,
  path: "/teste",
  method: "get",
  headers: {
    Accept: "application/json",
    // "Content-type": "application/x-www-form-urlencoded"
    "Content-type": "application/json",
  },
};

// // Content-type
// const html = "nome=Mario"; // x-www-form-urlencoded
// const json = {nome: 'Mario'};
// const string_json = JSON.stringify(json);

const buffer_corpo_response = [];

const req = http.request(opcoes, function (res) {
  res.on("data", function (data) {
    buffer_corpo_response.push(data);
  });

  res.on("end", function () {
    const corpo_response = Buffer.concat(buffer_corpo_response).toString();
    console.log(corpo_response);
    console.log(res.statusCode);
  });

  res.on("error", function () {});
});

// req.write(string_json);
req.end();

// http.get(opcoes, function (res) {
//   res.on("data", function (data) {
//     buffer_corpo_response.push(data);
//   });

//   res.on("end", function () {
//   const corpo_response = Buffer.concat(buffer_corpo_response).toString();
//   console.log(corpo_response);
//   });

//   res.on("error", function () {});
// });
