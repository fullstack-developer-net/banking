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


Demo: https://mysimplebank.netlify.app/

Admin account:  
admin@example.com / P@ssw0rd48sea5Tr

Bank Users:

hiep@banking.com / P@ssw0rd41mvI70s

haha@gmail.com / P@ssw0rd482cr7KM

nhatphuong@example.com / P@ssw0rd3943S3K2

phuong@banking.com / P@ssw0rd22Y5F8LS

mango@gmail.com / P@ssw0rd29DWAlSj

mathis@gmail.com / P@ssw0rd6UvpqaQ
