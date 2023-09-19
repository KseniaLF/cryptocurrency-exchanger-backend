const { Schema, model } = require("mongoose");

const messageSchema = new Schema(
  {
    message: {
          text: {
            type: String,
            required: true
          },
        },
      status: {
      type: String,
      enum: ["read", "unread"],
      default: "unread",
        },
      
    users: Array,
    sender: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

const Message = model("messages", messageSchema);

module.exports = Message;