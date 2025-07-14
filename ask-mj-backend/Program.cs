using AskMJ.Data;
using AskMJ.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

builder.Services.Configure<MongoDbSettings>(builder.Configuration.GetSection("MongoDB"));
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddAuthorization();
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll",
        policy => policy.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader());
});
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        var key = builder.Configuration["Jwt:Key"];
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = builder.Configuration["Jwt:Issuer"],
            ValidAudience = builder.Configuration["Jwt:Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(key!))
        };
    });
builder.Services.AddSingleton<AuthService>();
builder.Services.AddSingleton<QuestionService>();
builder.Services.AddSingleton<AnswerService>();

var app = builder.Build();

app.UseSwagger();
app.UseSwaggerUI();

app.Use(async (context, next) =>
{
    await next();
    if (context.Response.StatusCode == 404 &&
        !Path.HasExtension(context.Request.Path.Value))
    {
        context.Request.Path = "/index.html";
        await next();
    }
});

app.UseDefaultFiles();
app.UseStaticFiles();
app.UseRouting();
app.UseEndpoints(endpoints =>
{
    endpoints.MapControllers();
});
app.UseCors("AllowAll");
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();
app.Run();
