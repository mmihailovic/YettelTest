const { z } = require('zod');

const TaskRequestDto = z.object({
  body: z.string("Body is required!").nonempty("Body is required!"),
});

module.exports = { TaskRequestDto };