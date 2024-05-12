import { kafkaClient } from "./client";

class KafkaConsumer {
  private consumer: any = null;

  constructor() {
    if (!this.consumer) {
      this.consumer = kafkaClient.consumer();
    }
  }

  connect = async () => {
    await this.consumer?.connect();
  };

  consumeMessage = async (topic: string): Promise<any> => {
    await this.consumer?.connect();
    await this.consumer?.subscribe({ topic });

    return new Promise((resolve) => {
      this.consumer.run({
        eachMessage: resolve,
      });
    });
  };
}

const kafkaConsumer = new KafkaConsumer();
await kafkaConsumer.connect();

export { kafkaConsumer };
