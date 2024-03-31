// Manejador de eventos cuando un cliente se conecta al servidor
io.on('connection', (socket) => {
    console.log('Un cliente se ha conectado.');
  
    // Evento para manejar los mensajes enviados por el cliente
    socket.on('message', (message) => {
      console.log('Mensaje recibido:', message);
  
      // Lógica para determinar la respuesta basada en el mensaje recibido
      let response;
      switch (message) {
        case 'threshold':
          response = 'Las reglas de este juego de mesa son...';
          break;
        // Agrega más casos según tus necesidades
        default:
          response = 'No entendí tu pregunta.';
          break;
      }
  
      // Enviar la respuesta al cliente
      socket.emit('serverMessage', response);
    });
  
    // Manejador de eventos cuando un cliente se desconecta del servidor
    socket.on('disconnect', () => {
      console.log('Un cliente se ha desconectado.');
    });
  });
  