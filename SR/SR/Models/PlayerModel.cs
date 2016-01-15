using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace SR.Models
{
    public class PlayerModel
    {
        //Connection id from signalR
        public string PlayerId = "";
        //Connection id from signalR for connection to game hub
        public string GameId = "";
        public string Name = "lensto";
        public int Score = 0;
        public int Supply = 0;
        public enum HouseType
        {
            Stark,Baratheon,Martel,Lanister
        }
        public HouseType House = HouseType.Stark;
        public int PowerTokens;
        public int Regions;
    }
}