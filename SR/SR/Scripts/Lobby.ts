var $;
var lobbyProxy = $.connection.gameLobby;
lobbyProxy.client.restart = function () {
    console.log("restart");
};
$.connection.hub.start()
    .done(function () {
        lobbyProxy.server.joinLobby("Lensto");
        console.log('Now connected, connection ID=' + $.connection.hub.id);
    })
    .fail(function () { console.log('Could not Connect!'); });
});