using Microsoft.AspNetCore.SignalR;
using Pulse.Server.Models;
using Pulse.Server.Data;
using System.ComponentModel;

namespace Pulse.Server.Hubs
{
    public class ChatHub : Hub
    {

        private readonly PulseServerContext _context;

        public ChatHub(PulseServerContext context)
        {
            _context = context;
        }

        public async Task JoinChat(string id, int recipientId, string message)
        {
            var user = await _context.User.FindAsync(int.Parse(id));
            var recipient = await _context.User.FindAsync(recipientId);
            var sortedIds = new[] { int.Parse(id), recipientId }.OrderBy(id => id).ToArray();
            var groupName = $"{sortedIds[0]} - {sortedIds[1]}";
            await Clients.All.SendAsync("ReceiveMessage", user, recipient, groupName, message);
        }

        public async Task JoinPrivateChat(string userId, int recipientId, string message)
        {
            var Id = Context.ConnectionId;
            var sortedIds = new[] { int.Parse(userId), recipientId }.OrderBy(id => id).ToArray();
            var user = await _context.User.FindAsync(int.Parse(userId));
            var recipient = await _context.User.FindAsync(recipientId);
            var groupName = $"{sortedIds[0]} - {sortedIds[1]}";

            await Groups.AddToGroupAsync(Id, "Chat");
            await Groups.AddToGroupAsync(recipientId.ToString(), "Chat");

            await Clients.Group("Chat").SendAsync("ReceivePrivateMessage", user, recipient, message);
        }

    }
}
