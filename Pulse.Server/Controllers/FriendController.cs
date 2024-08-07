using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Pulse.Server.Data;

namespace Pulse.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FriendController : ControllerBase
    {
        private readonly PulseServerContext _context;

        public FriendController(PulseServerContext context)
        {
            _context = context;
        }

        [HttpDelete("Remove/Following/{userId}/{followingId}")]
        public async Task<IActionResult> DeleteFollowing(int userId, int followingId)
        {
            if (userId == 0 || followingId == 0)
            {
                return BadRequest("Id can't be 0!");
            }

            else if (userId == followingId)
            {
                return BadRequest("UserId and FollowingId can't be same!");
            }

            var friendship = await _context.Friends
                .FirstOrDefaultAsync(f => f.UserId == userId && f.FriendId == followingId);

            if (friendship == null)
            {
                return NotFound(); // Or handle the case where friendship doesn't exist
            }

            _context.Friends.Remove(friendship);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        [HttpDelete("Remove/Follower/{userId}/{followerId}")]
        public async Task<IActionResult> DeleteFollower(int userId, int followerId)
        {
            if (userId == 0 || followerId == 0)
            {
                return BadRequest("Id can't be 0!");
            }

            else if (userId == followerId)
            {
                return BadRequest("UserId and FollowingId can't be same!");
            }

            var friendship = await _context.Friends
                .FirstOrDefaultAsync(f => f.UserId == followerId && f.FriendId == userId);

            if (friendship == null)
            {
                return NotFound(); // Or handle the case where friendship doesn't exist
            }

            _context.Friends.Remove(friendship);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
