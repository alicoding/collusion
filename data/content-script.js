self.port.on('log', function log(arguments){
    if (unsafeWindow && unsafeWindow.console){
        unsafeWindow.console.log.call(unsafeWindow, arguments);
    }else{
        console.log('cannot call browser logging: ' + unsafeWindow);
    }
});

self.port.on('connection', function(connection){
    if (unsafeWindow && unsafeWindow.currentVisualization){
        // var connection = JSON.parse(message);
        connection.timestamp = new Date(connection.timestamp);
        unsafeWindow.allConnections.push(connection);
        unsafeWindow.currentVisualization.emit('connection', connection);
    }else{
        console.log('cannot call unsafeWindow.currentVisualization: '  + unsafeWindow);
    }
});

self.port.on('init', function(collusionToken){
    localStorage.collusionToken = collusionToken;
    
    if (unsafeWindow && unsafeWindow.currentVisualization){
        if ( localStorage.connections ){
            unsafeWindow.allConnections = JSON.parse(localStorage.connections);
        }
        unsafeWindow.currentVisualization.emit('init', unsafeWindow.allConnections);
    }else{
        console.log('cannot call unsafeWindow.currentVisualization: ' + unsafeWindow);
    }
});

self.port.on("sendTempConnections", function(message){
    // message is an array of connection objects [ {},{},{} ]
    localStorage.tempConnections = JSON.stringify(message);
    localStorage.tempSize = message.length;
    self.port.emit("tempConnecitonTransferred", true);
    
    var parsedTempConnections = localStorage.tempConnections ? JSON.parse(localStorage.tempConnections) : [ {} ] ;
    if ( localStorage.connections ){
        var paresedConnections = JSON.parse(localStorage.connections);
        localStorage.temp = JSON.stringify(paresedConnections);
        unsafeWindow.allConnections = paresedConnections.concat(parsedTempConnections);
        localStorage.connections = JSON.stringify( paresedConnections.concat(parsedTempConnections) );
    }else{
        localStorage.connections = localStorage.tempConnections;
        unsafeWindow.allConnections = parsedTempConnections;
    }
    localStorage.totalSize = unsafeWindow.allConnections.length;
});


unsafeWindow.addon = self.port;
