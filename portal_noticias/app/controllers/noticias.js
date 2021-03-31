module.exports.noticias = (app, req, res) => {
    const conn = app.config.dbConnection();
    const noticiasDAO = new app.app.models.NoticiasDAO(conn);

    noticiasDAO.getNoticias((err, rst) => {
        res.render('noticias/noticias', { noticias: rst });
    })
};

module.exports.noticia = (app, req, res) => {
    const conn = app.config.dbConnection();
    const noticiasDAO = new app.app.models.NoticiasDAO(conn);

    const id_noticia = req.query;

    noticiasDAO.getNoticia(id_noticia, (err, rst) => {
        res.render('noticias/noticia', { noticia: rst });
    })
};