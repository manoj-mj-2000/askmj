using AskMJ.Models;
using AskMJ.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;

namespace AskMJ.Controllers{

    [ApiController]
    [Route("api/[controller]")]
    public class AnswersController : Controller {

        private readonly AnswerService _answerService;

        public AnswersController(AnswerService answerService){
            _answerService = answerService;
        }

        // GET: /api/answers/question/{questionId}
        [HttpGet("question/{questionId:length(24)}")]
        public async Task<ActionResult<List<Answer>>> GetAnswersForQuestion(string questionId){
            var answers = await _answerService.GetByQuestionIdAsync(questionId);
            // Console.WriteLine(answers);
            return Ok(answers);
        }

        // POST: /api/answers
        [Authorize]
        [HttpPost]
        public async Task<ActionResult> PostAnswer([FromBody] Answer answer){
            if (string.IsNullOrWhiteSpace(answer.Content))
                return BadRequest("Answer content cannot be empty");
            
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var username = User.Identity?.Name;

            answer.UserId = userId!;
            answer.Username = username!;
            answer.CreatedTime = DateTime.UtcNow;
            answer.Votes = 0;
            _answerService.CreateAsync(answer);
            return CreatedAtAction(nameof(GetAnswersForQuestion), new { questionId = answer.QuestionId }, answer);
        }

        // PUT: /api/answers/{id}/vote?voteChange=1
        [Authorize]
        [HttpPut("{id:length(24)}/vote")]
        public async Task<ActionResult> VoteAnswer(string id, [FromQuery] int voteChange){
            if(voteChange < 0)
                return BadRequest("Vote value invalid");

            await _answerService.UpdateVotesAsync(id, voteChange);
            return NoContent();
        }

        // DELETE: /api/answers/{id}
        [Authorize]
        [HttpDelete("{id:length(24)}")]
        public async Task<ActionResult> DeleteAnswer(string id)
        {
            var answer = await _answerService.GetByIdAsync(id);
            if (answer == null)
                return NotFound();  
            
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if(answer.UserId != userId)
                return Forbid();
            
            await _answerService.DeleteAsync(id);
            return NoContent();
        }
    }
}