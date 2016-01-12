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
})(Consensus || (Consensus = {}));
var Region = (function () {
    function Region() {
    }
    return Region;
})();
var World = (function () {
    function World() {
        this.CameraX = 0;
        this.CameraY = 0;
        this.CameraWidth = 0;
        this.CameraHeight = 0;
    }
    World.prototype.RenderWorld = function () {
    };
    return World;
})();
var Canvas;
var Ctx;
var PowerCounter;
var Map;
var world;
var MapImage;
//Player info
var MyPlayer = new Consensus.Player();
var PlayerUUID = "";
MapImage = new Image();
MapImage.src = "/Resources/Maps/North/Image.png";
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
world = new World();
world.CameraWidth = Canvas.width;
world.CameraHeight = Canvas.height;
gameHub.client.startRound = function (players) {
    //Update map
};
var gameHub = $.connection.gameHub;
$.connection.hub.start().done(function () {
    $("#TurnButton").click(function () {
        var MoveList;
        gameHub.server.sendMoves(MoveList);
    });
    console.log('Now connected, connection ID=' + $.connection.hub.id);
}).fail(function () {
    console.log('Could not Connect!');
});
