using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace SR.Controllers
{
    public class GameController : Controller
    {
        // GET: Game
        public ActionResult Index()
        {
            return Lobby();
        }
        public ActionResult Lobby()
        {
            return View();
        }
        public ActionResult Game()
        {
            return View();
        }
    }
}