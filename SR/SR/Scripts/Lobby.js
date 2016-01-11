/// <reference path="typings/jquery/jquery.d.ts"/>
var Consensus;
(function (Consensus) {
    var PokerUser = (function () {
        function PokerUser() {
        }
        return PokerUser;
    })();
    Consensus.PokerUser = PokerUser;
    var PokerRoom = (function () {
        function PokerRoom() {
        }
        return PokerRoom;
    })();
    Consensus.PokerRoom = PokerRoom;
    var PokerCard = (function () {
        function PokerCard() {
        }
        return PokerCard;
    })();
    Consensus.PokerCard = PokerCard;
})(Consensus || (Consensus = {}));
var lobbyProxy = $.connection.gameLobby;
lobbyProxy.client.restart = function () {
    console.log("restart");
};
$.connection.hub.start().done(function () {
    alert("connect");
    lobbyProxy.server.joinLobby("Lensto");
    console.log('Now connected, connection ID=' + $.connection.hub.id);
}).fail(function () {
    console.log('Could not Connect!');
});
//# sourceMappingURL=Lobby.js.map