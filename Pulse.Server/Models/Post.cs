using System.ComponentModel.DataAnnotations.Schema;

namespace Pulse.Server.Models
{
    public class Post
    {
        public int Id { get; set; }

        public string Content { get; set; }

        public string? ImageLink { get; set; }

        public int UserId { get; set; }

        public User? User { get; set; }
    }
}
