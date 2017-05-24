using InterestShare.Bll.IBll;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using InterestShare.Model.Models;
using InterestShareDal.IDal;
using InterestShareDal;
using InterestShareDal.Dal;
namespace InterestShare.Bll.Bll
{
    public class UserBll : BaseBLL, IUserBll
    {
        public IUserDal UserDAL
        {
            get
            {
                return DalFactory.GetDalInstance<UserDal>();
            }
        }
        public User Query(string account)
        {
            return UserDAL.Query(account);
        }

        public User Query(string account, string password)
        {
            User model = new User();
            try
            {
                string sqlWher = "";
                sqlWher += " and Account=@Account and and Password=@Password ";
                var user = UserDAL.QueryList(sqlWher, new { Account = account, Password = password });
                if (user != null && user.Count > 0)
                {
                    model = user[0];
                }
            }
            catch (Exception ex)
            {
                return null;
            }
            return model;
        }
    }
}
