using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace SR.Models
{
    public class LobbyModel
    {
        public PlayerModel LobbyLeader = null;
        public List<PlayerModel> PlayerList = new List<PlayerModel>();
        public Dictionary<string, bool> PlayerReady = new Dictionary<string, bool>();

    }
}