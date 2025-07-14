using AskMJ.Models;
using AskMJ.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;

namespace AskMJ.Controllers{

    [ApiController]
    [Route("/api/[controller]")]
    public class QuestionsController : ControllerBase {
        private readonly QuestionService _questionService;

        [HttpGet("test")]
        public IActionResult Test() => Ok("Hello from Azure!");

        public QuestionsController(QuestionService questionService){
            _questionService = questionService;
        }

        [HttpGet]
        public async Task<ActionResult<List<Question>>> GetAll(){
            var questions = await _questionService.GetAllAsync();
            return Ok(questions);
        }

        [HttpGet("{id:length(24)}")]
        public async Task<ActionResult<Question>> Get(string id){
            var question = await _questionService.GetByIdAsync(id);
            if(question is null){
                return NotFound();
            }
            return Ok(question);
        }

        [Authorize]
        [HttpPost]
        public async Task<ActionResult> Create(Question question){
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var username = User.Identity?.Name;

            question.UserId = userId!;
            question.Username = username!;
            
            await _questionService.CreateAsync(question);
            return CreatedAtAction(nameof(Get), new { id = question.Id}, question);
        }

        [Authorize]
        [HttpPut]
        public async Task<IActionResult> Update(string id, Question UpdatedQuestion){
            var question = await _questionService.GetByIdAsync(id);
            if(question is null){
                return NotFound();
            }
            UpdatedQuestion.Id = question.Id;
            await _questionService.UpdateAsync(id, UpdatedQuestion);
            return NoContent();
        }

        [Authorize]
        [HttpDelete("{id:length(24)}")]
        public async Task<IActionResult> Delete(string id){
            var question = await _questionService.GetByIdAsync(id);
            if(question is null){
                return NotFound();
            }

            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if(question.UserId != userId)
                return Forbid();

            await _questionService.DeleteAsync(id);
            return NoContent();
        }
    }
}