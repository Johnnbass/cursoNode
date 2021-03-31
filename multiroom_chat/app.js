// importar as configurações do servidor
const app = require('./config/server');

// parametrizar a porta de escuta
const server = app.listen(3000, () => {
    console.log('Servidor Online');
});

// socket.io
const io = require('socket.io').listen(server);

app.set('io', io);

// criar a conexão por websocket
io.on('connection', socket => { // procura por uma tentativa de conexão websocket pelo lado do cliente
    console.log('Usuário conectou');
    
    socket.on('disconnect', () => {
        console.log('Usuário desconectou');
    });

    socket.on('msgParaServidor', (data) => {
        // diálogo
        socket.emit('msgParaCliente', {
            apelido: data.apelido,
            mensagem: data.mensagem
        });

        socket.broadcast.emit('msgParaCliente', {
            apelido: data.apelido,
            mensagem: data.mensagem
        });

        // participantes
        if (parseInt(data.apelido_atualizado_nos_clientes) == 0) {
            socket.emit('participantesParaCliente', {
                apelido: data.apelido
            });

            socket.broadcast.emit('participantesParaCliente', {
                apelido: data.apelido
            });
        }
    });

});

// on - fica ouvindo pedidos de execução
// emit() - pedido para executar alguma ação
