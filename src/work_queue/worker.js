var amqp = require('amqplib/callback_api');

amqp.connect('amqp://192.168.0.102:5672', function(error0, connection) {
  if (error0) {
    throw error0;
  }
  connection.createChannel(function(error1, channel) {
    if (error1) {
      throw error1;
    }

    var queue = 'task_queue';

    // This makes sure the queue is declared before attempting to consume from it
    channel.assertQueue(queue, {
      durable: true
    });

    channel.prefetch(1); // 작업이 끝난 queue에 배치

    channel.consume(queue, function(msg) {
      var secs = msg.content.toString().split('.').length - 1;

      console.log(" [x] Received %s", msg.content.toString());
      setTimeout(function() {
        console.log(" [x] Done");
        channel.ack(msg);
      }, secs * 1000);
    }, {
      // automatic acknowledgment mode,
      // see ../confirms.html for details
      noAck: false  // ack 를 보내지 않고 종료되면 다시 큐에 넣는다.
    });
  });
});


