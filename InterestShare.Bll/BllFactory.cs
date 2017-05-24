using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace InterestShare.Bll
{
    public class BllFactory
    {
        public static T GetBLLInstance<T>() where T : BaseBLL
        {
            return System.Activator.CreateInstance<T>();
        }

    }
}
