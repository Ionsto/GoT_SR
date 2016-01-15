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
    startGame(map: string);
    forceOff();
    startRound(players: Consensus.Player[], regions: Consensus.Region);
}
interface IGameServer {
    requestGameData();
    joinGame(id: string);
    sendMoves(moves: Consensus.Move[]);
}
module Consensus {
    export class Player {
        public Name: string;
        public House: number;
        public Score: number;
        public Supply: number;
    }
    export class Move {
        public RegionId: string;
        public MoveType: number;
    }
    export class Region {
        public Id: number;
        public Units: number[];
        public Player: number;
    }
}
function PointInPolly(point:number[], vs:number[][]) {
    // ray-casting algorithm based on
    // http://www.ecse.rpi.edu/Homepages/wrf/Research/Short_Notes/pnpoly.html

    var x = point[0], y = point[1];

    var inside = false;
    for (var i = 0, j = vs.length - 1; i < vs.length; j = i++) {
        var xi = vs[i][0], yi = vs[i][1];
        var xj = vs[j][0], yj = vs[j][1];

        var intersect = ((yi > y) != (yj > y))
            && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
        if (intersect) inside = !inside;
    }

    return inside;
};
class JsonRegion {
    Name: string;
    DefenseType: string;
    VertexPoints: number[][];
}
class JsonLayout {
    FactionCount: number;
    FactionList: string[];
    RegionCount: number;
    RegionList: JsonRegion[];
}
class ClientRegion {
    Id: number;
    Name: string;
    Verticies: number[][];
    PointInRegion(x, y) {
        return PointInPolly([x, y], this.Verticies);
    }
}
class World {
    LayoutData: JsonLayout;
    CameraX = 0;
    CameraY = 0;
    CameraWidth = 0;
    CameraHeight = 0;
    MapImage: HTMLImageElement;
    Regions: ClientRegion[];
    ButtonsDown: Array<boolean>;
    MenuDiv: HTMLDivElement;
    constructor() {
        this.MenuDiv = <HTMLDivElement>document.getElementById("MenuDiv");
        this.Regions = new Array();
        this.ButtonsDown = new Array < boolean>(3);
        for (var i = 0; i < 3; ++i) {
            this.ButtonsDown[i] = false;
        }
    }
    RenderWorld() {
        Ctx.clearRect(0, 0, this.CameraWidth, this.CameraHeight);
        Ctx.drawImage(this.MapImage, -this.CameraX, -this.CameraY);
    }
    ButtonDown(event: MouseEvent) {
        //console.log(event.button);
        if (event.button != 2) {
            world.MenuDiv.style.visibility = "collapse";
            world.MenuDiv.setAttribute("Region","-1");
        }
        world.ButtonsDown[event.button] = true;
        return false;
    }
    ButtonClear(event) {
        for (var i = 0; i < 3; ++i) {
            world.ButtonsDown[i] = false;
        }
    }
    GetRegionWithPoint(x: number, y: number): number {
        for (var i = 0; i < this.Regions.length; ++i) {
            if (this.Regions[i].PointInRegion(x, y)) {
                //alert(this.Regions[i].Name);
                return i;
            }
        }
        return -1;
    }
    ButtonUp(event: MouseEvent) {
        if (world.ButtonsDown[2]) {
            world.MenuDiv.style.visibility = "visible";
            var X = event.pageX - Canvas.offsetLeft;
            var Y = event.pageY - Canvas.offsetTop;
            world.MenuDiv.style.left = X.toString() + "px";
            world.MenuDiv.style.top = Y.toString() + "px";
            world.MenuDiv.setAttribute("Region", world.GetRegionWithPoint(X + world.CameraX, Y + world.CameraY).toString());
        } 
        world.ButtonsDown[event.button] = false;
        return false;
    }
    DragMap(event: MouseEvent) {
        if (world.ButtonsDown[0]) {
            world.CameraX -= event.movementX;
            world.CameraY -= event.movementY;
            if (world.CameraX < 0) {
                world.CameraX = 0;
            }
            if (world.CameraY < 0) {
                world.CameraY = 0;
            }
            if (world.CameraX > world.MapImage.width - world.CameraWidth) {
                world.CameraX = world.MapImage.width - world.CameraWidth;
            }
            if (world.CameraY > world.MapImage.height - world.CameraHeight) {
                world.CameraY = world.MapImage.height - world.CameraHeight;
            }
        }
    }
}
var Canvas: HTMLCanvasElement;
var Ctx: CanvasRenderingContext2D;
var PowerCounter: HTMLDivElement;
var MapName: string;
var world: World;
//Player info
var MyPlayer = new Consensus.Player();
var PlayerUUID = "";


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

var gameHub = $.connection.gameHub;
var MainLoop = null;
gameHub.client.forceOff = function () {
    document.location.pathname = "Game/Denied/";
}
gameHub.client.startRound = function (players: Consensus.Player[], regions: Consensus.Region) {
    if (MainLoop == null) {
        MainLoop = setInterval(function () {
            world.RenderWorld();
        }, 50);
    }
    if (InitCount != 0) {
        //Update map
        world.RenderWorld();
    }
}
//Init async handerlers
var InitCount = 0;
var WorldMap = new Image();
var LayoutJSON: JsonLayout;
gameHub.client.startGame = function (map: string) {
    MapName = map;
    InitCount = 2;
    WorldMap.onload = function () { Init("World map"); };
    WorldMap.src = "/Resources/Maps/" + MapName + "/Image.png";
    $.getJSON("/Resources/Maps/" + MapName + "/Data.json", function (data) { LayoutJSON = data; Init("Layout json") });
}
function Init(name) {
    console.log(name + " has loaded");
    if (--InitCount == 0) {
        //Load map
        world = new World();
        world.MapImage = WorldMap;
        world.LayoutData = LayoutJSON;
        world.CameraWidth = Canvas.width;
        world.CameraHeight = Canvas.height;
        Canvas.onmousedown = world.ButtonDown;
        Canvas.onmouseup = world.ButtonUp;
        Canvas.onmouseleave = world.ButtonClear;
        Canvas.onmousemove = world.DragMap;
        Canvas.oncontextmenu = function (e) { return false };
        world.MenuDiv.oncontextmenu = function (e) { return false };
        gameHub.server.joinGame(PlayerUUID);
        for (var i = 0; i < world.LayoutData.RegionCount; ++i) {
            var jsonregion = world.LayoutData.RegionList[i];
            var newregion = new ClientRegion();
            newregion.Verticies = jsonregion.VertexPoints;
            newregion.Name = jsonregion.Name;
            newregion.Id = i;
            world.Regions.push(newregion);
        }
    }
}

$.connection.hub.start().done(function () {

    $("#TurnButton").click(function () {
        var MoveList: Consensus.Move[];
        //Generate moves from js
        gameHub.server.sendMoves(MoveList);
    });
    gameHub.server.requestGameData();
    console.log('Now connected, connection ID=' + $.connection.hub.id);
}
).fail(function () {
    console.log('Could not Connect!');
});