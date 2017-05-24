using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace InterestShare.Management.Models
{
    public class MenuViewModel
    {

        public int MenuGroupID { get; set; }
        public string MenuName { get; set; }

        public string MenuID { get; set; }

        public string Url { get; set; }

        public int Sort { get; set; }

    }
}