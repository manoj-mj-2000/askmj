using AskMJ.Data;
using AskMJ.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using MongoDB.Driver;

namespace AskMJ.Services{

    public class AnswerService{

        private readonly IMongoCollection<Answer> _answersCollections;
        
        public AnswerService(IOptions<MongoDbSettings> mongoDBSettings){
            var mongoClient = new MongoClient(mongoDBSettings.Value.ConnectionString);
            var mongoDatabase = mongoClient.GetDatabase(mongoDBSettings.Value.DatabaseName);
            _answersCollections = mongoDatabase.GetCollection<Answer>("answers");
        }

        public async Task<List<Answer>> GetByQuestionIdAsync(string questionId){
            return await _answersCollections.Find(a => a.QuestionId == questionId).ToListAsync();
        }

        public async Task<Answer?> GetByIdAsync(string id) =>
            await _answersCollections.Find(a => a.Id == id).FirstOrDefaultAsync();

        public async Task CreateAsync(Answer answer) =>
            await _answersCollections.InsertOneAsync(answer);

        public async Task UpdateVotesAsync(string id, int voteChange) {
            // Console.WriteLine(voteChange);
            var update = Builders<Answer>.Update.Set(a => a.Votes, voteChange);
            await _answersCollections.UpdateOneAsync(a => a.Id == id, update);
        }

        public async Task DeleteAsync(string id) =>
            await _answersCollections.DeleteOneAsync(a => a.Id == id);

        public async Task DeleteByQuestionIdAsync(string questionId) =>
            await _answersCollections.DeleteManyAsync(a => a.QuestionId == questionId);

    }
}