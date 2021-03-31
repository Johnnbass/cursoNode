const mysql = require('mysql');

const connMySQL = () => {
    return mysql.createConnection({
        host: 'localhost',
        port: 3306,
        user: 'admin',
        password: 'admin',
        database: 'portal_noticias',
        insecureAuth: true
    });
}

module.exports = () => {
    return connMySQL; // variável evita que execute a função ao fazer o autoload pelo consign
};
// Para o MySQL 8.0 tive que rodar alterar configurações de credenciais do usuário
// ALTER USER 'admin'@'localhost' IDENTIFIED WITH mysql_native_password BY 'admin';
// FLUSH PRIVILEGES;