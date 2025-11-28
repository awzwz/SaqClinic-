using Microsoft.EntityFrameworkCore;
using SaqClinic.Api.Data;
using SaqClinic.Api.Models;
using SaqClinic.Api.Entities;

var builder = WebApplication.CreateBuilder(args);

// === НАСТРОЙКИ АДМИН-ПАНЕЛИ ===
// Один и тот же токен, который мы будем хранить в LocalStorage.
// Его НЕ вводят с клавиатуры, он только в коде.
const string AdminToken = "SaqClinic2024!";

// Пароль, который клиника вводит в форме.
// Можно переопределить через переменную окружения ADMIN_PANEL_PASSWORD.
// Если она не задана (как у тебя сейчас), используется эта строка.
var adminPassword = builder.Configuration["ADMIN_PANEL_PASSWORD"];
if (string.IsNullOrWhiteSpace(adminPassword))
{
    adminPassword = "SaqClinic2024!"; // <-- пароль, который вводишь на сайте
}
// ===============================

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var connectionString = builder.Configuration.GetConnectionString("DefaultConnection")
                       ?? "Data Source=saqclinic.db";

builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlite(connectionString));

const string corsPolicyName = "AllowFrontend";

builder.Services.AddCors(options =>
{
    options.AddPolicy(corsPolicyName, policy =>
    {
        policy
            .WithOrigins(
                "http://localhost:4200",               // dev Angular
                "https://saqclinic-web.onrender.com",  // production Angular (Render)
                "https://saqclinic.onrender.com"       // production API hostname when calling itself (Render)
            )
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});


// на Render порт настраивается самим Render, локально можно удалить эту строку
// builder.WebHost.UseUrls("http://0.0.0.0:5005");

var app = builder.Build();

// создаём БД, если её нет
using (var scope = app.Services.CreateScope())
{
    var dbContext = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
    dbContext.Database.EnsureCreated();
}

app.UseCors(corsPolicyName);

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// ---- ПУБЛИЧНАЯ ЗАЯВКА ----
app.MapPost("/api/submissions", async (ContactSubmissionRequest request, ApplicationDbContext context) =>
{
    var submission = new ContactSubmission
    {
        FullName = request.FullName,
        PhoneNumber = request.PhoneNumber,
        Email = request.Email,
        PreferredService = request.PreferredService,
        Message = request.Message,
        CreatedAt = DateTimeOffset.UtcNow
    };

    context.ContactSubmissions.Add(submission);
    await context.SaveChangesAsync();

    return Results.Created($"/api/submissions/{submission.Id}", submission);
});

// ---- ЛОГИН ДЛЯ КЛИНИКИ ----
app.MapPost("/api/admin/login", (AdminLoginRequest login) =>
{
    // Если пароль не совпадает с adminPassword → 401
    if (login.Password != adminPassword)
    {
        return Results.Unauthorized();
    }

    // Если всё ок → отдаём токен, который потом будет в заголовке X-Admin-Token
    return Results.Ok(new { token = AdminToken });
});

// ---- СПИСОК ЗАЯВОК (только для тех, у кого правильный токен) ----
app.MapGet("/api/admin/submissions", async (HttpContext http, ApplicationDbContext context) =>
{
    var token = http.Request.Headers["X-Admin-Token"].FirstOrDefault();

    if (token != AdminToken)
    {
        return Results.Unauthorized();
    }

    var submissions = await context.ContactSubmissions
        .AsNoTracking()
        .OrderByDescending(s => s.CreatedAt)
        .ToListAsync();

    return Results.Ok(submissions);
});

app.MapGet("/api/health", () => Results.Ok(new { status = "Healthy" }));

app.Run();

namespace SaqClinic.Api.Models
{
    public record ContactSubmissionRequest
    {
        public required string FullName { get; init; }
        public required string PhoneNumber { get; init; }
        public string? Email { get; init; }
        public string? PreferredService { get; init; }
        public string? Message { get; init; }
    }

    public record AdminLoginRequest
    {
        public string Password { get; init; } = string.Empty;
    }
}
