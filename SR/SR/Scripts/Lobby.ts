/// <reference path="typings/jquery/jquery.d.ts"/>
interface SignalR {
    lobbyHub: LobbyHubProxy;
}

interface LobbyHubProxy {
    client: ILobbyClient;
    server: ILobbyServer;
}

interface ILobbyClient {
    restart();
    startGame();
    lobbyPlayerList(list: string[], house: string[], ready: boolean[]);
}
interface ILobbyServer {
    joinLobby(name: string);
    toggleLobby();
}
module Consensus {
    export class PokerUser {
        public Name: string;
        public Email: string;
        public Disconnected: string;
    }
}
var lobbyProxy = $.connection.lobbyHub;
lobbyProxy.client.startGame = function () {
    document.location.pathname = "Game/Game/?PlayerId=" + $.connection.hub.id;
};
lobbyProxy.client.lobbyPlayerList = function (list: string[], house: string[], ready: boolean[]) {
    //alert("Updateinglobbylud");
    var outputdiv = $("#Output");
    outputdiv.empty();
    for (var i = 0; i < list.length; ++i) {
        var DivTag = "<div>";
        if (i == 0) {
            DivTag = "<div id='LobbyLeader'>";
        }
        outputdiv.append(DivTag + list[i] + ":" + ready[i].toString() + " <img class='banner' width='60' height='60' src= '/Resources/HouseFlags/" + house[i] + ".png'/>" +"</div>");
    }
};
$.connection.hub.start().done(function ()
{
    lobbyProxy.server.joinLobby("Lensto");
    $("#ReadyButton").click(function () {
        lobbyProxy.server.toggleLobby();
    });
    console.log('Now connected, connection ID=' + $.connection.hub.id);
}
).fail(function ()
    {
        console.log('Could not Connect!');
    });