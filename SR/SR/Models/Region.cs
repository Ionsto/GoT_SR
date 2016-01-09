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
        int Supply = 0;
        int Power = 0;
        int Garrison = 0;
        bool Castle = false;
        bool Citadel = false;
    }
}