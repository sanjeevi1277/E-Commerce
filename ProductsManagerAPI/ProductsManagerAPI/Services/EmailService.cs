using Microsoft.AspNetCore.Mvc;
using System.Net.Mail;
using System.Net;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.UI.Services;
using ProductsManagerAPI.Interface;

namespace ProductsManagerAPI.Services
{
    public class EmailService :IEmail
    {
        public void SendMail(string? url , string? to )
        {
            string MachineName2 = Dns.GetHostName();
            MailMessage mail = new MailMessage();
            mail.To.Add("sanjeevi3035@gmail.com");
            mail.From = new MailAddress("sanjeevi3035@gmail.com", "Email head", System.Text.Encoding.UTF8);
            mail.Subject = "This mail is send from asp.net application";
            mail.SubjectEncoding = System.Text.Encoding.UTF8;
            mail.Body = $"Your login in the device name: {MachineName2}";
            mail.Body = $"here; {url}";
            mail.BodyEncoding = System.Text.Encoding.UTF8;
            mail.IsBodyHtml = true;
            mail.Priority = MailPriority.High;
            SmtpClient client = new SmtpClient();
            client.Credentials = new System.Net.NetworkCredential("sanjeevi3035@gmail.com", "dovf thrw qplp jytk");
            client.Port = 587;
            client.Host = "smtp.gmail.com";
            client.EnableSsl = true;


            client.Send(mail);
        }
    }
}
