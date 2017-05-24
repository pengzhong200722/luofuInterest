using InterestShare.Model.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace InterestShareDal.IDal
{
    public interface IUserDal
    {
         User Query(string account);
        List<User> QueryList(string conditions, object conditionValues);
    }
}
