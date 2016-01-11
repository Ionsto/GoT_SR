﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Microsoft.AspNet.SignalR;
using SR.Models;

namespace SR.Controllers
{
    public class GameHub : Hub
    {
        public void JoinLobby(string name)
        {
            PlayerModel player = new PlayerModel();
            player.PlayerId = Context.ConnectionId;
            Startup.server.lobby.PlayerList.Add(player);
            Startup.server.lobby.PlayerReady.Add(Context.ConnectionId, false);
        }
        public void ToggleLobby()
        {
            LobbyModel lobby = Startup.server.lobby;
            if (!lobby.PlayerReady.ContainsKey(Context.ConnectionId))
            {
                lobby.PlayerReady.Add(Context.ConnectionId, false);
            }
            lobby.PlayerReady[Context.ConnectionId] = lobby.PlayerReady[Context.ConnectionId] !=  true;
            if (!lobby.PlayerReady.ContainsValue(false))
            {
                //Start game
                Clients.All.startGame();
            }
        }
        public void RandomiseLobby()
        {
            //Randomise the player's house

        }
        private void Restart()
        {
            Startup.server.Restart();
            Clients.All.Restart();
        }
    }
}