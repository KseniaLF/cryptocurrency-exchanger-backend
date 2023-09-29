const { Schema, model } = require("mongoose");

const transactionSchema = new Schema(
  {
    amountToExchange: {
      type: Number,
      required: true,
    },
    currencyToExchange: {
      type: String,
      required: [true, "Set currency to be exchanged"],
    },
    amountToReceive: {
      type: Number,
      required: true,
    },
    currencyToReceive: {
      type: String,
      required: [true, "Set currency to receive"],
    },
    paymentMethod: {
      type: String,
      required: true,
      enum: ["creditCard", "wallet", "cash"],
    },
    creditCard: {
      type: String,
      required: function () {
        return this.paymentMethod === "creditCard";
      },
    },
    wallet: {
      type: String,
      required: function () {
        return this.paymentMethod === "wallet";
      },
    },
    cash: {
      type: String,
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
