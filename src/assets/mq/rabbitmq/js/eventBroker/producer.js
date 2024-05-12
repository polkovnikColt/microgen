const amqplib = require("amqplib");

class RabbitMqProducer {
  queueName = "";
  queueUrl = "";
  queue = null;

  constructor(queueName, queueUrl) {
    this.queueName = queueName;
    this.queueUrl = queueUrl;
  }

  async connect() {
    console.log("BEGINNING OF CONNECT FUNCTION");
    const connection = await amqplib.connect(
      this.queueUrl ?? "amqp://localhost"
    );
    console.log("CONNECTION: ", connection);

    const channel = await connection.createChannel();
    channel.assertQueue(this.queueName);

    this.queue = channel;
  }

  async sendMessage(msg) {
    await this.queue.sendToQueue(this.queueName, Buffer.from(msg));
  }
}

module.exports = RabbitMqProducer;
