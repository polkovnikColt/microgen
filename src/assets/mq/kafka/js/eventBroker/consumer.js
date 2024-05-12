const { kafkaClient } = require("./client");

class KafkaConsumer {
  consumer = null;

  constructor() {
    if (!this.consumer) {
      this.consumer = kafkaClient.consumer();
    }
  }

  connect = async () => {
    await this.consumer.connect();
  };

  consumeMessage = async (topic, message) => {
    await this.consumer.connect();
    await this.consumer.subscribe({ topic });

    return new Promise((resolve) => {
      this.consumer.run({
        eachMessage: resolve,
      });
    });
  };
}

const kafkaConsumer = new KafkaConsumer();

module.exports = kafkaConsumer;
