using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace SR.Controllers
{
    public class GameUIController : Controller
    {
        // GET: GameUI
        public ActionResult Index()
        {
            return View();
        }
    }
}