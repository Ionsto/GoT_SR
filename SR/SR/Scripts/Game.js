/// <reference path="typings/jquery/jquery.d.ts"/>
var Canvas;
var Ctx;
var GameState; //0 Planning Phase, 1 Resolving Raids, 2 Resolving Power, 3 Resolving Movements,4 Bidding
var CameraX;
var CameraY;
Canvas = document.getElementById("RenderCanvas");
Ctx = Canvas.getContext("2d");
var CameraWidth = Canvas.width;
var CameraHeight = Canvas.height;
var MapImage;
var Consensus;
(function (Consensus) {
    var RegionsUser = (function () {
        function RegionsUser() {
        }
        return RegionsUser;
    })();
    Consensus.RegionsUser = RegionsUser;
    var Move = (function () {
        function Move() {
        }
        return Move;
    })();
    Consensus.Move = Move;
})(Consensus || (Consensus = {}));
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
