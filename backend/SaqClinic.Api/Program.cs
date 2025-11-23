using Microsoft.EntityFrameworkCore;
using SaqClinic.Api.Data;
using SaqClinic.Api.Models;
using SaqClinic.Api.Entities;

var builder = WebApplication.CreateBuilder(args);

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


builder.WebHost.UseUrls("http://0.0.0.0:5000");

var app = builder.Build();

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

app.MapGet("/api/submissions", async (ApplicationDbContext context) =>
{
    // get all submissions from the database
    var submissions = await context.ContactSubmissions
        .AsNoTracking()
        .ToListAsync();

    // sort them in memory by CreatedAt (newest first)
    var ordered = submissions
        .OrderByDescending(s => s.CreatedAt)
        .ToList();

    return Results.Ok(ordered);
});


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
