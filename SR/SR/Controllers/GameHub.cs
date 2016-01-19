using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Microsoft.AspNet.SignalR;
using SR.Models;
using System.Threading.Tasks;

namespace SR.Controllers
{
    public class ExportPlayer
    {
        public string Name;
        public string PlayerId;
        public string House;
        public int Score;
        public int Supply;
        public int[] Moves;
        public int MaxStarMoves;
    }
    public class ExportMove
    {
        public string RegionId;
        public int MoveType;
    }
    public class GameHub : Hub
    {
        ServerInstance CurrentServer = Startup.server;
        public void RequestGameData()
        {
            Clients.Caller.startGame(CurrentServer.MapName, Context.ConnectionId);
        }
        public void JoinGame(string UUID)
        {
            int FoundPlayer = -1;
            for (int i = 0; i < CurrentServer.PlayerList.Count; ++i)
            {
                if (CurrentServer.PlayerList[i].PlayerId == UUID)
                {
                    FoundPlayer = i;
                    CurrentServer.game.PlayerReady.Add(Context.ConnectionId);
                    break;
                }
            }
            if (FoundPlayer != -1)
            {
                CurrentServer.PlayerList[FoundPlayer].GameId = Context.ConnectionId;
            }
            else
            {
                Clients.Caller.forceOff();
            }
            if (CurrentServer.game.PlayerReady.Count == CurrentServer.PlayerList.Count)
            {
                ExportPlayer[] players = new ExportPlayer[CurrentServer.PlayerList.Count];
                for (int i = 0; i < CurrentServer.PlayerList.Count; ++i)
                {
                    PlayerModel player = CurrentServer.PlayerList[i];
                    players[i] = new ExportPlayer();
                    players[i].Name = player.Name;
                    players[i].PlayerId = Context.ConnectionId;
                    players[i].House = player.House;
                    players[i].Score = player.Score;
                    players[i].Supply = player.Supply;
                    players[i].Moves = new int[] { 2, 1, 2, 1, 2, 1 };
                    players[i].MaxStarMoves = 1;
                }
                CurrentServer.game.PlayerReady.Clear();
                Clients.All.startRound(players, CurrentServer.game.Regions);
                CurrentServer.game.PlayerReady.Clear();
            }
        }
        private void Restart()
        {
            CurrentServer.Restart();
            Clients.All.Restart();
        }
        //Locks in moves
        public void SendMoves(ExportMove[] Moves)
        {
            CurrentServer.game.PlayerReady.Add(Context.ConnectionId);
            if (CurrentServer.game.PlayerReady.Count == CurrentServer.PlayerList.Count)
            {
                Clients.All.startRound(CurrentServer.PlayerList, CurrentServer.game.Regions);
            }
        }
        public override Task OnDisconnected(bool stopped)
        {
            if (CurrentServer.CurrentGameState == ServerInstance.ServerGameState.Game)
            {
                CurrentServer.game.PlayerReady.Remove(Context.ConnectionId);
                //Probs update other players on what is happening
            }
            return (base.OnDisconnected(stopped));
        }
    }
}