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
        ServerInstance CurrentServer = Startup.server;
        public void JoinLobby(string name)
        {
            if (CurrentServer.CurrentGameState == ServerInstance.ServerGameState.Lobby)
            {
                Regex rgx = new Regex("[^a-zA-Z0-9 -]");
                name = rgx.Replace(name, "");
                LobbyModel lobby = Startup.server.lobby;
                PlayerModel player = new PlayerModel();
                player.Name = name;
                player.PlayerId = Context.ConnectionId;
                CurrentServer.PlayerList.Add(player);
                CurrentServer.lobby.PlayerReady.Add(Context.ConnectionId, false);
                if (CurrentServer.PlayerList.Count == 1)
                {
                    CurrentServer.lobby.LobbyLeader = CurrentServer.PlayerList[0];
                }
                //Send list of all players
                UpdateLobbyList();
            }
        }
        public void ToggleLobby()
        {
            LobbyModel lobby = Startup.server.lobby;
            lobby.PlayerReady[Context.ConnectionId] = lobby.PlayerReady[Context.ConnectionId] != true;
            if (!lobby.PlayerReady.ContainsValue(false))
            {
                //Start game
                CurrentServer.CurrentGameState = ServerInstance.ServerGameState.Game;
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
            if (CurrentServer.CurrentGameState == ServerInstance.ServerGameState.Lobby)
            {
                foreach (PlayerModel p in CurrentServer.PlayerList)
                {
                    if (p.PlayerId == Context.ConnectionId)
                    {
                        CurrentServer.PlayerList.Remove(p);
                        CurrentServer.lobby.PlayerReady.Remove(Context.ConnectionId);
                        if (CurrentServer.PlayerList.Count > 0)
                        {
                            CurrentServer.lobby.LobbyLeader = CurrentServer.PlayerList[0];
                        }
                        UpdateLobbyList();
                        break;
                    }
                }
            }
            return (base.OnDisconnected(stopped));
        }
        private void UpdateLobbyList()
        {
            LobbyModel lobby = CurrentServer.lobby;
            List<string> PlayerNameList = new List<string>();
            List<int> PlayerHouseList = new List<int>();
            List<bool> PlayerReadyList = new List<bool>();
            foreach (PlayerModel p in CurrentServer.PlayerList)
            {
                PlayerNameList.Add(p.Name);
                PlayerHouseList.Add((int)p.House);
                PlayerReadyList.Add(lobby.PlayerReady[p.PlayerId]);
            }
            Clients.All.lobbyPlayerList(PlayerNameList, PlayerHouseList, PlayerReadyList);
        }
    }
}