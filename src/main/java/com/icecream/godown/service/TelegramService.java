package com.icecream.godown.service;

import java.net.URI;
import java.net.URLEncoder;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class TelegramService {

    @Value("${telegram.bot.token}")
    private String botToken;

    @Value("${telegram.chat.id}")
    private String chatId;

    private final HttpClient httpClient = HttpClient.newHttpClient();

    public void sendStockTelegram(
            String productName,
            String qrCode,
            String transactionType,
            int quantity,
            int previousStock,
            int newStock,
            String labourName) {

        String emoji = "IN".equalsIgnoreCase(transactionType)
                ? "📥" : "📤";

        String text
                = emoji + " STOCK " + transactionType.toUpperCase() + "\n\n"
                + "Product: " + productName + "\n"
                + "QR Code: " + qrCode + "\n"
                + "Quantity: " + quantity + "\n"
                + "Previous Stock: " + previousStock + "\n"
                + "Current Stock: " + newStock + "\n"
                + "Done By: " + labourName;

        try {
            String encodedText = URLEncoder.encode(
                    text, StandardCharsets.UTF_8);

            String url = "https://api.telegram.org/bot"
                    + botToken
                    + "/sendMessage?chat_id="
                    + chatId
                    + "&text="
                    + encodedText;

            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(url))
                    .GET()
                    .build();

            HttpResponse<String> response = httpClient.send(
                    request,
                    HttpResponse.BodyHandlers.ofString());

            if (response.statusCode() != 200
                    || !response.body().contains("\"ok\":true")) {
                System.err.println(
                        "Telegram notification failed: "
                        + response.body());
            }

        } catch (Exception e) {
            System.err.println(
                    "Could not send Telegram notification: "
                    + e.getMessage());
        }
    }
}
