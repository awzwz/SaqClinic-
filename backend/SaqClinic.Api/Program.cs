using Microsoft.EntityFrameworkCore;
using SaqClinic.Api.Data;
using SaqClinic.Api.Models;
using SaqClinic.Api.Entities;

var builder = WebApplication.CreateBuilder(args);

// Базовый пароль для локальной разработки (фолбэк)
const string DefaultAdminPassword = "SaqClinic2024!";

// PORT для Render (там он задаётся в env), локально — 5005
var port = Environment.GetEnvironmentVariable("PORT") ?? "5005";
builder.WebHost.UseUrls($"http://0.0.0.0:{port}");

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
            .AllowAnyOrigin()   // пока оставим так, чтобы не ловить CORS
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});

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

// ====== Читаем пароль админ-панели из переменной окружения ======
var adminPassword = app.Configuration["ADMIN_PANEL_PASSWORD"];
if (string.IsNullOrWhiteSpace(adminPassword))
{
    // запасной вариант для локальной разработки
    adminPassword = DefaultAdminPassword;
}
// ================================================================

// ПУБЛИЧНЫЙ endpoint: форма на сайте создаёт новую заявку
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

// ЗАКРЫТЫЙ endpoint для клиники: список заявок
// Требует заголовок X-Admin-Token с правильным паролем
app.MapGet("/api/admin/submissions", async (HttpContext http, ApplicationDbContext context) =>
{
    var token = http.Request.Headers["X-Admin-Token"].FirstOrDefault();

    if (token != adminPassword)
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
}
