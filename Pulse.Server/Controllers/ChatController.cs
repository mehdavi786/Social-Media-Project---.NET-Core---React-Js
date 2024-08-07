using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Hosting;
using Pulse.Server.Data;
//using Pulse.Server.Hubs;
using Pulse.Server.Models;

namespace Pulse.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ChatController : ControllerBase
    {
        private readonly PulseServerContext _context;
        //private readonly IHubContext<ChatHub> _hubContext;

        public ChatController(PulseServerContext context)
        {
            _context = context;
            //_hubContext = hubContext;
        }

        [HttpPost("CreateChat/{senderId}/{recipientId}")]
        public async Task<ActionResult<ChatMessage>> CreateChat([FromBody] ChatMessage chat, int senderId, int recipientId)
        {
            if (senderId == recipientId)
            {
                return BadRequest("Sender and reciever Id cannot be same.");
            }

            chat.SenderId = senderId;
            chat.RecipientId = recipientId;
            chat.Sender = null;
            chat.Recipient = null;

            _context.Chat.Add(chat);
            await _context.SaveChangesAsync();

            //await _hubContext.Clients.All.SendAsync("RecieveMessage", chat);

            return Ok(new { message = $"Message sent successfully by user {chat.SenderId} to user {chat.RecipientId}!" });
        }

        [HttpGet("{senderId}/{receiverId}")]
        public async Task<ActionResult<List<ChatMessage>>> GetChat(int senderId, int receiverId)
        {
            if (senderId == receiverId) 
            {
                return BadRequest("Sender and reciever Id cannot be same.");
            }
            var chat = _context.Chat.Where(p => (p.SenderId == senderId && p.RecipientId == receiverId) || (p.RecipientId == senderId && p.SenderId == receiverId) );

            //await _hubContext.Clients.All.SendAsync("chat" ,chat.ToList());

            return chat.ToList();
        }
    }
}
