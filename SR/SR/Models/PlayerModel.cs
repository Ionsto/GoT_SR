using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace SR.Models
{
    public class PlayerModel
    {
        //Connection id from signalR
        string PlayerId;
        enum House
        {
            Stark,Baratheon,Martel,Lanister
        }
        int PowerTokens;
        int Regions;
    }
}