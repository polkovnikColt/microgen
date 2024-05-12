const { kafkaClient } = require("./client");

class KafkaProducer {
  producer = null;

  constructor() {
    if (!this.producer) {
      this.producer = kafkaClient.producer();
    }
  }

  connect = async () => {
    await this.producer.connect();
  };

  sendMessage = async (topic, messages) => {
    await this.producer.send({
      topic,
      messages,
    });
  };
}

const kafkaProducer = new KafkaProducer();

module.exports = kafkaProducer;
