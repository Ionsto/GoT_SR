﻿/// <reference path="typings/jquery/jquery.d.ts"/>

interface SignalR {
    gameHub: GameHubProxy;
}

interface GameHubProxy {
    client: IGameClient;
    server: IGameServer;
}

interface IGameClient {
    restart();
    startGame(map: string,pid:string);
    forceOff();
    startRound(players: Consensus.Player[], regions: Consensus.Region[],gamestate:number);
}
interface IGameServer {
    requestGameData();
    joinGame(id: string);
    sendMoves(moves: Consensus.Move[]);
}
module Consensus {
    export class Player {
        public Name: string;
        public PlayerId: string;
        public House: string;
        public Score: number;
        public Supply: number;
        public Moves: number[];
        public MaxStarMoves: number;
    }
    export class Move {
        public RegionId: number;
        public MoveType: string;
    }
    export class Region {
        public House: string;
        public Move: string;
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
    CounterLocation: number[];
    VertexPoints: number[][];
    House: string;
}
class JsonLayout {
    FactionCount: number;
    HouseList: string[];
    RegionCount: number;
    RegionList: JsonRegion[];
}
class ClientRegion {
    Id: number;
    House: string;
    Name: string;
    MoveType: string;
    CounterLocation: number[];
    Verticies: number[][];
    PointInRegion(x, y) {
        return PointInPolly([x, y], this.Verticies);
    }
}
class World {
    MovesLeft = 0;
    MovesStarLeft = 0;
    ConsolidatesLeft = 0;
    ConsolidatesStarLeft = 0;
    RaidsLeft = 0;
    RaidsStarLeft = 0;
    MaxStarMoves = 0;

