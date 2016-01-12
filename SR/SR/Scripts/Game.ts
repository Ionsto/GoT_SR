/// <reference path="typings/jquery/jquery.d.ts"/>

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
    startRound(players:Consensus.Player[]);
}
interface IGameServer {
    sendMoves(moves: Consensus.Move[]);
}
module Consensus {
    export class Player {
        public Name: string;
        public House: string;
        public Score: number;
        public Supply: number;
    }
    export class Move {
        public RegionId: string;
        public MoveType: number;
    }
}
class Region {
    Id: number;
    name: string;
    VertexX: number[];
    VertexY: number[];
}
class World {
    CameraX = 0;
    CameraY = 0;
    CameraWidth = 0;
    CameraHeight = 0;
    MapImage: HTMLImageElement;
    Regions: Region[];
    RenderWorld() {
    }
}
var Canvas: HTMLCanvasElement;
var Ctx: CanvasRenderingContext2D;
var PowerCounter: HTMLDivElement;
var Map: string;
var world: World;
var MapImage: HTMLImageElement;
//Player info
var MyPlayer = new Consensus.Player();
var PlayerUUID = "";
MapImage = new Image();
MapImage.src = "/Resources/Maps/North/Image.png";


function gup(name, url) {
    if (!url) url = location.href;
    name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
    var regexS = "[\\?&]" + name + "=([^&#]*)";
    var regex = new RegExp(regexS);
    var results = regex.exec(url);
    return results == null ? null : results[1];
}
PlayerUUID = gup('PlayerId', document.location.search);
var GameState:number;//0 Planning Phase, 1 Resolving Raids, 2 Resolving Power, 3 Resolving Movements,4 Bidding
PowerCounter = <HTMLDivElement>document.getElementById("PowerCounter");
Canvas = <HTMLCanvasElement>document.getElementById("RenderCanvas");
Ctx = Canvas.getContext("2d");
world = new World();
world.CameraWidth = Canvas.width;
world.CameraHeight = Canvas.height;


gameHub.client.startRound = function (players:Consensus.Player[]) {
    //Update map
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