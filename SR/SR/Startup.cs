using Microsoft.AspNet.SignalR;
using Owin;
using SR.Controllers;
using SR.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace SR
{
    public class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            app.MapSignalR();
        }
    }
}