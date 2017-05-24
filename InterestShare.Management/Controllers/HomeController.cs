using InterestShare.Management.Core;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace InterestShare.Management.Controllers
{
    [Authorize]
    public class HomeController : BaseController
    {
        public ActionResult Index()
        {
            return View();
        }

        public PartialViewResult IndexMenuView()
        {
            var MenuGroup = GetMenuGroup();
            var MenuDetails = GetMenuDetailList();
            ViewData["MenuGroup"] = MenuGroup;
            ViewData["MenuDetails"] = MenuDetails;
            return PartialView("Index_MenuListPartial");
        }
    }
}