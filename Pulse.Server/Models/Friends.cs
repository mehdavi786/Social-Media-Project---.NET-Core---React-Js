namespace Pulse.Server.Models
{
    public class Friends
    {
        public int Id { get; set; }
        public int UserId { get; set; } // Foreign key for user sending message

        public User? User { get; set; }

        public int FriendId { get; set; } // Foreign key for message recipient

        public User? Friend { get; set; }
    }
}
