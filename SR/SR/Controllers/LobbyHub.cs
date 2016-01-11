using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Microsoft.AspNet.SignalR;
using SR.Models;
using System.Threading.Tasks;
using System.Text.RegularExpressions;

namespace SR.Controllers
{
    public class LobbyHub : Hub
    {

        public void JoinLobby(string name)
        {
            Regex rgx = new Regex("[^a-zA-Z0-9 -]");
            name = rgx.Replace(name, "");
            LobbyModel lobby = Startup.server.lobby;
            PlayerModel player = new PlayerModel();
            player.Name = name;
            player.PlayerId = Context.ConnectionId;
            lobby.PlayerList.Add(player);
            lobby.PlayerReady.Add(Context.ConnectionId, false);
            //Send list of all players
            UpdateLobbyList();
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
            else
            {
                UpdateLobbyList();
            }
        }
        public void RandomiseLobby()
        {
            //Randomise the player's house

        }
        public override Task OnDisconnected(bool stopped)
        {
            LobbyModel lobby = Startup.server.lobby;
            foreach (PlayerModel p in lobby.PlayerList)
            {
                if (p.PlayerId == Context.ConnectionId)
                {
                    lobby.PlayerList.Remove(p);
                    lobby.PlayerReady.Remove(Context.ConnectionId);
                    UpdateLobbyList();
                    break;
                }
            }
            return (base.OnDisconnected(stopped));
        }
        private void UpdateLobbyList()
        {
            LobbyModel lobby = Startup.server.lobby;
            List<string> PlayerNameList = new List<string>();
            List<int> PlayerHouseList = new List<int>();
            List<bool> PlayerReadyList = new List<bool>();
            foreach (PlayerModel p in lobby.PlayerList)
            {
                PlayerNameList.Add(p.Name);
                PlayerHouseList.Add((int)p.House);
                PlayerReadyList.Add(lobby.PlayerReady[p.PlayerId]);
            }
            Clients.All.lobbyPlayerList(PlayerNameList, PlayerHouseList, PlayerReadyList);
        }
    }
}