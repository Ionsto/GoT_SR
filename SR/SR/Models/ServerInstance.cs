using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Web;

namespace SR.Models
{
    public class ServerInstance
    {
        public enum ServerGameState
        {
            Lobby, Game
        }
        public int MaxPlayers = 2;
        public List<string> Houses = new List<string>();
        public string MapName = "North";
        public ServerGameState CurrentGameState = ServerGameState.Lobby;
        public List<PlayerModel> PlayerList = new List<PlayerModel>();
        public LobbyModel lobby = new LobbyModel();
        public GameState game = new GameState();
        public ServerInstance()
        {
            Restart();
        }
        public void Restart()
        {
            lobby = new LobbyModel();
            game = new GameState();
            //Read json
            JObject json = JObject.Parse(File.ReadAllText(HttpRuntime.AppDomainAppPath + "./Resources/Maps/" + MapName + "/Data.json"));
            this.MaxPlayers = (int)json.GetValue("FactionCount");
            foreach (string houses in json.GetValue("HouseList"))
            {
                this.Houses.Add(houses);
                this.lobby.HousesLeft.Add(houses);
            }
            foreach (JToken regions in json.GetValue("RegionList"))
            {
                    Region newreg = new Region();
                newreg.House = regions.Value<string>("House");
                game.Regions.Add(newreg);
                
            }
        }
    }
}