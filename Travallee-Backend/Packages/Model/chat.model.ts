import mongoose from 'mongoose';

const chatSchema = new mongoose.Schema(
  {
    room: {
      type: String,
      required: true,
      index: true,
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'UserModel',
      required: true,
    },
    senderName: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    messageType: {
      type: String,
      enum: ['text', 'image', 'file'],
      default: 'text',
    },
    attachmentUrl: {
      type: String,
      default: null,
    },
    readBy: [
      {
        userId: mongoose.Schema.Types.ObjectId,
        readAt: Date,
      },
    ],
    isEdited: {
      type: Boolean,
      default: false,
    },
    editedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

// Compound index for efficient room queries
chatSchema.index({ room: 1, createdAt: -1 });
chatSchema.index({ sender: 1 });

export const chatModel = mongoose.model('chats', chatSchema);
