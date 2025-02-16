# Banking

**Setup DEV Environment:**
+ .NET 9 : https://dotnet.microsoft.com/en-us/download/dotnet/9.0
+ Angular 19: **npm install -g @angular/cli**
+ Docker: (run RabbitMQ & MSSQL on Ubuntu/MacOs)
+ RabbitMQ :  docker run -it --rm --name rabbitmq -p 5672:5672 -p 15672:15672 rabbitmq:4.0-management
+ SQL Server: (Docker) use image  ** azure-sql-edge:latest**
 
#Setup project:

Backend:
1. Update connection string, port, settings for dev/prod evironment:
2. Run update-database command to initialize database:
For Nuget Package Console: **Update-Database**
For command line: **dotnet ef database update**
