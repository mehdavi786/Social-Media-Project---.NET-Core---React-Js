using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Pulse.Server.Models;

namespace Pulse.Server.Data
{
    public class PulseServerContext : DbContext
    {
        public PulseServerContext(DbContextOptions<PulseServerContext> options)
            : base(options)
        {
        }
        public DbSet<User> User { get; set; }
        public DbSet<Post> Post { get; set; }
        public DbSet<ChatMessage> Chat { get; set; }
        public DbSet<UserChat> UserChats { get; set; }
        public DbSet<Friends> Friends { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            //modelBuilder.Entity<User>().HasMany(p => p.Posts);

            //modelBuilder.Entity<Post>().HasOne(p => p.User).WithMany(p => p.Posts).HasForeignKey(p => p.UserId);

            //modelBuilder.Entity<User>().HasMany(u => u.SentMessages);

            //modelBuilder.Entity<User>().HasMany(u => u.RecievedMessages);

            //modelBuilder.Entity<ChatMessage>().HasOne(cm => cm.Sender).WithMany(u => u.SentMessages).HasForeignKey(cm => cm.SenderId);

            //modelBuilder.Entity<ChatMessage>().HasOne(cm => cm.Recipient).WithMany(u => u.RecievedMessages).HasForeignKey(cm => cm.RecipientId);

            modelBuilder.Entity<UserChat>().HasKey(uc => new { uc.UserId, uc.ChatMessageId });

            modelBuilder.Entity<UserChat>().HasIndex(uc => new { uc.UserId, uc.ChatMessageId }).IsUnique();
        }
    }
}
