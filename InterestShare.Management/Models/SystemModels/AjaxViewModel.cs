using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace InterestShare.Management.Models.SystemModels
{
    public class AjaxViewModel
    {
        public AjaxViewModel()
        {
            this.isSuccess = false;
        }

        public bool isSuccess { get; set; }

        public string message { get; set; }

        public static AjaxViewModel Success()
        {
            return new AjaxViewModel { isSuccess = true };
        }
    }

    public class AjaxViewModel<T> : AjaxViewModel where T : class
    {
        public T obj { get; set; }
    }
}