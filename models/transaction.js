const { Schema, model } = require("mongoose");

const transactionSchema = new Schema(
  {
    amountToExchange: {
      type: Number,
      required: true,
    },
    currencyToExchange: {
      type: String,
      // enum: ["curr1", "curr2"], // need full list of possible currencies here
      required: [true, "Set currency to be exchanged"],
    },
    amountToReceive: {
      type: Number,
      required: true,
    },
    currencyToReceive: {
      type: String,
      // enum: ["curr1", "curr2"], // need full list of possible currencies here
      required: [true, "Set currency to receive"],
    },
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
      default: "pending",
    },

    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

const Transaction = model("transaction", transactionSchema);

module.exports = Transaction;
