namespace Pulse.Server.Models
{
    public class UserChat
    {
        public int UserId { get; set; }
        public User User { get; set; }

        public int ChatMessageId { get; set; }
        public ChatMessage ChatMessage { get; set; }

        public UserChat(int userId, int chatMessageId)
        {
            UserId = userId;
            ChatMessageId = chatMessageId;
        }
    }
}
