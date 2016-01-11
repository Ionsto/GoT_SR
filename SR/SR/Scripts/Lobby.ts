/// <reference path="typings/jquery/jquery.d.ts"/>
interface SignalR {
    gameLobby: HubProxy;
}

interface HubProxy {
    client: ILobbyClient;
    server: ILobbyServer;
}

interface ILobbyClient {
    restart();
}
interface ILobbyServer {
    joinLobby(name: string);
}
module Consensus {
    export class PokerUser {
        public Name: string;
        public Email: string;
        public Disconnected: string;
    }

    export class PokerRoom {
        public Name: string;
        public Topic: string;
        public Users: PokerUser[];
        public Cards: PokerCard[];
    }

    export class PokerCard {
        public User: PokerUser;
        public Value: string;
    }
}

var lobbyProxy = $.connection.gameLobby;
lobbyProxy.client.restart = function () {
    console.log("restart");
};
$.connection.hub.start().done(function ()
{
    alert("connect");
        lobbyProxy.server.joinLobby("Lensto");
        console.log('Now connected, connection ID=' + $.connection.hub.id);
    }
).fail(function ()
    {
        console.log('Could not Connect!');
    });