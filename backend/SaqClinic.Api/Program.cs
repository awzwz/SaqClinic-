using Microsoft.EntityFrameworkCore;
using SaqClinic.Api.Data;
using SaqClinic.Api.Models;
using SaqClinic.Api.Entities;

var builder = WebApplication.CreateBuilder(args);

// ---------- Services ----------

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var connectionString = builder.Configuration.GetConnectionString("DefaultConnection")
                       ?? "Data Source=saqclinic.db";

builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlite(connectionString));

// CORS: разрешаем запросы с любого фронтенда (локально и на Render)
const string corsPolicyName = "AllowFrontend";

builder.Services.AddCors(options =>
{
    options.AddPolicy(corsPolicyName, policy =>
    {
        policy
            .AllowAnyOrigin()   // можно потом сузить до конкретных доменов
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});

// ВАЖНО: НЕ указываем UseUrls здесь.
// Локально ASP.NET сам слушает 5000/5001.
// В Docker/Render мы задаём порт через переменную ASPNETCORE_URLS.
var app = builder.Build();

// ---------- DB init ----------

using (var scope = app.Services.CreateScope())
{
    var dbContext = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
    dbContext.Database.EnsureCreated();
}

// ---------- Middleware ----------

app.UseCors(corsPolicyName);

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// ---------- Endpoints ----------

// Получение заявок
app.MapGet("/api/submissions", async (ApplicationDbContext context) =>
{
    // забираем все записи из БД
    var submissions = await context.ContactSubmissions
        .AsNoTracking()
        .ToListAsync();

    // сортируем по дате уже в памяти (SQLite не умеет ORDER BY по DateTimeOffset)
    var ordered = submissions
        .OrderByDescending(s => s.CreatedAt)
        .ToList();

    return Results.Ok(ordered);
});

// Создание заявки
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

// Health-check
app.MapGet("/api/health", () => Results.Ok(new { status = "Healthy" }));

app.Run();

// ---------- DTO ----------

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
