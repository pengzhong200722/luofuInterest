using System;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.Owin;
using Microsoft.Owin;
using Microsoft.Owin.Security.Cookies;
using Microsoft.Owin.Security.Google;
using Owin;
using System.Configuration;

namespace InterestShare.Management
{
    public partial class Startup
    {
        // For more information on configuring authentication, please visit http://go.microsoft.com/fwlink/?LinkId=301864
        public void ConfigureAuth(IAppBuilder app)
        {
            // Enable the application to use a cookie to store information for the signed in user
            app.UseCookieAuthentication(new CookieAuthenticationOptions
            {
                AuthenticationType = DefaultAuthenticationTypes.ApplicationCookie,
                LoginPath = new PathString("/Account/Login"),
                ExpireTimeSpan = TimeSpan.FromMinutes(ExpireTimeSpan),
                SlidingExpiration = true
            });
        }

        private int ExpireTimeSpan
        {
            get
            {
                var expireTimeSpanString = ConfigurationManager.AppSettings["ExpireTimeSpan"];
                int expireTimeSpan = 60;
                Int32.TryParse(expireTimeSpanString, out expireTimeSpan);
                return expireTimeSpan;
            }
        }
    }
}