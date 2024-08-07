using System.ComponentModel.DataAnnotations.Schema;

namespace Pulse.Server.Models


{
    public class ChatMessage
    {
        public int Id { get; set; }
        public string Message { get; set; }

        public int SenderId { get; set; } // Foreign key for user sending message
        
        public User? Sender { get; set; }

        public int RecipientId { get; set; } // Foreign key for message recipient

        public User? Recipient { get; set; }

    }
}
