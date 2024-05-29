using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.UI.Services;

namespace ProductsManagerAPI.Interface
{
    public interface IEmail
    {
        void SendMail(string url="",string to="");
    }
}
