﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Microsoft.AspNet.SignalR;
using SR.Models;
using System.Threading.Tasks;

namespace SR.Controllers
{
    class ExportPlayer
    {
        public string Name;
        public string PlayerId;
        public int House;
        public int Score;
        public int Supply;
        public int[] Moves;
    }
    class ExportMove
    {
        public string RegionId;
        public int MoveType;
    }
    public class GameHub : Hub
    {
        ServerInstance CurrentServer = Startup.server;
        public void RequestGameData()
        {
            Clients.Caller.startGame(CurrentServer.game.MapName,Context.ConnectionId);
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
                for(int i = 0;i < CurrentServer.PlayerList.Count;++i)
                {
                    PlayerModel player = CurrentServer.PlayerList[i];
                    players[i] = new ExportPlayer();
                    players[i].Name = player.Name;
                    players[i].PlayerId = Context.ConnectionId;
                    players[i].House = (int)player.House;
                    players[i].Score = player.Score;
                    players[i].Supply = player.Supply;
                    players[i].Moves = new int[]{2,1,2,1,2};
                }
                Clients.Caller.startRound(players);
                CurrentServer.game.PlayerReady.Clear();
            }
        }
        private void Restart()
        {
            CurrentServer.Restart();
            Clients.All.Restart();
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