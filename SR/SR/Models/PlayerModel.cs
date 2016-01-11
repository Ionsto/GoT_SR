using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace SR.Models
{
    public class PlayerModel
    {
        //Connection id from signalR
        public string PlayerId;
        public string Name;
        public enum HouseType
        {
            Stark,Baratheon,Martel,Lanister
        }
        public HouseType House = HouseType.Stark;
        public int PowerTokens;
        public int Regions;
    }
}