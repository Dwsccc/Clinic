const db = require('../models');
const ChatRoom = db.ChatRoom;
const Message = db.Message;

exports.createChatRoom = async (req, res) => {
  const { user_id, admin_id } = req.body;

  try {
    const room = await ChatRoom.create({ user_id, admin_id });
    res.status(201).json(room);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getChatRoomsForUser = async (req, res) => {
  try {
    // Lấy tất cả các phòng chat của người dùng
    const rooms = await ChatRoom.findAll({ where: { user_id: req.user.id } });
    res.json(rooms);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.sendMessage = async (req, res) => {
  const { chat_room_id, message } = req.body;
  const sender_id = req.user.id;

  try {
    // Tạo tin nhắn mới trong phòng chat
    const msg = await Message.create({ chat_room_id, sender_id, message });
    res.status(201).json(msg);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getMessages = async (req, res) => {
  const { chat_room_id } = req.params;

  try {
    // Lấy danh sách tin nhắn trong phòng chat
    const messages = await Message.findAll({
      where: { chat_room_id },
      order: [['created_at', 'ASC']]  // Sắp xếp theo thời gian
    });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
