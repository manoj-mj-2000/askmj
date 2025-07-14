using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace AskMJ.Models{

    public class User{

        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id {get; set;}

        [BsonElement("username")]
        public string UserName {get; set;} = null!;

        [BsonElement("passwordHash")]
        public string PasswordHash {get; set;} = null!;

        [BsonElement("email")]
        public string Email {get; set;} = null!;
    }
}