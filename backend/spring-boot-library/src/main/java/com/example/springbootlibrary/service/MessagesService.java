package com.example.springbootlibrary.service;

import com.example.springbootlibrary.dao.MessageRepository;
import com.example.springbootlibrary.entity.Message;
import com.example.springbootlibrary.requestmodels.AdminquestionRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
@Transactional
public class MessagesService {

    private MessageRepository messageRepository;

    @Autowired
    public MessagesService(MessageRepository messageRepository) {
        this.messageRepository = messageRepository;
    }

    public void postMessage(Message messageRequest, String userEmail) {
        Message message = new Message(messageRequest.getTitle(), messageRequest.getQuestion());
        message.setUserEmail(userEmail);
        messageRepository.save(message);
    }

    public void putMessage(AdminquestionRequest adminquestionRequest, String userEmail) throws Exception {
        Optional<Message> message = messageRepository.findById(adminquestionRequest.getId());
        if(!message.isPresent()) {
            throw new Exception("Message not found");
        }

        message.get().setResponse(adminquestionRequest.getResponse());
        message.get().setAdminEmail(userEmail);
        message.get().setClosed(true);

        messageRepository.save(message.get());
    }
}
