import { kafkaClient } from "./client";

class KafkaProducer {
  private producer: any = null;

  constructor() {
    if (!this.producer) {
      this.producer = kafkaClient.producer();
    }
  }

  connect = async () => {
    await this.producer?.connect();
  };

  sendMessage = async (topic: string, messages: any[]) => {
    await this.producer.send({
      topic,
      messages,
    });
  };
}

const kafkaProducer = new KafkaProducer();

export { kafkaProducer };
