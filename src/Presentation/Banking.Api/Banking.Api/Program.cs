using Asp.Versioning;
using Banking.Api.BackgroundServices;
using Banking.Api.Middlewares;
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
using NSwag.Generation.Processors.Security;
using NSwag;
using System.Text;
using Banking.Application;
using Banking.Core;

var builder = WebApplication.CreateBuilder(args);

// Configure JWT settings
var jwtSettings = builder.Configuration.GetSection("JwtSettings").Get<JwtSettings>();
builder.Services.Configure<JwtSettings>(builder.Configuration.GetSection("JwtSettings"));

builder.Services.AddControllers();

// Configure API Versioning
builder.Services.AddApiVersioning(options =>
{
    options.ReportApiVersions = true;
    options.AssumeDefaultVersionWhenUnspecified = true;
    options.DefaultApiVersion = new ApiVersion(1, 0);
    options.ApiVersionReader = new UrlSegmentApiVersionReader();
});

builder.Services.AddIdentity<User, Role>()
    .AddEntityFrameworkStores<BankingDbContext>()
    .AddDefaultTokenProviders();

// Register persistence and application layers
builder.Services.AddPersistence(builder.Configuration);
builder.Services.AddApplication();

// JWT Authentication
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

// RabbitMQ configuration
builder.Services.Configure<RabbitMqSettings>(builder.Configuration.GetSection("RabbitMQ"));
builder.Services.AddHostedService<TransactionBackgroundService>();
builder.Services.AddRabbitMq();

// WebSocket configuration
builder.Services.AddSignalRWebSocket();

// CORS policies
builder.Services.AddCors(options =>
{
    options.AddPolicy("LocalhostPolicy", builder =>
    {
        builder
            .WithOrigins("http://localhost:4200", "https://localhost:7101")
            .AllowAnyMethod()
            .AllowAnyHeader()
            .AllowCredentials();
    });

    options.AddPolicy("ProductionPolicy", corsPolicyBuilder =>
    {
        corsPolicyBuilder.WithOrigins("https://mysimplebanking.netlify.app", "http://mysimplebanking.netlify.app", "ws://mysimplebanking.netlify.app")
            .AllowAnyMethod()
            .AllowAnyHeader()
            .AllowCredentials();
    });
});

// Swagger/OpenAPI configuration
builder.Services.AddOpenApiDocument(document =>
{
    document.AddSecurity("JWT", [],new OpenApiSecurityScheme
    {
        Type = OpenApiSecuritySchemeType.ApiKey,
        Name = "Authorization",
        In = OpenApiSecurityApiKeyLocation.Header,
        
        Description = "Type into the textbox: Bearer {your JWT token}."
    });

    document.OperationProcessors.Add(new AspNetCoreOperationSecurityScopeProcessor("JWT"));
});

// Additional services
builder.Services.AddScoped<CurrentLoginUser>();
builder.Services.AddScoped<TokenService>();
builder.Services.AddHttpContextAccessor();
builder.Services.AddEndpointsApiExplorer();

var app = builder.Build();

// Configure the HTTP request pipeline
//if (app.Environment.IsDevelopment())
{
    app.UseOpenApi();
    app.UseSwaggerUi();
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
app.UseCors("ProductionPolicy");

app.MapControllers();
app.MapHub<BaseHub>("/eventhub");

app.Run();