    LayoutData: JsonLayout;
    GameReadied = false;
    CameraX = 0;
    CameraY = 0;
    CameraWidth = 0;
    CameraHeight = 0;
    MapImage: HTMLImageElement;
    Regions: ClientRegion[];
    Players: Consensus.Player[];
    MyPlayer: Consensus.Player;
    ButtonsDown: Array<boolean>;
    MenuDiv: HTMLDivElement;
    SelectedRegion = -1;
    constructor() {
        this.MenuDiv = <HTMLDivElement>document.getElementById("MenuDiv");
        this.Regions = new Array();
        this.ButtonsDown = new Array < boolean>(3);
        for (var i = 0; i < 3; ++i) {
            this.ButtonsDown[i] = false;
        }
    }
    RenderHouse(region: ClientRegion) {
        if (region.House in FlagImageDictonary) {
            Ctx.drawImage(FlagImageDictonary[region.House], region.CounterLocation[0] - this.CameraX, region.CounterLocation[1] - this.CameraY, 50, 50)
        }
    }
    RenderOrder(region: ClientRegion) {
        if (region.MoveType == "Move") {
            Ctx.drawImage(MoveCounterImage, region.CounterLocation[0] - this.CameraX, region.CounterLocation[1] - this.CameraY)
        }
        if (region.MoveType == "MoveStar") {
            Ctx.drawImage(MoveCounterStarImage, region.CounterLocation[0] - this.CameraX, region.CounterLocation[1] - this.CameraY)
        }
        if (region.MoveType == "Consolidate") {
            Ctx.drawImage(ConsolidateCounterImage, region.CounterLocation[0] - this.CameraX, region.CounterLocation[1] - this.CameraY)
        }
        if (region.MoveType == "ConsolidateStar") {
            Ctx.drawImage(ConsolidateCounterStarImage, region.CounterLocation[0] - this.CameraX, region.CounterLocation[1] - this.CameraY)
        }
        if (region.MoveType == "Raid") {
            Ctx.drawImage(RaidCounterImage, region.CounterLocation[0] - this.CameraX, region.CounterLocation[1] - this.CameraY)
        }
        if (region.MoveType == "RaidStar") {
            Ctx.drawImage(RaidCounterStarImage, region.CounterLocation[0] - this.CameraX, region.CounterLocation[1] - this.CameraY)
        }
    }
    RenderWorld() {
        Ctx.clearRect(0, 0, this.CameraWidth, this.CameraHeight);
        Ctx.drawImage(this.MapImage, -this.CameraX, -this.CameraY);
        for (var region of this.Regions) {
            this.RenderHouse(region);
            this.RenderOrder(region);
        }
    }
    GetRegionWithPoint(x: number, y: number): number {
        for (var i = 0; i < this.Regions.length; ++i) {
            if (this.Regions[i].PointInRegion(x, y)) {
                return i;
            }
        }
        return -1;
    }
}
class RaidTurn
{
    Watching = true;//Wether the player is resolving or not
    RaidRegions: number;
    GreyDiv: HTMLDivElement;
    RaidDiv: HTMLDivElement;
    constructor() {
        this.GreyDiv = <HTMLDivElement>document.getElementById("GreyDiv");
        this.RaidDiv = <HTMLDivElement>document.getElementById("RaidDiv");
        this.GreyDiv.style.visibility = "hidden";
    }
    Start() {
        if (this.Watching) {
            this.GreyDiv.style.animationName = "FadeToVisible";
            this.GreyDiv.style.animationDuration = "5s";
            this.RaidDiv.style.animationName = "FadeToVisible";
            this.RaidDiv.style.animationDuration = "5s";
            this.GreyDiv.style.visibility = "visible";
            this.RaidDiv.style.visibility = "visible";
        }
        //Find if there are raid orders to be played
        for (var i = 0; i < world.Regions.length; ++i) {
            if (world.Regions[i].House == world.MyPlayer.House) {
                if (world.Regions[i].MoveType == "Raid") {
                    ++this.RaidRegions;
                }
            }
        }
    }
    Update()
    {
        if (this.RaidRegions >= 0) {

        }
        if (this.RaidRegions == 0) {

        }
    }
}
function ButtonDownPlanning(event: MouseEvent) {
    if (event.button != 2) {
        world.MenuDiv.style.visibility = "collapse";
        world.SelectedRegion = -1;
    }
}
function ButtonDown(event: MouseEvent) {
    if (GameState == 0) {
        ButtonDownPlanning(event);
    }
    world.ButtonsDown[event.button] = true;
    return false;
}
function UpdateMoveDiv() {
    if (world.MovesLeft <= 0) {
        $("#MoveOrder").css('visibility', 'hidden');
    } else {
        $("#MoveOrder").css('visibility', 'inherit');
    }
    if (world.MovesStarLeft <= 0 || world.MaxStarMoves <= 0) {
        $("#MoveStarOrder").css('visibility', 'hidden');
    } else {
        $("#MoveStarOrder").css('visibility', 'inherit');
    }
    if (world.ConsolidatesLeft <= 0) {
        $("#ConsolidateOrder").css('visibility', 'hidden');
    } else {
        $("#ConsolidateOrder").css('visibility', 'inherit');
    }
    if (world.ConsolidatesStarLeft <= 0 || world.MaxStarMoves <= 0) {
        $("#ConsolidateStarOrder").css('visibility', 'hidden');
    } else {
        $("#ConsolidateStarOrder").css('visibility', 'inherit');
    }
    if (world.RaidsLeft <= 0) {
        $("#RaidOrder").css('visibility', 'hidden');
    } else {
        $("#RaidOrder").css('visibility', 'inherit');
    }
    if (world.RaidsStarLeft <= 0 || world.MaxStarMoves <= 0) {
        $("#RaidStarOrder").css('visibility', 'hidden');
    } else {
        $("#RaidStarOrder").css('visibility', 'inherit');
    }
}
function ButtonClear(event) {
    for (var i = 0; i < 3; ++i) {
        world.ButtonsDown[i] = false;
    }
}
function ButtonUpPlanning(event: MouseEvent) {
    if (world.ButtonsDown[2] && !world.GameReadied) {
        world.MenuDiv.style.visibility = "visible";
        var X = event.pageX - Canvas.offsetLeft;
        var Y = event.pageY - Canvas.offsetTop;
        world.MenuDiv.style.left = (event.pageX).toString() + "px";
        world.MenuDiv.style.top = (event.pageY - (world.MenuDiv.clientHeight/2)).toString() + "px";
        //world.MenuDiv.style.top = Y.toString() + "px";
        for (var i = 0; i < world.MenuDiv.getElementsByClassName("OrderRadio").length; ++i) {
            (<HTMLInputElement>world.MenuDiv.getElementsByClassName("OrderRadio")[i]).checked = false;
        }
        UpdateMoveDiv();
        world.SelectedRegion = world.GetRegionWithPoint(X + world.CameraX, Y + world.CameraY);
    }
}
function ButtonUp(event: MouseEvent) {
    if (GameState == 0) {
        ButtonUpPlanning(event);
    }
    world.ButtonsDown[event.button] = false;
    return false;
}
function DragMap(event: MouseEvent) {
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
var Canvas: HTMLCanvasElement;
var Ctx: CanvasRenderingContext2D;
var PowerCounter: HTMLDivElement;
var MapName: string;
var PlayerId = "";
var world: World;
var RaidTurnObject: RaidTurn;
//Player info
var PlayerUUID = "";

//Init async handerlers
var InitCount = 0;
var WorldMap = new Image();++InitCount;
var LayoutJSON: JsonLayout; ++InitCount;
var FlagImageDictonary = {};

var MoveCounterImage: HTMLImageElement = new Image(); ++InitCount;
var MoveCounterStarImage: HTMLImageElement = new Image(); ++InitCount;
var ConsolidateCounterImage: HTMLImageElement = new Image(); ++InitCount;
var ConsolidateCounterStarImage: HTMLImageElement = new Image(); ++InitCount;
var RaidCounterImage: HTMLImageElement = new Image(); ++InitCount;
var RaidCounterStarImage: HTMLImageElement = new Image(); ++InitCount;

MoveCounterImage.onload = function () { Init("Move Counter"); };
MoveCounterStarImage.onload = function () { Init("Move Star Counter"); };
ConsolidateCounterImage.onload = function () { Init("Consl Counter"); };
ConsolidateCounterStarImage.onload = function () { Init("Consl Star Counter"); };
RaidCounterImage.onload = function () { Init("Raid Counter"); };
RaidCounterStarImage.onload = function () { Init("Raid Star Counter"); };

MoveCounterImage.src = "/Resources/Counters/Move.png";
MoveCounterStarImage.src = "/Resources/Counters/MoveStar.png";
ConsolidateCounterImage.src = "/Resources/Counters/Consolidate.png";
ConsolidateCounterStarImage.src = "/Resources/Counters/ConsolidateStar.png";
RaidCounterImage.src = "/Resources/Counters/Raid.png";
RaidCounterStarImage.src = "/Resources/Counters/RaidStar.png";

function gup(name, url) {
    if (!url) url = location.href;
    name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
    var regexS = "[\\?&]" + name + "=([^&#]*)";
    var regex = new RegExp(regexS);
    var results = regex.exec(url);
    return results == null ? null : results[1];
}
PlayerUUID = gup('PlayerId', document.location.search);
var GameState:number = 0;//0 Planning Phase, 1 Resolving Raids, 2 Resolving Power, 3 Resolving Movements,4 Bidding,
PowerCounter = <HTMLDivElement>document.getElementById("PowerCounter");
Canvas = <HTMLCanvasElement>document.getElementById("RenderCanvas");
Ctx = Canvas.getContext("2d");

var gameHub = $.connection.gameHub;
var MainLoop = null;
function StartPlanning(players: Consensus.Player[], regions: Consensus.Region[]) {
    for (var i = 0; i < world.Players.length; ++i) {
        if (world.Players[i].PlayerId == PlayerId) {
            world.MyPlayer = world.Players[i];
            world.MovesLeft = world.Players[i].Moves[0];
            world.MovesStarLeft = world.Players[i].Moves[1];
            world.ConsolidatesLeft = world.Players[i].Moves[2];
            world.ConsolidatesStarLeft = world.Players[i].Moves[3];
            world.RaidsLeft = world.Players[i].Moves[4];
            world.RaidsStarLeft = world.Players[i].Moves[5];
            world.MaxStarMoves = world.Players[i].MaxStarMoves;
        }
    }
}
function DoRaid(players: Consensus.Player[], regions: Consensus.Region[], RaidPlayer: number) {

}
function StartConsoidate() {
    //Players do 
}
function DoMove() {
    //Done for each player, where then can move one attack
}
function ResolveSupply() {
    //Each time a move is made that could have a supply event
}
gameHub.client.forceOff = function () {
    document.location.pathname = "Game/Denied/";
}

gameHub.client.startRound = function (players: Consensus.Player[], regions: Consensus.Region[], gameState: number) {
    console.log("Start game");
    world.Players = players;
    world.GameReadied = false;
    for (var i = 0; i < regions.length;++i)
    {
        var region = regions[i];
        world.Regions[i].House = region.House;
        world.Regions[i].MoveType = region.Move;
    }
    if (gameState == 0) {
        StartPlanning(players, regions);
        GameState = 0;
    }
    if (gameState == 1) {
        StartPlanning(players, regions);
        GameState = 1;
    }
    if (InitCount == 0) {
        //Update map
        world.RenderWorld();
        if (gameState == 1)
        {
            //alert("Riad");
            RaidTurnObject.Start();
        }
    }
    if (MainLoop == null) {
        MainLoop = setInterval(function () {
            world.RenderWorld();
        }, 50);
    }
}

gameHub.client.startGame = function (map: string, playerid: string) {
    MapName = map;
    PlayerId = playerid;
    WorldMap.onload = function () { Init("World map"); };
    WorldMap.src = "/Resources/Maps/" + MapName + "/Image.png";
    $.getJSON("/Resources/Maps/" + MapName + "/Data.json", function (data) {
        LayoutJSON = data;
        for (var name of LayoutJSON.HouseList) {
            FlagImageDictonary[name] = new Image();
            ++InitCount;
            FlagImageDictonary[name].onload = function () {
            Init("Flag");
            };
            FlagImageDictonary[name].src = "/Resources/HouseFlags/" + name + ".png";
        }
        Init("Layout json");
    });
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
        Canvas.onmousedown = ButtonDown;
        Canvas.onmouseup = ButtonUp;
        Canvas.onmouseleave = ButtonClear;
        Canvas.onmousemove = DragMap;
        Canvas.oncontextmenu = function (e) { return false };
        world.MenuDiv.oncontextmenu = function (e) { return false };
        RaidTurnObject = new RaidTurn();
        $(".OrderRadio").change(function () {
            if (world.SelectedRegion != null && world.MyPlayer.House == world.Regions[world.SelectedRegion].House) {
                var MoveType = $(this).val();
                if (world.Regions[world.SelectedRegion].MoveType == "Move") {
                    world.MovesLeft += 1;
                }
                if (world.Regions[world.SelectedRegion].MoveType == "Consolidate") {
                    world.ConsolidatesLeft += 1;
                }
                if (world.Regions[world.SelectedRegion].MoveType == "Raid") {
                    world.RaidsLeft += 1;
                }
                if (world.Regions[world.SelectedRegion].MoveType == "MoveStar") {
                    world.MovesStarLeft += 1;
                    world.MaxStarMoves += 1;
                }
                if (world.Regions[world.SelectedRegion].MoveType == "ConsolidateStar") {
                    world.ConsolidatesStarLeft += 1;
                    world.MaxStarMoves += 1;
                }
                if (world.Regions[world.SelectedRegion].MoveType == "RaidStar") {
                    world.RaidsStarLeft += 1;
                    world.MaxStarMoves += 1;
                }
                world.Regions[world.SelectedRegion].MoveType = MoveType;
                if (MoveType == "Move") {
                    world.MovesLeft -= 1;
                }
                if (MoveType == "MoveStar") {
                    world.MovesStarLeft -= 1;
                    world.MaxStarMoves -= 1;
                }
                if (MoveType == "Consolidate") {
                    world.ConsolidatesLeft -= 1
                }
                if (MoveType == "ConsolidateStar") {
                    world.ConsolidatesStarLeft -= 1
                    world.MaxStarMoves -= 1;
                }
                if (MoveType == "Raid") {
                    world.RaidsLeft -= 1;
                }
                if (MoveType == "RaidStar") {
                    world.RaidsStarLeft -= 1;
                    world.MaxStarMoves -= 1;
                }
                UpdateMoveDiv();
            }
        });
        for (var i = 0; i < world.LayoutData.RegionCount; ++i) {
            var jsonregion = world.LayoutData.RegionList[i];
            var newregion = new ClientRegion();
            newregion.Verticies = jsonregion.VertexPoints;
            newregion.Name = jsonregion.Name;
            newregion.CounterLocation = jsonregion.CounterLocation;
            newregion.Id = i;
            newregion.House = jsonregion.House;
            world.Regions.push(newregion);
        }
        gameHub.server.joinGame(PlayerUUID);
    }
}

$.connection.hub.start().done(function () {

    $("#TurnButton").click(function () {
        var MoveList: Consensus.Move[] = new Array();
        //Generate moves from js
        for (var region of world.Regions)
        {
            if (region.House == world.MyPlayer.House) {
                var move = new Consensus.Move();
                move.RegionId = region.Id;
                move.MoveType = region.MoveType;
                MoveList.push(move);
            }
        }
        RaidTurnObject.GreyDiv.style.visibility = "visible";
        world.GameReadied = true;
        world.MenuDiv.style.visibility = "collapse";
        world.SelectedRegion = -1;
        gameHub.server.sendMoves(MoveList);
    });
    gameHub.server.requestGameData();
    console.log('Now connected, connection ID=' + $.connection.hub.id);
}
).fail(function () {
    console.log('Could not Connect!');
});