/// <reference path="typings/jquery/jquery.d.ts"/>
var Canvas: HTMLCanvasElement;
var Ctx: CanvasRenderingContext2D;
var GameState:number;//0 Planning Phase, 1 Resolving Raids, 2 Resolving Power, 3 Resolving Movements,4 Bidding
var CameraX: number;
var CameraY: number;
Canvas = <HTMLCanvasElement>document.getElementById("RenderCanvas");
Ctx = Canvas.getContext("2d");
var CameraWidth = Canvas.width;
var CameraHeight = Canvas.height;
var MapImage: HTMLImageElement;
interface SignalR {
    gameHub: GameHubProxy;
}

interface GameHubProxy {
    client: IGameClient;
    server: IGameServer;
}

interface IGameClient {
    restart();
    startGame();
    lobbyPlayerList(list: string[], house: number[], ready: boolean[]);
}
interface IGameServer {
    sendMoves(moves:Consensus.Move[]);
}
module Consensus {
    export class RegionsUser {
        public Name: string;
        public Email: string;
        public Disconnected: string;
    }
    export class Move {
        public RegionId: string;
        public MoveType: number;
    }
}
var gameHub = $.connection.gameHub;

$.connection.hub.start().done(function () {
    $("#TurnButton").click(function () {
        var MoveList: Consensus.Move[];
        gameHub.server.sendMoves(MoveList);
    });
    console.log('Now connected, connection ID=' + $.connection.hub.id);
}
).fail(function () {
    console.log('Could not Connect!');
});