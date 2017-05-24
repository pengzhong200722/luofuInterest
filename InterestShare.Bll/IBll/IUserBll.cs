using InterestShare.Model.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace InterestShare.Bll.IBll
{
    public interface IUserBll
    {
        User Query(string account);
        User Query(string account,string password);
    }
}
