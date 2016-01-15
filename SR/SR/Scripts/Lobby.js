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
    document.location.pathname = "Game/Game/?PlayerId=" + $.connection.hub.id;
};
lobbyProxy.client.lobbyPlayerList = function (list, house, ready) {
    var outputdiv = $("#Output");
    outputdiv.empty();
    var ResUrl = "/Resources/HouseFlags/sterk.png";
    for (var i = 0; i < list.length; ++i) {
        var DivTag = "<div>";
        if (i == 0) {
            DivTag = "<div id='LobbyLeader'>";
        }
        outputdiv.append(DivTag + list[i] + ":" + ready[i].toString() + "<img class='banner' width='60' height='60' src= '" + ResUrl + "'/>" + "</div>");
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
