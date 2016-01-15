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
    lobbyPlayerList(list: string[], house: number[], ready: boolean[]);
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
lobbyProxy.client.lobbyPlayerList = function (list: string[], house:number[], ready:boolean[]) {
    var outputdiv = $("#Output");
    outputdiv.empty();
    var ResUrl = "/Resources/HouseFlags/sterk.png";
    for (var i = 0; i < list.length; ++i) {
        var DivTag = "<div>";
        if (i == 0) {
            DivTag = "<div id='LobbyLeader'>";
        }
        outputdiv.append(DivTag + list[i] + ":" + ready[i].toString() + "<img class='banner' width='60' height='60' src= '" + ResUrl + "'/>" +"</div>");
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