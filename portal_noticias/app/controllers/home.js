module.exports.index = (app, req, res) => {

    const conn = app.config.dbConnection();
    const noticiasModel = new app.app.models.NoticiasDAO(conn);

    noticiasModel.get5ultimasNoticias((err, rst) => {
        res.render('home/index', { noticias: rst });
    });
}