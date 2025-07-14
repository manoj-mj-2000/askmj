using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace AskMJ.Models{

    public class Answer{

        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string? Id {get;set;}

        [BsonElement("questionId")]
        [BsonRepresentation(BsonType.ObjectId)]
        public string QuestionId { get; set; } = null!;

        [BsonElement("content")]
        public string Content {get; set;} = null!;

        [BsonElement("createdTime")]
        public DateTime CreatedTime {get; set;} = DateTime.UtcNow;

        [BsonElement("votes")]
        public int Votes { get; set; } = 0;

        [BsonElement("userId")]
        public string UserId { get; set; } = null!;

        [BsonElement("username")]
        public string Username { get; set; } = null!;
    }
}