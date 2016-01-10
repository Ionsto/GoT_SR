using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace SR.Models
{
    public class Region
    {
        List<Enum> Units = new List<Enum>();
        List<Region> AjacentRegions = new List<Region>();
        PlayerModel ControlledPlayer = null;
        Region Bridge = null;
        int Supply = 0;
        int Power = 0;
        int Garrison = 0;
        enum Type {
        Land,Sea
        }
        bool Castle = false;
        bool Citadel = false;
    }
}