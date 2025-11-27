using Microsoft.EntityFrameworkCore;
using SaqClinic.Api.Data;
using SaqClinic.Api.Models;
using SaqClinic.Api.Entities;

var builder = WebApplication.CreateBuilder(args);

// ===== Админ-пароль / токен =============================
// Берём из переменной окружения, иначе дефолт
var adminToken = builder.Configuration["ADMIN_PANEL_PASSWORD"];
if (string.IsNullOrWhiteSpace(adminToken))
{
    adminToken = "SaqClinic2024!"; // запасной вариант
}
// ========================================================

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
            .AllowAnyOrigin()
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});

// локально слушаем на 5005
builder.WebHost.UseUrls("http://0.0.0.0:5005");

var app = builder.Build();

// создать БД, если её ещё нет
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

// ---------- Публичный endpoint: форма с сайта ----------
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

// ---------- НОВЫЙ endpoint: логин в админ-панель ----------
app.MapPost("/api/admin/login", (AdminLoginRequest login) =>
{
    // просто сравниваем пароль
    if (login.Password == adminToken)
    {
        // фронт ждёт объект с полем token
        return Results.Ok(new { token = adminToken });
    }

    return Results.Unauthorized();
});

// ---------- Закрытый endpoint: список заявок ----------
app.MapGet("/api/admin/submissions", async (HttpContext http, ApplicationDbContext context) =>
{
    var tokenFromHeader = http.Request.Headers["X-Admin-Token"].FirstOrDefault();

    if (string.IsNullOrEmpty(tokenFromHeader) || tokenFromHeader != adminToken)
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

// ======================= MODELS =========================
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
