using Microsoft.EntityFrameworkCore;
using Oracle.EntityFrameworkCore;
using OutilRentabilite.Data;

var builder = WebApplication.CreateBuilder(args);

// --- DbContext et services ---
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseOracle(builder.Configuration.GetConnectionString("OracleConnection")));


builder.Services.AddControllers();

// --- CORS ---
builder.Services.AddCors(options =>
{
    options.AddPolicy("ReactApp", policy =>
    {
        policy.WithOrigins("http://localhost:3000") // Port React
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

builder.Services.AddControllers().AddJsonOptions(options =>
{
    options.JsonSerializerOptions.ReferenceHandler = System.Text.Json.Serialization.ReferenceHandler.IgnoreCycles;
});

var app = builder.Build();

// --- Seed Base de données ---
using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    var context = services.GetRequiredService<AppDbContext>();
    DbInitializer.Seed(context);
}

// --- Middleware ---
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Home/Error");
    app.UseHsts();
}

// HTTP redirection si besoin
// app.UseHttpsRedirection();

app.UseStaticFiles();
app.UseRouting();

// ✅ CORS doit être avant tout UseAuthorization / MapControllers
app.UseCors("ReactApp");

app.UseAuthorization();

// API controllers
app.MapControllers();

// React fallback
app.MapFallbackToFile("index.html");

app.Run();