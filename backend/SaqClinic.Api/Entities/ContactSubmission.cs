namespace SaqClinic.Api.Entities;

public class ContactSubmission
{
    public int Id { get; set; }
    public required string FullName { get; set; }
    public required string PhoneNumber { get; set; }
    public string? Email { get; set; }
    public string? PreferredService { get; set; }
    public string? Message { get; set; }
    public DateTimeOffset CreatedAt { get; set; }
}
