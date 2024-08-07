namespace Pulse.Server.Models
{
    public class User
    {
        public int Id { get; set; }
        public string? Name { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }

        public string? Image { get; set; }

        //public ICollection<Post>? Posts { get; set; } = null;

        //public ICollection<ChatMessage>? SentMessages { get; set; }

        //public ICollection<ChatMessage>? RecievedMessages { get; set; }

    }
}
