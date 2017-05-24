using InterestShare.Bll;
using InterestShare.Bll.Bll;
using InterestShare.Bll.IBll;
using InterestShare.Management.Core;
using InterestShare.Management.Models.SystemModels;
using InterestShare.Model;
using InterestShare.Model.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace InterestShare.Management.Controllers
{
        public class ResourceController : BaseController
        {

            protected IResourceBll ResourceBll
            {
                get
                {
                    return BllFactory.GetBLLInstance<ResourceBll>();
                }
            }
            /// <summary>
            /// 业务系统主页
            /// </summary>
            /// <returns></returns>
            public ActionResult ResourceIndex()
            {
                return View();
            }

            /// <summary>
            /// 分页查询
            /// </summary>
            /// <param name="page"></param>
            /// <param name="rows"></param>
            /// <param name="name">业务系统名称</param>
            /// <param name="code">业务系统编码</param>
            /// <returns></returns>
            public ActionResult GetDataGridDataByCondition(int page, int rows, string name, string code)
            {
                AjaxViewModel<CommonPagedDataViewModel<ResourceModel>> result = new AjaxViewModel<CommonPagedDataViewModel<ResourceModel>>();
                try
                {
                    CommonPagedDataViewModel<ResourceModel> data = ResourceBll.GetResourceByCondition(page, rows, name, code);
                    result = new AjaxViewModel<CommonPagedDataViewModel<ResourceModel>>
                    {
                        isSuccess = true,
                        obj = data
                    };
                }
                catch (Exception ex)
                {

                }
                return Json(result, JsonRequestBehavior.AllowGet);
            }

            /// <summary>
            /// 添加或者修改业务系统
            /// </summary>
            /// <param name="model"></param>
            /// <returns></returns>
            public ActionResult AddOrEditResource(long id = 0)
            {
                ResourceModel model = new ResourceModel();
                if (id > 0)
                {
                    //添加业务系统
                    model = ResourceBll.GetResourceById(id);
                }
                return View(model);
            }

            /// <summary>
            /// 插入业务系统
            /// </summary>
            /// <param name="model"></param>
            /// <returns></returns>
            public JsonResult UpdateResource(ResourceModel model)
            {

                int result = ResourceBll.InsertResource(model);
                if (result > 0)
                {
                    return Json(new AjaxViewModel
                    {
                        isSuccess = true
                    });
                }
                return Json(new AjaxViewModel
                {
                    isSuccess = false
                });
            }

            /// <summary>
            /// 插入业务系统
            /// </summary>
            /// <param name="model"></param>
            /// <returns></returns>
            public int DeleteResource(long id)
            {
                return ResourceBll.DeleteResource(id);
            }
        }
    }
