import * as messageModel from '../models/messageModel.js';

export const getAllMessages = async (req, res) => {
  try {
    const messages = await messageModel.getAllMessages();
    res.send(messages);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error retrieving messages');
  }
};

export const getMessageById = async (req, res) => {
  const { id } = req.params;
  try {
    const message = await messageModel.getMessageById(id);
    if (message) {
      res.send(message);
    } else {
      res.status(404).send('Message not found');
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Error retrieving message');
  }
};

export const createMessage = async (req, res) => {
  const { content, senderId, receiverId } = req.body;
  try {
    const newMessage = await messageModel.createMessage(content, senderId, receiverId);
    res.status(201).send(newMessage);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error creating message');
  }
};

export const updateMessage = async (req, res) => {
  const { id } = req.params;
  const { content } = req.body;
  try {
    const updatedMessage = await messageModel.updateMessage(id, content);
    if (updatedMessage) {
      res.send(updatedMessage);
    } else {
      res.status(404).send('Message not found');
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Error updating message');
  }
};

export const deleteMessage = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await messageModel.deleteMessage(id);
    if (result.affectedRows > 0) {
      res.send(`Message with ID ${id} has been deleted`);
    } else {
      res.status(404).send('Message not found');
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Error deleting message');
  }
};
