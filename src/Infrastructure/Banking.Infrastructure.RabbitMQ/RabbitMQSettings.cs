﻿namespace Banking.Infrastructure.MessageQueue
{
    public class RabbitMQSettings
    {
        public string? HostName { get; set; }
        public int? Port { get; set; }
        public string? QueueName { get; set; }
        public string? UserName { get; set; }
        public string? Password { get; set; }
        public string VirtualHost { get; set; }
    }
}
