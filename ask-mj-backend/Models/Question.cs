using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace AskMJ.Models{

    public class Question{

        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string? Id {get; set;}

        [BsonElement("title")]
        public string Title {get; set;} = null!;

        [BsonElement("description")]
        public string Description {get; set;} = null!;

        [BsonElement("tags")]
        public List<string> Tags {get; set;} = new List<string>();

        [BsonElement("createdTime")]
        public DateTime CreatedTime {get; set;} = DateTime.UtcNow;

        [BsonElement("userId")]
        public string UserId { get; set; } = null!;

        [BsonElement("username")]
        public string Username { get; set; } = null!;
    }
}