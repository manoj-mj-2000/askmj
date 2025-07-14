using AskMJ.Data;
using AskMJ.Models;
using Microsoft.Extensions.Options;
using MongoDB.Driver;

namespace AskMJ.Services{

    public class QuestionService{

        private readonly IMongoCollection<Question> _questionsCollections;
        private readonly AnswerService _answerService;

        public QuestionService(IOptions<MongoDbSettings> mongoDBSettings, AnswerService answerService){
            var mongoClient = new MongoClient(mongoDBSettings.Value.ConnectionString);
            var mongoDatabase = mongoClient.GetDatabase(mongoDBSettings.Value.DatabaseName);
            _questionsCollections = mongoDatabase.GetCollection<Question>("questions");
            _answerService = answerService;
        }

        public async Task<List<Question>> GetAllAsync() =>
            await _questionsCollections.Find(_ => true).ToListAsync();

        public async Task<Question?> GetByIdAsync(string id) =>
            await _questionsCollections.Find(q => q.Id == id).FirstOrDefaultAsync();

        public async Task CreateAsync(Question question){
            await _questionsCollections.InsertOneAsync(question);
        }
        public async Task UpdateAsync(string id, Question question){
            await _questionsCollections.ReplaceOneAsync(q => q.Id == id, question);
        }
        public async Task DeleteAsync(string id){
            await _questionsCollections.DeleteOneAsync(q=> q.Id == id);
            await _answerService.DeleteByQuestionIdAsync(id);
        }
    }

}