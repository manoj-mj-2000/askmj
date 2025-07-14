using AskMJ.Models;
using AskMJ.Data;
using Microsoft.Extensions.Options;
using MongoDB.Driver;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.IdentityModel.Tokens;

namespace AskMJ.Services{

    public class AuthService{

        private readonly IMongoCollection<User> _usersCollection;
        private readonly IConfiguration _config;

        public AuthService(IOptions<MongoDbSettings> mongoDbSettings, IConfiguration iConfig){

            var client = new MongoClient(mongoDbSettings.Value.ConnectionString);
            var database = client.GetDatabase(mongoDbSettings.Value.DatabaseName);
            _usersCollection = database.GetCollection<User>("users");
            _config = iConfig;
        }

        public async Task<User?> GetByUserName(string username){
            return await _usersCollection.Find(user => user.UserName == username).FirstOrDefaultAsync();
        }

        public async Task<bool> Register(User user, string password){

            if(await GetByUserName(user.UserName) != null) return false;

            user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(password);
            await _usersCollection.InsertOneAsync(user);
            return true;
        }

        public bool VerifyPassword(string hash, string password){
            return BCrypt.Net.BCrypt.Verify(password, hash);
        }

        public string GenerateJWTToken(User user){

            var claims = new[]{
                new Claim(ClaimTypes.NameIdentifier, user.Id),
                new Claim(ClaimTypes.Name, user.UserName)
            };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Key"]!));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: _config["Jwt:Issuer"],
                audience: _config["Jwt:Audience"],
                claims: claims,
                expires: DateTime.UtcNow.AddDays(7),
                signingCredentials: creds
            );
            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}