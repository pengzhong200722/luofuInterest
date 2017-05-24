using InterestShare.Management.Models;
using luofu_InterestShare.Common;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace InterestShare.Management.Core
{
    public class BaseController : Controller
    {

        /// <summary>
        /// Mapping工具
        /// </summary>
        private IMapper _mapper;
        public IMapper Mapper
        {
            get
            {
                if (null == _mapper)
                {
                    _mapper = MapperUtil.GetMapper();
                }
                return _mapper;
            }
        }

        public BaseController()
        {
  
        }




        public List<MenuGroupViewModel> GetMenuGroup()
        {

            List<MenuGroupViewModel> menuGroup = new List<MenuGroupViewModel>();
            menuGroup.Add(new MenuGroupViewModel { GroupID=1,GroupName="电影资源管理"});
            return menuGroup;
        }

        public List<MenuViewModel> GetMenuDetailList()
        {
            List<MenuViewModel> menuDetail = new List<MenuViewModel>();
            menuDetail.Add(new MenuViewModel { MenuGroupID =1,MenuID="1",MenuName="电影资源",Url= "/Resource/ResourceIndex" });
            return menuDetail;
        }

        public List<string> AuthrizedUrl
        {
            get { return new List<string>(); }
        }

        /// <summary>
        /// 重写Controller的OnActionExecuting方法，拦截Action的执行，进行自定义处理
        /// </summary>
        /// <param name="filterContext">上下文</param>
        protected override void OnActionExecuting(ActionExecutingContext filterContext)
        {
            if (AuthrizedUrl.Count > 0)
            {
                string controller = RouteData.Values["controller"].ToString().ToLower();
                //string action = RouteData.Values["action"].ToString().ToLower();
                string url = controller;
                if (!controller.Equals("home"))
                {
                    var isHavePageAuhtor = false;
                    if (AuthrizedUrl.Any(m => m.Contains(url)))
                    {
                        isHavePageAuhtor = true;
                    }

                    //没有此页面权限
                    if (!isHavePageAuhtor)
                    {
                        filterContext.Controller.ViewData["ErrorMessage"] = "对不起，您没有此页面的访问权限！";
                        filterContext.Result = new ViewResult()
                        {
                            ViewName = "Error",
                            ViewData = filterContext.Controller.ViewData,
                        };
                    }

                }
            }
        }
    }
}