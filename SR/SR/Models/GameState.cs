using Microsoft.AspNet.SignalR;
using SR.Controllers;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace SR.Models
{
    public class GameState
    {
        public int CurrentTurn = 0;
        public int MaxTurns = 0;
        public List<string> PlayerReady = new List<string>();
        public List<PlayerModel> Players = new List<PlayerModel>();
        public List<Region> Regions = new List<Region>();
        public PlayerModel GetPlayerFrom(string name)
        {
            foreach (PlayerModel player in Players)
            {
                if (player.House == name)
                {
                    return player;
                }
            }
            return null;
        }
        public void Init()
        {
            foreach(Region reg in Regions)
            {
                reg.ControlledPlayer = GetPlayerFrom(reg.House);
            }
        }
    }
}