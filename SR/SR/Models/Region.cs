using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace SR.Models
{
    public class Region
    {
        public List<Enum> Units = new List<Enum>();
        public List<Region> AjacentRegions = new List<Region>();
        public PlayerModel ControlledPlayer = null;
        public string House = "";
        public Region Bridge = null;
        public int Supply = 0;
        public int Power = 0;
        public int Garrison = 0;
        public string Move = "";
        enum Type {
        Land,Sea
        }
        bool Castle = false;
        bool Citadel = false;
    }
}