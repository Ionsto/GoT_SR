using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Microsoft.AspNet.SignalR;
using SR.Models;

namespace SR.Controllers
{
    public class GameHub : Hub
    {
        public LobbyModel lobby = new LobbyModel();
        public GameState game = new GameState();
        public void JoinLobby(string name)
        {
            PlayerModel player = new PlayerModel();
            player.PlayerId = Clients.Caller.ConnectionId;
        }
        public void ReadyLobby()
        {
            lobby.PlayerReady[Clients.Caller.ConnectionId] = true;
            if (!lobby.PlayerReady.ContainsValue(false))
            {
                //Start game
                Clients.All.startGame();
            }
        }
        public void UnReadyLobby()
        {
            lobby.PlayerReady[Clients.Caller.ConnectionId] = false;
        }
        public void RandomiseLobby()
        {
            //Randomise the player's house

        }
        private void Restart()
        {
            lobby = new LobbyModel();
            game = new GameState();
            Clients.All.Restart();
        }
    }
}