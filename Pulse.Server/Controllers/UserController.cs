using Microsoft.AspNetCore.Mvc;
using Pulse.Server.Models;
using System.Security.Claims;
using Microsoft.AspNetCore.Identity;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Pulse.Server.Data;
using Microsoft.AspNetCore.SignalR;
using System;

namespace Pulse.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {

        private readonly PulseServerContext _context;

        public UsersController(PulseServerContext context)
        {
            _context = context;
        }

        [HttpPost("Register")]
        public async Task<ActionResult<User>> CreateUser([FromBody] User user)
        {
            var x = await _context.User.FirstOrDefaultAsync(u => u.Email == user.Email);

            if (user.Password.Length <= 6 || user.Password.Length >= 32)
            {
                return BadRequest("Password length must be in between 6 and 32 characters.");
            }

            if (x != null)
            {
                return BadRequest("Email already exists!");
            }
            _context.User.Add(user);
            await _context.SaveChangesAsync();

            return Created("User registered Successfully", user);
        }

        [HttpGet()]
        public async Task<ActionResult<List<User>>> GetUser()
        {
            var users = from u in _context.User select u;
            if (users == null)
            {
                return NotFound();
            }
            return users.ToList();
        }


        [HttpGet("{id}")]
        public async Task<ActionResult<User>> GetUser(int id)
        {
            var user = await _context.User.FindAsync(id);
            if (user == null)
            {
                return NotFound();
            }
            return user;
        }

        [HttpGet("findFriends/{id}")]
        public async Task<ActionResult<List<User>>> GetUsersExceptFriends(int id)
        {
            // Get all user IDs from the user's friend list
            var friendIds = await _context.Friends
                .Where(f => f.UserId == id)
                .Select(f => f.FriendId)
                .ToListAsync();

            // Exclude the user itself and friends from the user list
            var users = await _context.User
                .Where(u => u.Id != id && !friendIds.Contains(u.Id))
                .ToListAsync();

            return users;
        }

        [HttpPost("Follow/{userId}/{friendId}")]
        public async Task<ActionResult> Follow(int userId, int friendId)
        {
            var existingFriendship = await _context.Friends
            .FirstOrDefaultAsync(f => (f.UserId == userId && f.FriendId == friendId));

            if (existingFriendship != null)
            {
                return BadRequest("Friendship already exists");
            }

            Friends friend = new Friends();
            friend.UserId = userId;
            friend.FriendId = friendId;
            friend.Friend = null;
            friend.User = null;

            _context.Friends.Add(friend);
            await _context.SaveChangesAsync();
            return Ok(new { message = $"User {friend.UserId} followed user {friend.FriendId}!" });
        }


        [HttpGet("Following/{id}")]
        public async Task<ActionResult<List<User>>> GetFollowing(int id)
        {
            var userFriends = await _context.Friends
            .Where(f => f.UserId == id)
            .Select(f => f.Friend)
            .ToListAsync();

            return userFriends;
        }

        [HttpGet("Follower/{id}")]
        public async Task<ActionResult<List<User>>> GetFollower(int id)
        {
            var userFriends = await _context.Friends
            .Where(f => f.FriendId == id)
            .Select(f => f.User)
            .ToListAsync();

            return userFriends;
        }

        [HttpGet("ChatPersons/{id}")]
        public async Task<ActionResult<List<User>>> GetChatPersons(int id)
        {
            // Get chat partners
            var chatPersons = await _context.User
                .Where(u => u.Id != id) // Exclude user with the given id
                .Where(u => _context.Chat.Any(c =>
                    (c.SenderId == id && c.RecipientId == u.Id) ||
                    (c.SenderId == u.Id && c.RecipientId == id)
                ))
                .ToListAsync();

            // Get friends
            var friends = await _context.Friends
                .Where(f => f.UserId == id)
                .Select(f => f.Friend) // Project to User objects
                .ToListAsync();

            // Combine results (remove duplicates)
            var combinedResults = chatPersons.Union(friends).Distinct().ToList();

            return Ok(combinedResults);
        }

        [HttpPatch("Update/Name/{id}")]
        public async Task<ActionResult> UpdateName(int id, [FromBody] string name)
        {
            var user = await _context.User.FindAsync(id);

            if (user == null)
            {
                return NotFound();
            }

            user.Name = name;

            await _context.SaveChangesAsync();

            return NoContent();
        }

        [HttpPatch("Update/Image/{id}")]
        public async Task<ActionResult> UpdateImage(int id, [FromBody] string image)
        {
            var user = await _context.User.FindAsync(id);

            if (user == null)
            {
                return NotFound();
            }

            user.Image = image;

            await _context.SaveChangesAsync();

            return NoContent();
        }

        [HttpPatch("Update/Password/{id}")]
        public async Task<ActionResult> UpdatePassword(int id, [FromBody] string password)
        {
            var user = await _context.User.FindAsync(id);

            if (user == null)
            {
                return NotFound();
            }

            user.Password = password;

            await _context.SaveChangesAsync();

            return NoContent();
        }

        [HttpPost("Login")]
        public IActionResult Login([FromBody] User user)
        {
            var id = _context.User.FirstOrDefault(u => u.Email == user.Email);
            if (id == null)
            {
                return Unauthorized("Invalid email or password!");
            }
            else
            {
                if (user.Password == id.Password) 
                {
                    return Ok(id);
                }
                return Unauthorized("Invalid email or password!");
            }
        }
    }
}