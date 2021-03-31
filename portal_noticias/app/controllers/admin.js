module.exports.formulario_inclusao_noticia = (app, req, res) => {
    res.render('admin/form_add_noticia', { validacao: {}, noticia: {} });
};

module.exports.noticias_salvar = (app, req,res) => {
    const noticia = req.body;

    req.assert('titulo', 'Título é obrigatório').notEmpty();
    req.assert('resumo', 'Resumo é obrigatório').notEmpty();
    req.assert('resumo', 'Resumo deve conter entre 10 e 100 caracteres').len(10, 100);
    req.assert('autor', 'Autor é obrigatório').notEmpty();
    req.assert('data_noticia', 'Data é obrigatório').notEmpty().isDate({ format: 'YYYY-MM-DD' });
    req.assert('noticia', 'Notícia é obrigatório').notEmpty();

    const erros = req.validationErrors();

    if (erros) {
        res.render('admin/form_add_noticia', { validacao: erros, noticia: noticia });
        return;
    }

    const conn = app.config.dbConnection();
    const noticiasDAO = new app.app.models.NoticiasDAO(conn);

    noticiasDAO.salvarNoticia(noticia, (err, rst) => {
        // requisição por post, utilizar redirect para evitar problema do refresh
        res.redirect('/noticias');
    });
};