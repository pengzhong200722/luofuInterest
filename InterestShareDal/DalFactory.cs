using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace InterestShareDal
{
    public class DalFactory
    {
        public static T GetDalInstance<T>() where T : BaseDAL
        {
            return System.Activator.CreateInstance<T>();
        }
    }
}
