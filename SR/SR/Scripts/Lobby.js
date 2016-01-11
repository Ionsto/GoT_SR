/// <reference path="typings/jquery/jquery.d.ts"/>
var Consensus;
(function (Consensus) {
    var PokerUser = (function () {
        function PokerUser() {
        }
        return PokerUser;
    })();
    Consensus.PokerUser = PokerUser;
})(Consensus || (Consensus = {}));
var lobbyProxy = $.connection.lobbyHub;
lobbyProxy.client.startGame = function () {
    document.location.pathname = "Game/Game/";
};
lobbyProxy.client.lobbyPlayerList = function (list) {
    var outputdiv = $("#Output");
    outputdiv.empty();
    for (var name in list) {
        outputdiv.add("<p>" + name + "</p>");
    }
};
$.connection.hub.start().done(function () {
    lobbyProxy.server.joinLobby("Lensto");
    $("#ReadyButton").click(function () {
        lobbyProxy.server.toggleLobby();
    });
    console.log('Now connected, connection ID=' + $.connection.hub.id);
}).fail(function () {
    console.log('Could not Connect!');
});
//# sourceMappingURL=Lobby.js.map