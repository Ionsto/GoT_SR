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
    lobbyPlayerList(list:Array<string>);
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
    document.location.pathname = "Game/Game/"
};
lobbyProxy.client.lobbyPlayerList = function (list: Array<string>) {
    var outputdiv = $("#Output");
    outputdiv.empty();
    for (var name in list) {
        outputdiv.add("<p>" + name + "</p>");
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