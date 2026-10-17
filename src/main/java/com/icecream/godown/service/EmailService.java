package com.icecream.godown.service;

import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    private final JavaMailSender mailSender;

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public void sendStockEmail(
            String productName,
            String qrCode,
            String transactionType,
            int quantity,
            int previousStock,
            int newStock) {

        SimpleMailMessage message = new SimpleMailMessage();

        message.setTo("kdramaaddiction347@gmail.com");

        message.setSubject(
                "Stock " + transactionType + " Alert - " + productName
        );

        message.setText(
                "Stock " + transactionType + " notification\n\n" +
                "Product: " + productName + "\n" +
                "QR Code: " + qrCode + "\n" +
                "Quantity: " + quantity + "\n" +
                "Previous Stock: " + previousStock + "\n" +
                "New Stock: " + newStock + "\n"
        );

        mailSender.send(message);
    }
}