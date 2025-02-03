using Asp.Versioning;
using Banking.Api.BackgroundServices;
using Banking.Api.Middlewares;
using Banking.Application;
using Banking.Common.Models;
using Banking.Common.Services;
using Banking.Core.Entities.Identity;
using Banking.Infrastructure.MessageQueue;
using Banking.Infrastructure.WebSocket;
using Banking.Persistence;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.OData;
using Microsoft.IdentityModel.Tokens;
using NSwag;
using NSwag.Generation.Processors.Security;
using System.Text;

var builder = WebApplication.CreateBuilder(args);
var jwtSettings = builder.Configuration.GetSection("JwtSettings").Get<JwtSettings>();
builder.Services.Configure<JwtSettings>(builder.Configuration.GetSection("JwtSettings"));

builder.Services.AddControllers();
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();
builder.Services.AddApiVersioning(options =>
{
    options.ReportApiVersions = true;
    options.AssumeDefaultVersionWhenUnspecified = true;
    options.DefaultApiVersion = new ApiVersion(1, 0);
    options.ApiVersionReader = new UrlSegmentApiVersionReader();
});
builder.Services.AddControllers()
    .AddOData(opt => opt.Select().Filter().OrderBy().Expand().SetMaxTop(100).Count()); // Add OData configuration
builder.Services.AddIdentity<User, Role>()
    .AddEntityFrameworkStores<BankingDbContext>()
    .AddDefaultTokenProviders();

builder.Services.AddPersistence(builder.Configuration);
builder.Services.AddApplication();

builder.Services.AddAuthentication(options =>
    {
        options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
        options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
    })
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = jwtSettings?.Issuer,
            ClockSkew = TimeSpan.Zero,
            ValidAudience = jwtSettings?.Audience,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSettings?.SecretKey ?? string.Empty))
        };
    });

// Add RabbitMQ configuration

builder.Services.Configure<RabbitMQSettings>(builder.Configuration.GetSection("RabbitMQ"));
builder.Services.AddHostedService<TransactionBackgroundService>();
builder.Services.AddRabbitMQ();


// Add connection mapping 
builder.Services.AddSignalRWebSocket();

// Add CORS policy to allow requests from localhost
builder.Services.AddCors(options =>
{
    options.AddPolicy("LocalhostPolicy", builder =>
    {
       builder
                .WithOrigins("http://localhost:4200")
                .AllowAnyMethod()
                .AllowAnyHeader()
                .AllowCredentials();
    });

    options.AddPolicy("ProductionPolicy", corsPolicyBuilder =>
    {
        corsPolicyBuilder.WithOrigins("https://mysimplebanking.netlify.app", "http://mysimplebanking.netlify.app",
                "ws://mysimplebanking.netlify.app")
            .AllowAnyMethod()
            .AllowAnyHeader()
            .AllowCredentials();
    });
});

// Add the Swagger generator and the Swagger UI middlewares
builder.Services.AddScoped<TokenService>();
builder.Services.AddHttpContextAccessor();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddOpenApiDocument(document =>
{
    document.AddSecurity("JWT", [], new OpenApiSecurityScheme
    {
        Type = OpenApiSecuritySchemeType.ApiKey,
        Name = "Authorization",
        In = OpenApiSecurityApiKeyLocation.Header,
        Description = "Type into the textbox: Bearer {your JWT token}."
    });

    document.OperationProcessors.Add(
        new AspNetCoreOperationSecurityScopeProcessor("JWT"));
});
var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    // Add OpenAPI 3.0 document serving middleware
    // Available at: http://localhost:<port>/swagger/v1/swagger.json
    app.UseOpenApi();

    // Add web UIs to interact with the document
    // Available at: http://localhost:<port>/swagger

    app.UseSwaggerUi(); // UseSwaggerUI Protected by if (env.IsDevelopment())
    app.MapGet("/index.html", context =>
    {
        context.Response.Redirect("/swagger/index.html", permanent: false);
        return Task.CompletedTask;
    });
    app.MapGet("/", context =>
    {
        context.Response.Redirect("/swagger/index.html", permanent: false);
        return Task.CompletedTask;
    });
    app.MapGet("/swagger", context =>
    {
        context.Response.Redirect("/swagger/index.html", permanent: false);
        return Task.CompletedTask;
    });
}

app.UseHttpsRedirection();
app.UseGlobalExceptionHandler();

app.UseAuthentication();
app.UseMiddleware<JwtMiddleware>();

app.UseAuthorization();

app.UseCors("LocalhostPolicy");
//app.UseCors(app.Environment.IsDevelopment() ? "LocalhostPolicy" : "ProductionPolicy");

app.MapControllers();
app.MapHub<BaseHub>("/eventhub");

app.Run();