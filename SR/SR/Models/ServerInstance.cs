using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace SR.Models
{
    public class ServerInstance
    {
        public enum ServerGameState
        {
            Lobby,Game
        }
        public ServerGameState CurrentGameState = ServerGameState.Lobby;
        public List<PlayerModel> PlayerList = new List<PlayerModel>();
        public LobbyModel lobby = new LobbyModel();
        public GameState game = new GameState();
        public void Restart()
        {
            lobby = new LobbyModel();
            game = new GameState();
        }
    }
}