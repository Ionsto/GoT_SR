/// <reference path="typings/jquery/jquery.d.ts"/>
var Consensus;
(function (Consensus) {
    var Player = (function () {
        function Player() {
        }
        return Player;
    })();
    Consensus.Player = Player;
    var Move = (function () {
        function Move() {
        }
        return Move;
    })();
    Consensus.Move = Move;
    var Region = (function () {
        function Region() {
        }
        return Region;
    })();
    Consensus.Region = Region;
})(Consensus || (Consensus = {}));
function PointInPolly(point, vs) {
    // ray-casting algorithm based on
    // http://www.ecse.rpi.edu/Homepages/wrf/Research/Short_Notes/pnpoly.html
    var x = point[0], y = point[1];
    var inside = false;
    for (var i = 0, j = vs.length - 1; i < vs.length; j = i++) {
        var xi = vs[i][0], yi = vs[i][1];
        var xj = vs[j][0], yj = vs[j][1];
        var intersect = ((yi > y) != (yj > y))
            && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
        if (intersect)
            inside = !inside;
    }
    return inside;
}
;
var JsonRegion = (function () {
    function JsonRegion() {
    }
    return JsonRegion;
})();
var JsonLayout = (function () {
    function JsonLayout() {
    }
    return JsonLayout;
})();
var ClientRegion = (function () {
    function ClientRegion() {
    }
    ClientRegion.prototype.PointInRegion = function (x, y) {
        return PointInPolly([x, y], this.Verticies);
    };
    return ClientRegion;
})();
var World = (function () {
    function World() {
        this.MovesLeft = 0;
        this.MovesStar = 0;
        this.ConsolidatesLeft = 0;
        this.ConsolidatesStar = 0;
        this.RaidsLeft = 0;
        this.RaidsStar = 0;
        this.CameraX = 0;
        this.CameraY = 0;
        this.CameraWidth = 0;
        this.CameraHeight = 0;
        this.MyPlayer = 0;
        this.SelectedRegion = -1;
        this.MenuDiv = document.getElementById("MenuDiv");
        this.Regions = new Array();
        this.ButtonsDown = new Array(3);
        for (var i = 0; i < 3; ++i) {
            this.ButtonsDown[i] = false;
        }
    }
    World.prototype.RenderWorld = function () {
        Ctx.clearRect(0, 0, this.CameraWidth, this.CameraHeight);
        Ctx.drawImage(this.MapImage, -this.CameraX, -this.CameraY);
        for (var _i = 0, _a = this.Regions; _i < _a.length; _i++) {
            var region = _a[_i];
            if (region.MoveType == "Move") {
                Ctx.drawImage(MoveCounterImage, region.CounterLocation[0] - this.CameraX, region.CounterLocation[1] - this.CameraY);
            }
            if (region.MoveType == "Consolidate") {
                Ctx.drawImage(ConsolidateCounterImage, region.CounterLocation[0] - this.CameraX, region.CounterLocation[1] - this.CameraY);
            }
            if (region.MoveType == "Raid") {
                Ctx.drawImage(RaidCounterImage, region.CounterLocation[0] - this.CameraX, region.CounterLocation[1] - this.CameraY);
            }
        }
    };
    World.prototype.GetRegionWithPoint = function (x, y) {
        for (var i = 0; i < this.Regions.length; ++i) {
            if (this.Regions[i].PointInRegion(x, y)) {
                //alert(this.Regions[i].Name);
                return i;
            }
        }
        return -1;
    };
    return World;
})();
function ButtonDown(event) {
    //console.log(event.button);
    if (event.button != 2) {
        world.MenuDiv.style.visibility = "collapse";
        world.SelectedRegion = -1;
    }
    world.ButtonsDown[event.button] = true;
    return false;
}
function ButtonClear(event) {
    for (var i = 0; i < 3; ++i) {
        world.ButtonsDown[i] = false;
    }
}
function ButtonUp(event) {
    if (world.ButtonsDown[2]) {
        world.MenuDiv.style.visibility = "visible";
        var X = event.pageX - Canvas.offsetLeft;
        var Y = event.pageY - Canvas.offsetTop;
        world.MenuDiv.style.left = X.toString() + "px";
        world.MenuDiv.style.top = Y.toString() + "px";
        for (var i = 0; i < world.MenuDiv.getElementsByClassName("OrderRadio").length; ++i) {
            world.MenuDiv.getElementsByClassName("OrderRadio")[i].checked = false;
        }
        world.SelectedRegion = world.GetRegionWithPoint(X + world.CameraX, Y + world.CameraY);
    }
    world.ButtonsDown[event.button] = false;
    return false;
}
function DragMap(event) {
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
var Canvas;
var Ctx;
var PowerCounter;
var MapName;
var PlayerId = "";
var world;
//Player info
var PlayerUUID = "";
var InitCount = 5;
var WorldMap = new Image();
var LayoutJSON;
var MoveCounterImage = new Image();
var ConsolidateCounterImage = new Image();
var RaidCounterImage = new Image();
MoveCounterImage.onload = function () { Init("Move Counter"); };
ConsolidateCounterImage.onload = function () { Init("Consl Counter"); };
RaidCounterImage.onload = function () { Init("Raid Counter"); };
MoveCounterImage.src = "/Resources/Counters/Move.png";
ConsolidateCounterImage.src = "/Resources/Counters/Consolidate.png";
RaidCounterImage.src = "/Resources/Counters/Raid.png";
function gup(name, url) {
    if (!url)
        url = location.href;
    name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
    var regexS = "[\\?&]" + name + "=([^&#]*)";
    var regex = new RegExp(regexS);
    var results = regex.exec(url);
    return results == null ? null : results[1];
}
PlayerUUID = gup('PlayerId', document.location.search);
var GameState; //0 Planning Phase, 1 Resolving Raids, 2 Resolving Power, 3 Resolving Movements,4 Bidding
PowerCounter = document.getElementById("PowerCounter");
Canvas = document.getElementById("RenderCanvas");
Ctx = Canvas.getContext("2d");
var gameHub = $.connection.gameHub;
var MainLoop = null;
gameHub.client.forceOff = function () {
    document.location.pathname = "Game/Denied/";
};
gameHub.client.startRound = function (players, regions) {
    world.Players = players;
    for (var i = 0; i < world.Players.length; ++i) {
        if (world.Players[i].PlayerId == PlayerId) {
            world.MyPlayer = i;
            world.MovesLeft = world.Players[i].Moves[0];
            world.MovesStar = world.Players[i].Moves[1];
            world.ConsolidatesLeft = world.Players[i].Moves[2];
            world.ConsolidatesStar = world.Players[i].Moves[3];
        }
    }
    if (MainLoop == null) {
        MainLoop = setInterval(function () {
            world.RenderWorld();
        }, 50);
    }
    if (InitCount != 0) {
        //Update map
        world.RenderWorld();
    }
};
//Init async handerlers
gameHub.client.startGame = function (map, playerid) {
    MapName = map;
    PlayerId = playerid;
    WorldMap.onload = function () { Init("World map"); };
    WorldMap.src = "/Resources/Maps/" + MapName + "/Image.png";
    $.getJSON("/Resources/Maps/" + MapName + "/Data.json", function (data) { LayoutJSON = data; Init("Layout json"); });
};
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
        Canvas.oncontextmenu = function (e) { return false; };
        world.MenuDiv.oncontextmenu = function (e) { return false; };
        $(".OrderRadio").change(function () {
            if (world.SelectedRegion != null) {
                var MoveType = $(this).val();
                world.Regions[world.SelectedRegion].MoveType = MoveType;
                if (MoveType == "Move") {
                    world.MovesLeft -= 1;
                    if (world.MovesLeft <= 0) {
                        alert("Move final");
                        $("#MoveOrder").children().hide();
                        $("#MoveOrder").children(".OrderRadio").css("display") = "block";
                    }
                }
            }
        });
        gameHub.server.joinGame(PlayerUUID);
        for (var i = 0; i < world.LayoutData.RegionCount; ++i) {
            var jsonregion = world.LayoutData.RegionList[i];
            var newregion = new ClientRegion();
            newregion.Verticies = jsonregion.VertexPoints;
            newregion.Name = jsonregion.Name;
            newregion.CounterLocation = jsonregion.CounterLocation;
            newregion.Id = i;
            world.Regions.push(newregion);
        }
    }
}
$.connection.hub.start().done(function () {
    $("#TurnButton").click(function () {
        var MoveList;
        //Generate moves from js
        gameHub.server.sendMoves(MoveList);
    });
    gameHub.server.requestGameData();
    console.log('Now connected, connection ID=' + $.connection.hub.id);
}).fail(function () {
    console.log('Could not Connect!');
});
