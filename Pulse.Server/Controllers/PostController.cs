using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Pulse.Server.Data;
using Pulse.Server.Models;

namespace Pulse.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PostController : ControllerBase
    {

        private readonly PulseServerContext _context;

        public PostController(PulseServerContext context)
        {
            _context = context;
        }

        [HttpPost("CreatePost")]
        public async Task<ActionResult<Post>> CreatePost([FromBody] Post post)
        {
            _context.Post.Add(post);
            await _context.SaveChangesAsync();

            return Ok(new { message = $"Post Created Successfully by user {post.UserId}!" });
        }

        [HttpGet()]
        public async Task<ActionResult<List<Post>>> GetAllPostsOfFollowing()
        {
            var posts = await _context.Post.Include(p => p.User).OrderByDescending(p => p.Id) // Order by descending ID
                                          .ToListAsync();
            return posts;
        }

        [HttpGet("FriendsPosts/{userId}")]
        public async Task<ActionResult<List<Post>>> GetAllFriendsPosts(int userId)
        {
           
            var friendPosts = await _context.Post
                .Where(p => _context.Friends.Any(f => f.UserId == userId && f.FriendId == p.UserId))
                .Include(p => p.User)
                .OrderByDescending(p => p.Id)
                .ToListAsync();

            return Ok(friendPosts);
            
        }

        [HttpGet("{userid}")]
        public async Task<ActionResult<List<Post>>> GetUserPosts(int userid)
        {
            var user = await _context.User.FindAsync(userid);
            if ( user == null)
            {
                return BadRequest("User does not exist!");
            }

            var posts = await _context.Post.Where(p => p.UserId == userid).Include(p => p.User).OrderByDescending(p => p.Id).ToListAsync();
            return posts == null ? NotFound() : posts;
        }
    }
}
