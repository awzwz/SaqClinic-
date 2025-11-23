# ---------- Build stage ----------
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Сначала копируем .csproj и делаем restore
COPY backend/SaqClinic.Api/SaqClinic.Api.csproj backend/SaqClinic.Api/
RUN dotnet restore backend/SaqClinic.Api/SaqClinic.Api.csproj

# Потом копируем весь репозиторий и публикуем API
COPY . .
WORKDIR /src/backend/SaqClinic.Api
RUN dotnet publish SaqClinic.Api.csproj -c Release -o /app/publish

# ---------- Runtime stage ----------
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app

# Kestrel будет слушать порт 10000 (Render по умолчанию ждёт именно его)
ENV ASPNETCORE_URLS=http://0.0.0.0:10000
EXPOSE 10000

COPY --from=build /app/publish .
ENTRYPOINT ["dotnet", "SaqClinic.Api.dll"]
