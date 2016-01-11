using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Microsoft.AspNet.SignalR;
using SR.Models;

namespace SR.Controllers
{
    public class LobbyHub : Hub
    {

        public void JoinLobby(string name)
        {
            LobbyModel lobby = Startup.server.lobby;
            PlayerModel player = new PlayerModel();
            player.PlayerId = Context.ConnectionId;
            lobby.PlayerList.Add(player);
            lobby.PlayerReady.Add(Context.ConnectionId, false);
            //Send list of all players
            List<string> PlayerNameList = new List<string>();
            foreach (PlayerModel p in lobby.PlayerList)
            {
                PlayerNameList.Add(p.Name);
            }
            Clients.All.lobbyPlayerList(PlayerNameList);
        }
        public void ToggleLobby()
        {
            LobbyModel lobby = Startup.server.lobby;
            lobby.PlayerReady[Context.ConnectionId] = lobby.PlayerReady[Context.ConnectionId] != true;
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
    }
}