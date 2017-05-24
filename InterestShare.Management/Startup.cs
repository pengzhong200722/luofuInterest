using Microsoft.Owin;
using Owin;

[assembly: OwinStartupAttribute(typeof(InterestShare.Management.Startup))]
namespace InterestShare.Management
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            ConfigureAuth(app);
        }
    }
}
