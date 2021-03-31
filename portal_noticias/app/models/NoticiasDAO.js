function NoticiasDAO(conn) {
    this._conn = conn;
}

NoticiasDAO.prototype.getNoticias = function (callback) {
    this._conn.query('SELECT * FROM noticias ORDER BY data_criacao DESC', callback);
};

NoticiasDAO.prototype.getNoticia = function (id_noticia, callback) {
    this._conn.query('SELECT * FROM noticias WHERE id_noticia = ' + id_noticia.id_noticia, callback);
};

NoticiasDAO.prototype.salvarNoticia = function (noticia, callback) {
    this._conn.query('INSERT INTO noticias set ?', noticia, callback);
};

NoticiasDAO.prototype.get5ultimasNoticias = function (callback) {
    this._conn.query('SELECT * FROM noticias ORDER BY data_criacao DESC LIMIT 5', callback);
}

module.exports = () => {
    return NoticiasDAO;
};