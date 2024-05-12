import amqplib, { Channel } from "amqplib";

export class RabbitMqProducer {
  private queueName: string;

  private queueUrl: string;

  private queue!: Channel;

  constructor(queueName: string, queueUrl: string) {
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

  async sendMessage(msg: string): Promise<void> {
    await this.queue.sendToQueue(this.queueName, Buffer.from(msg));
  }
}
