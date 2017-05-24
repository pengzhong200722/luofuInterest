using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace InterestShare.Management.Models
{
    /// <summary>
    /// 菜单组别视图模型
    /// </summary>
    public class MenuGroupViewModel
    {
        /// <summary>
        /// 分组ID
        /// </summary>
        public int GroupID { get; set; }

        /// <summary>
        /// 分组名称
        /// </summary>
        public string GroupName { get; set; }
    }
}