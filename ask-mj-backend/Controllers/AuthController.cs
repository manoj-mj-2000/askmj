using AskMJ.Models;
using AskMJ.Services;
using Microsoft.AspNetCore.Mvc;

namespace AskMJ.Controllers{

    [ApiController]
    [Route("/api/[controller]")]
    public class AuthController : ControllerBase{

        private readonly AuthService _authService;

        public AuthController(AuthService authService){
            _authService = authService;
        }

        [HttpPost("register")]
        public async Task<ActionResult> Register(RegisterDto dto){
            var user = new User 
            {
                UserName = dto.Username,
                Email = dto.Email
            };

            var result = await _authService.Register(user, dto.Password);
            if(!result) return BadRequest("User registration failed");

            return Ok("User registration success");
        }

        [HttpPost("login")]
        public async Task<ActionResult<string>> Login(LoginDto dto){

            var user = await _authService.GetByUserName(dto.Username);
            if(user == null || !_authService.VerifyPassword(user.PasswordHash, dto.Password))
                return Unauthorized("Invalid Credentials");
            
            var token = _authService.GenerateJWTToken(user);
            return Ok(new { token, userId = user.Id, username = user.UserName });
        }
    }

    public class UserDto
    {
        public string Username { get; set; } = null!;
        public string Email { get; set; } = null!;
        public string Password { get; set; } = null!;
    }
}