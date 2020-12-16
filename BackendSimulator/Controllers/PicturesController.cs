using Microsoft.AspNetCore.Mvc;
using System;
using System.Drawing;
using System.Drawing.Imaging;
using System.IO;
using System.Threading.Tasks;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace BackendSimulator
{
    [Route("api/[controller]")]
    [ApiController]
    public class PicturesController : ControllerBase
    {

        // GET: api/Pictures?productId=3fa85f64-5717-4562-b3fc-2c963f66afa6&minTimeMs=100&maxTimeMs=3000
        [HttpGet()]
        public async Task<ActionResult> GetPictures(Guid productId, int minTimeMs=100, int maxTimeMs=3000)
        {

            var rndTime = new Random(productId.GetHashCode());
            var timeMs = (int)(Math.Pow(rndTime.NextDouble(), 4) * (maxTimeMs - minTimeMs) + minTimeMs);
            var sw = System.Diagnostics.Stopwatch.StartNew();

            using var bmp = new System.Drawing.Bitmap(100, 100);
            using var g = Graphics.FromImage(bmp);

            var rnd = new Random(productId.GetHashCode());

            var bgcolor = Color.FromArgb((byte)rnd.Next(160, 255), (byte)rnd.Next(160, 255), (byte)rnd.Next(160, 255));

            g.Clear(bgcolor);

            Pen pen = new Pen(Color.FromArgb((byte)rnd.Next(0, 128), (byte)rnd.Next(0, 128), (byte)rnd.Next(0, 128)));
            pen.Width = 10;

            //Draw red rectangle to go behind cross
            Rectangle rect = new Rectangle(20, 20, 60, 60);
            g.FillRectangle(new SolidBrush(Color.FromArgb((byte)rnd.Next(0, 128), (byte)rnd.Next(0, 128), (byte)rnd.Next(0, 128))), rect);
            g.DrawEllipse(pen, 20, 20, 60, 60);




            var memStream = new MemoryStream();
            bmp.Save(memStream, ImageFormat.Jpeg);

            var res = File(memStream.ToArray(), "image/jpeg");
            sw.Stop();

            if (timeMs - (int)sw.ElapsedMilliseconds > 0)
                await Task.Delay(timeMs - (int)sw.ElapsedMilliseconds);//*/
            /*if (timeMs - (int)sw.ElapsedMilliseconds > 0)
                System.Threading.Thread.Sleep(timeMs - (int)sw.ElapsedMilliseconds);//*/

            return res;

        }

    }
}
